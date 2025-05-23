
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import GameRoom from '../GameRoom';
import { useGameStore } from '@/stores/game';
import { useAuth } from '@/stores/auth';
import { useGameRoom } from '@/hooks/useGameRoom';
import { BrowserRouter } from 'react-router-dom';

// Mock hooks
vi.mock('@/hooks/useGameRoom', () => ({
  useGameRoom: vi.fn(),
}));

vi.mock('@/stores/game', () => ({
  useGameStore: vi.fn(),
}));

vi.mock('@/stores/auth', () => ({
  useAuth: vi.fn(),
}));

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ id: 'test-table-id' }),
    useNavigate: () => vi.fn(),
  };
});

describe('GameRoom Integration Tests', () => {
  const mockHandleSitDown = vi.fn().mockResolvedValue(undefined);
  const mockLeaveTable = vi.fn().mockResolvedValue(undefined);
  const mockPlaceBet = vi.fn().mockResolvedValue(undefined);
  const mockFold = vi.fn().mockResolvedValue(undefined);
  
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock auth
    (useAuth as any).mockReturnValue({
      user: { id: 'user-123', alias: 'TestPlayer' }
    });
    
    // Mock game store
    (useGameStore as any).mockReturnValue({
      placeBet: mockPlaceBet,
      fold: mockFold
    });
    
    // Mock useGameRoom hook
    (useGameRoom as any).mockReturnValue({
      table: {
        id: 'test-table-id',
        name: 'Test Table', 
        small_blind: 1,
        big_blind: 2,
        min_buy_in: 100,
        max_buy_in: 200,
        max_players: 9
      },
      players: [],
      gameState: {
        tableId: 'test-table-id',
        phase: 'WAITING',
        pot: 0,
        currentBet: 0,
        activePlayerId: null,
        dealer: 0,
        smallBlind: 1,
        bigBlind: 2,
        communityCards: [],
        seats: Array(9).fill(null),
        lastAction: null,
      },
      loading: false,
      gameLoading: false,
      gameError: null,
      isPlayerSeated: false,
      isPlayerTurn: false,
      playerSeatIndex: -1,
      userId: 'user-123',
      handleSitDown: mockHandleSitDown,
      leaveTable: mockLeaveTable
    });
  });

  it('renders the game room correctly', async () => {
    render(<GameRoom />, { wrapper: BrowserRouter });
    
    await waitFor(() => {
      expect(screen.getByText(/leave table/i)).toBeInTheDocument();
    });
  });

  it('handles sit down action', async () => {
    render(<GameRoom />, { wrapper: BrowserRouter });
    
    // Find a seat
    const seatButton = await screen.findByText(/Sit Here/i);
    expect(seatButton).toBeInTheDocument();
    
    // Click the seat
    await act(async () => {
      userEvent.click(seatButton);
    });
    
    await waitFor(() => {
      expect(mockHandleSitDown).toHaveBeenCalled();
    });
  });
  
  it('handles player actions when it is their turn', async () => {
    // Update mocks to indicate it's the player's turn
    (useGameRoom as any).mockReturnValue({
      table: {
        id: 'test-table-id',
        name: 'Test Table', 
        small_blind: 1,
        big_blind: 2,
        min_buy_in: 100,
        max_buy_in: 200,
        max_players: 9
      },
      players: [
        { player_id: 'user-123', seat_number: 0, stack: 100 }
      ],
      gameState: {
        tableId: 'test-table-id',
        phase: 'FLOP',
        pot: 10,
        currentBet: 2,
        activePlayerId: 'user-123',
        dealer: 2,
        smallBlind: 1,
        bigBlind: 2,
        communityCards: [
          { rank: 'A', suit: 'hearts' },
          { rank: 'K', suit: 'spades' },
          { rank: 'Q', suit: 'clubs' }
        ],
        seats: Array(9).fill(null).map((_, idx) => idx === 0 ? {
          playerId: 'user-123',
          playerName: 'TestPlayer',
          stack: 100,
          bet: 0,
          cards: [
            { rank: 'A', suit: 'diamonds' },
            { rank: 'K', suit: 'diamonds' }
          ],
          isActive: true,
          isDealer: false,
          isSmallBlind: false,
          isBigBlind: false,
          isFolded: false,
          isAllIn: false,
          isWinner: false
        } : null),
        lastAction: null,
      },
      loading: false,
      gameLoading: false,
      gameError: null,
      isPlayerSeated: true,
      isPlayerTurn: true,
      playerSeatIndex: 0,
      userId: 'user-123',
      handleSitDown: mockHandleSitDown,
      leaveTable: mockLeaveTable
    });
    
    render(<GameRoom />, { wrapper: BrowserRouter });
    
    // Check if action buttons are visible
    await waitFor(() => {
      expect(screen.getByText(/Fold/i)).toBeInTheDocument();
      expect(screen.getByText(/Call/i)).toBeInTheDocument();
      expect(screen.getByText(/Raise/i)).toBeInTheDocument();
    });
    
    // Test fold action
    await act(async () => {
      userEvent.click(screen.getByText(/Fold/i));
    });
    
    await waitFor(() => {
      expect(mockFold).toHaveBeenCalled();
    });
  });
  
  it('shows error state when there is an error', async () => {
    (useGameRoom as any).mockReturnValue({
      loading: false,
      gameLoading: false,
      gameError: 'Test error',
      table: null
    });
    
    render(<GameRoom />, { wrapper: BrowserRouter });
    expect(screen.queryByText(/leave table/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Test error/i)).toBeInTheDocument();
  });
  
  it('allows a player to leave the table', async () => {
    (useGameRoom as any).mockReturnValue({
      table: {
        id: 'test-table-id',
        name: 'Test Table', 
        small_blind: 1,
        big_blind: 2,
        min_buy_in: 100,
        max_buy_in: 200,
        max_players: 9
      },
      players: [
        { player_id: 'user-123', seat_number: 0, stack: 100 }
      ],
      gameState: {
        tableId: 'test-table-id',
        phase: 'WAITING',
        pot: 0,
        currentBet: 0,
        activePlayerId: null,
        dealer: 0,
        smallBlind: 1,
        bigBlind: 2,
        communityCards: [],
        seats: Array(9).fill(null),
        lastAction: null,
      },
      loading: false,
      gameLoading: false,
      gameError: null,
      isPlayerSeated: true,
      isPlayerTurn: false,
      playerSeatIndex: 0,
      userId: 'user-123',
      handleSitDown: mockHandleSitDown,
      leaveTable: mockLeaveTable
    });
    
    render(<GameRoom />, { wrapper: BrowserRouter });
    
    const leaveButton = screen.getByText(/Leave Table/i);
    expect(leaveButton).toBeInTheDocument();
    
    await act(async () => {
      userEvent.click(leaveButton);
    });
    
    await waitFor(() => {
      expect(mockLeaveTable).toHaveBeenCalled();
    });
  });
});
