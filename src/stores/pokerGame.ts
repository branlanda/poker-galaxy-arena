
import { create } from 'zustand';
import { PokerGameStore } from './poker/types';
import { GameSubscriptions } from './poker/subscriptions';
import { PokerGameActions } from './poker/gameActions';
import { GameInitializer } from './poker/initialization';

export const usePokerGameStore = create<PokerGameStore>((set, get) => {
  const subscriptions = new GameSubscriptions();
  const gameActions = new PokerGameActions(get, set);
  const gameInitializer = new GameInitializer(set, get);
  
  return {
    // Initial state
    game: null,
    players: [],
    actions: [],
    isLoading: false,
    error: null,
    playerHandVisible: true,
    gameEngine: null,
    
    initializeGame: async (tableId: string) => {
      const gameId = await gameInitializer.initializeGame(tableId);
      if (gameId) {
        get().subscribeToGame(gameId);
      }
    },
    
    subscribeToGame: (gameId: string) => {
      subscriptions.subscribe(gameId, {
        updateGame: (game) => set({ game }),
        updatePlayers: (playerUpdates) => {
          set((state) => {
            if (playerUpdates.length === 1 && playerUpdates[0].deleted) {
              return {
                players: state.players.filter(player => player.id !== playerUpdates[0].id)
              };
            } else if (playerUpdates.length === 1) {
              const updatedPlayer = playerUpdates[0];
              const existingPlayerIndex = state.players.findIndex(p => p.id === updatedPlayer.id);
              if (existingPlayerIndex >= 0) {
                const newPlayers = [...state.players];
                newPlayers[existingPlayerIndex] = updatedPlayer;
                return { players: newPlayers };
              } else {
                return { players: [...state.players, updatedPlayer] };
              }
            }
            return state;
          });
        },
        addAction: (action) => {
          set((state) => ({
            actions: [action, ...state.actions].slice(0, 50)
          }));
        }
      });
    },
    
    unsubscribeFromGame: () => {
      subscriptions.unsubscribe();
    },
    
    startNewHand: () => gameActions.startNewHand(),
    processGameAction: (playerId, action, amount) => gameActions.processGameAction(playerId, action, amount),
    handleShowdown: () => gameActions.handleShowdown(),
    performAction: (playerId, action, amount) => gameActions.processGameAction(playerId, action, amount),
    sitDown: (gameId, playerId, seatNumber, buyIn) => gameActions.sitDown(gameId, playerId, seatNumber, buyIn),
    leaveTable: (playerId) => gameActions.leaveTable(playerId),
    
    togglePlayerHandVisibility: () => {
      set((state) => ({
        playerHandVisible: !state.playerHandVisible
      }));
    }
  };
});
