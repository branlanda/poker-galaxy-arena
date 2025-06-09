
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PokerAction {
  tableId: string;
  playerId: string;
  action: 'FOLD' | 'CHECK' | 'CALL' | 'BET' | 'RAISE' | 'ALL_IN' | 'START_HAND';
  amount?: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { tableId, playerId, action, amount }: PokerAction = await req.json();

    console.log(`Processing action: ${action} from player ${playerId} at table ${tableId}`);

    let result;

    switch (action) {
      case 'START_HAND':
        result = await startNewHand(supabase, tableId);
        break;
      
      case 'FOLD':
      case 'CHECK':
      case 'CALL':
      case 'BET':
      case 'RAISE':
      case 'ALL_IN':
        result = await processPlayerAction(supabase, tableId, playerId, action, amount || 0);
        break;
      
      default:
        return new Response(
          JSON.stringify({ success: false, error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

    // Broadcast the game state update to all players at the table
    if (result.success) {
      await broadcastGameUpdate(supabase, tableId, result);
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Poker engine error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function startNewHand(supabase: any, tableId: string) {
  console.log(`Starting new hand for table ${tableId}`);
  
  // Call the database function to start a new hand
  const { data, error } = await supabase.rpc('start_new_hand', {
    p_table_id: tableId
  });

  if (error) {
    console.error('Error starting new hand:', error);
    return { success: false, error: error.message };
  }

  // Deal hole cards to players
  await dealHoleCards(supabase, tableId, data.hand_number);

  return data;
}

async function processPlayerAction(
  supabase: any, 
  tableId: string, 
  playerId: string, 
  action: string, 
  amount: number
) {
  console.log(`Processing ${action} action from ${playerId} for amount ${amount}`);

  // Validate the action is legal
  const isValid = await validatePlayerAction(supabase, tableId, playerId, action, amount);
  if (!isValid.valid) {
    return { success: false, error: isValid.error };
  }

  // Process the action
  const { data, error } = await supabase.rpc('process_player_action', {
    p_table_id: tableId,
    p_player_id: playerId,
    p_action_type: action,
    p_amount: amount
  });

  if (error) {
    console.error('Error processing action:', error);
    return { success: false, error: error.message };
  }

  // Check if we need to advance to next phase or next player
  await checkGameProgression(supabase, tableId);

  return data;
}

async function dealHoleCards(supabase: any, tableId: string, handNumber: number) {
  // Get active players
  const { data: players, error } = await supabase
    .from('players_at_table')
    .select('player_id')
    .eq('table_id', tableId)
    .eq('status', 'SITTING');

  if (error || !players) {
    console.error('Error getting players:', error);
    return;
  }

  // Get deck from game state
  const { data: gameState } = await supabase
    .from('game_engine_state')
    .select('deck_state')
    .eq('table_id', tableId)
    .single();

  let deck = gameState?.deck_state || [];
  
  // Shuffle deck (simple Fisher-Yates shuffle)
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  // Deal 2 cards to each player
  let cardIndex = 0;
  for (const player of players) {
    const holeCards = [deck[cardIndex], deck[cardIndex + 1]];
    cardIndex += 2;

    // Insert player hand
    await supabase
      .from('player_hands')
      .insert({
        table_id: tableId,
        player_id: player.player_id,
        hand_number: handNumber,
        hole_cards: holeCards
      });
  }

  // Update deck state
  const remainingDeck = deck.slice(cardIndex);
  await supabase
    .from('game_engine_state')
    .update({ deck_state: remainingDeck })
    .eq('table_id', tableId);

  console.log(`Dealt hole cards to ${players.length} players`);
}

async function validatePlayerAction(
  supabase: any, 
  tableId: string, 
  playerId: string, 
  action: string, 
  amount: number
) {
  // Get current game state
  const { data: gameState } = await supabase
    .from('game_engine_state')
    .select('*')
    .eq('table_id', tableId)
    .single();

  if (!gameState || !gameState.is_hand_active) {
    return { valid: false, error: 'No active hand' };
  }

  // Get player's current state
  const { data: player } = await supabase
    .from('players_at_table')
    .select('*')
    .eq('table_id', tableId)
    .eq('player_id', playerId)
    .single();

  if (!player) {
    return { valid: false, error: 'Player not found at table' };
  }

  // Basic validation - can be expanded
  switch (action) {
    case 'BET':
    case 'RAISE':
      if (amount <= 0) {
        return { valid: false, error: 'Bet amount must be positive' };
      }
      if (amount > player.stack) {
        return { valid: false, error: 'Insufficient chips' };
      }
      break;
    
    case 'CALL':
      const callAmount = gameState.current_bet;
      if (callAmount > player.stack) {
        return { valid: false, error: 'Insufficient chips to call' };
      }
      break;
  }

  return { valid: true };
}

async function checkGameProgression(supabase: any, tableId: string) {
  // Get current game state
  const { data: gameState } = await supabase
    .from('game_engine_state')
    .select('*')
    .eq('table_id', tableId)
    .single();

  if (!gameState) return;

  // Get all actions in current hand
  const { data: actions } = await supabase
    .from('hand_actions')
    .select('*')
    .eq('table_id', tableId)
    .eq('hand_number', gameState.current_hand_number)
    .order('action_order', { ascending: true });

  // Get active players
  const { data: players } = await supabase
    .from('players_at_table')
    .select('*')
    .eq('table_id', tableId)
    .eq('status', 'SITTING');

  // Check if betting round is complete (simplified logic)
  const playersWhoNeedToAct = players?.filter(p => {
    const playerActions = actions?.filter(a => a.player_id === p.player_id) || [];
    return playerActions.length === 0; // No actions yet
  }) || [];

  // If all players have acted, advance to next phase
  if (playersWhoNeedToAct.length === 0) {
    await advanceGamePhase(supabase, tableId, gameState);
  }
}

async function advanceGamePhase(supabase: any, tableId: string, currentState: any) {
  let nextPhase = currentState.game_phase;
  let communityCards = currentState.community_cards || [];

  // Get remaining deck
  const deck = currentState.deck_state || [];

  switch (currentState.game_phase) {
    case 'PREFLOP':
      // Deal the flop (3 cards)
      communityCards = [deck[0], deck[1], deck[2]];
      nextPhase = 'FLOP';
      break;
    
    case 'FLOP':
      // Deal the turn (1 card)
      communityCards = [...communityCards, deck[3]];
      nextPhase = 'TURN';
      break;
    
    case 'TURN':
      // Deal the river (1 card)
      communityCards = [...communityCards, deck[4]];
      nextPhase = 'RIVER';
      break;
    
    case 'RIVER':
      // Go to showdown
      nextPhase = 'SHOWDOWN';
      await processShowdown(supabase, tableId);
      break;
  }

  if (nextPhase !== currentState.game_phase) {
    await supabase
      .from('game_engine_state')
      .update({
        game_phase: nextPhase,
        community_cards: communityCards,
        current_bet: 0, // Reset betting for new round
        updated_at: new Date().toISOString()
      })
      .eq('table_id', tableId);

    console.log(`Advanced to ${nextPhase} phase for table ${tableId}`);
  }
}

async function processShowdown(supabase: any, tableId: string) {
  // Get all remaining players and their hands
  const { data: playerHands } = await supabase
    .from('player_hands')
    .select('*')
    .eq('table_id', tableId)
    .eq('is_folded', false);

  // Get community cards
  const { data: gameState } = await supabase
    .from('game_engine_state')
    .select('community_cards, pot_amount')
    .eq('table_id', tableId)
    .single();

  if (!playerHands || playerHands.length === 0) return;

  // Simplified winner determination (in reality, you'd evaluate poker hands)
  const winner = playerHands[0]; // For now, just pick the first player
  
  // Award pot to winner
  await supabase
    .from('players_at_table')
    .update({
      stack: supabase.raw(`stack + ${gameState?.pot_amount || 0}`)
    })
    .eq('table_id', tableId)
    .eq('player_id', winner.player_id);

  // End the hand
  await supabase
    .from('game_engine_state')
    .update({
      is_hand_active: false,
      pot_amount: 0,
      game_phase: 'WAITING'
    })
    .eq('table_id', tableId);

  console.log(`Showdown complete for table ${tableId}, winner: ${winner.player_id}`);
}

async function broadcastGameUpdate(supabase: any, tableId: string, result: any) {
  // Get current game state
  const { data: gameState } = await supabase
    .from('game_engine_state')
    .select('*')
    .eq('table_id', tableId)
    .single();

  // Get recent actions
  const { data: recentActions } = await supabase
    .from('hand_actions')
    .select('*')
    .eq('table_id', tableId)
    .order('created_at', { ascending: false })
    .limit(10);

  // Broadcast to realtime channel
  const channel = supabase.channel(`table:${tableId}`);
  
  await channel.send({
    type: 'broadcast',
    event: 'game_update',
    payload: {
      gameState,
      recentActions,
      updateType: result.action || 'game_state_change'
    }
  });

  console.log(`Broadcasted game update for table ${tableId}`);
}
