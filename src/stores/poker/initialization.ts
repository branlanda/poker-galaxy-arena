
import { supabase } from '@/lib/supabase';
import { PokerGameEngine } from '@/utils/poker/gameEngine';
import { mapGameStateFromDb, mapPlayerStateFromDb, mapGameActionFromDb } from './mappers';
import { toast } from '@/hooks/use-toast';

export class GameInitializer {
  constructor(
    private setState: (updates: any) => void,
    private getState: () => any
  ) {}

  async initializeGame(tableId: string) {
    try {
      this.setState({ isLoading: true, error: null });
      
      // Check if a game exists for this table
      const { data: existingGame, error: gameError } = await supabase
        .from('table_games')
        .select('*')
        .eq('table_id', tableId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (gameError && gameError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        throw gameError;
      }
      
      let gameId;
      
      if (existingGame) {
        // Use existing game
        this.setState({ game: mapGameStateFromDb(existingGame) });
        gameId = existingGame.id;
      } else {
        // Create a new game
        const { data: newGame, error: createError } = await supabase
          .from('table_games')
          .insert({
            table_id: tableId,
            phase: 'WAITING',
            pot: 0,
            current_bet: 0
          })
          .select()
          .single();
          
        if (createError) throw createError;
        
        this.setState({ game: mapGameStateFromDb(newGame) });
        gameId = newGame.id;
      }
      
      // Get player states
      const { data: playerStates, error: playersError } = await supabase
        .from('table_player_states')
        .select('*')
        .eq('game_id', gameId);
        
      if (playersError) throw playersError;
      
      this.setState({ players: playerStates.map(mapPlayerStateFromDb) });
      
      // Get recent actions
      const { data: recentActions, error: actionsError } = await supabase
        .from('table_actions')
        .select('*')
        .eq('game_id', gameId)
        .order('created_at', { ascending: false })
        .limit(20);
        
      if (actionsError) throw actionsError;
      
      this.setState({ 
        actions: recentActions.map(mapGameActionFromDb),
        isLoading: false
      });
      
      // After loading game and players, initialize game engine
      const { game, players } = this.getState();
      if (game && players.length > 0) {
        const engine = new PokerGameEngine(game, players);
        this.setState({ gameEngine: engine });
      }
      
      this.setState({ isLoading: false });
      
      // Return game ID for subscription setup
      return gameId;
      
    } catch (error: any) {
      console.error('Error initializing game:', error);
      this.setState({ 
        error: error.message || 'Failed to initialize game',
        isLoading: false
      });
      toast({
        title: 'Error',
        description: error.message || 'Failed to initialize game',
        variant: 'destructive',
      });
      throw error;
    }
  }
}
