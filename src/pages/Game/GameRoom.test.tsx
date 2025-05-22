
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import GameRoom from './GameRoom';
import { useGameStore } from '@/stores/game';
import { useAuth } from '@/stores/auth';
import { useGameRoom } from '@/hooks/useGameRoom';

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

describe('GameRoom Component', () => {
  const mockHandleSitDown = vi.fn().mockResolvedValue(undefined);
  const mockLeaveTable = vi.fn().mockResolvedValue(undefined);
  
  beforeEach(() => {
    vi.clearAllMocks();
    
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
    render(<GameRoom />);
    
    await waitFor(() => {
      expect(screen.getByText(/leave table/i)).toBeInTheDocument();
    });
  });

  it('shows loading state when data is loading', async () => {
    (useGameRoom as any).mockReturnValue({
      loading: true,
      gameLoading: false,
    });
    
    render(<GameRoom />);
    expect(screen.queryByText(/leave table/i)).not.toBeInTheDocument();
  });

  it('shows error state when there is an error', async () => {
    (useGameRoom as any).mockReturnValue({
      loading: false,
      gameLoading: false,
      gameError: 'Test error',
      table: null
    });
    
    render(<GameRoom />);
    expect(screen.queryByText(/leave table/i)).not.toBeInTheDocument();
  });
});
