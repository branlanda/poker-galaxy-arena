
import { supabase } from '@/lib/supabase';
import { mapGameStateFromDb, mapPlayerStateFromDb, mapGameActionFromDb } from './mappers';
import { toast } from '@/hooks/use-toast';

export class GameSubscriptions {
  private gameChannel: any = null;
  private playersChannel: any = null;
  private actionsChannel: any = null;

  subscribe(gameId: string, updateCallbacks: {
    updateGame: (game: any) => void;
    updatePlayers: (players: any[]) => void;
    addAction: (action: any) => void;
  }) {
    // Clean up any existing subscriptions
    this.unsubscribe();
    
    const { updateGame, updatePlayers, addAction } = updateCallbacks;
    
    // Subscribe to game state changes
    this.gameChannel = supabase
      .channel(`game-state-${gameId}`)
      .on(
        'postgres_changes',
        { 
          event: 'UPDATE',
          schema: 'public',
          table: 'table_games',
          filter: `id=eq.${gameId}`
        },
        (payload) => {
          updateGame(mapGameStateFromDb(payload.new));
        }
      )
      .subscribe();
    
    // Subscribe to player state changes
    this.playersChannel = supabase
      .channel(`player-states-${gameId}`)
      .on(
        'postgres_changes',
        { 
          event: '*',
          schema: 'public',
          table: 'table_player_states',
          filter: `game_id=eq.${gameId}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            updatePlayers([mapPlayerStateFromDb(payload.new)]);
          } else if (payload.eventType === 'UPDATE') {
            updatePlayers([mapPlayerStateFromDb(payload.new)]);
          } else if (payload.eventType === 'DELETE') {
            updatePlayers([{ id: payload.old.id, deleted: true }]);
          }
        }
      )
      .subscribe();
    
    // Subscribe to new game actions
    this.actionsChannel = supabase
      .channel(`game-actions-${gameId}`)
      .on(
        'postgres_changes',
        { 
          event: 'INSERT',
          schema: 'public',
          table: 'table_actions',
          filter: `game_id=eq.${gameId}`
        },
        (payload) => {
          const action = mapGameActionFromDb(payload.new);
          addAction(action);
          
          // Show toast notification for new actions
          toast({
            title: 'Player Action',
            description: `Player performed ${action.action}${action.amount ? ` with amount ${action.amount}` : ''}`,
            duration: 3000,
          });
        }
      )
      .subscribe();
  }

  unsubscribe() {
    // Clean up all subscriptions
    if (this.gameChannel) supabase.removeChannel(this.gameChannel);
    if (this.playersChannel) supabase.removeChannel(this.playersChannel);
    if (this.actionsChannel) supabase.removeChannel(this.actionsChannel);
    
    this.gameChannel = null;
    this.playersChannel = null;
    this.actionsChannel = null;
  }
}
