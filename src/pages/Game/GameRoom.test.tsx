
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import GameRoom from './GameRoom';
import { useGameStore } from '@/stores/game';
import { useAuth } from '@/stores/auth';

// Mock stores and hooks
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

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({
      data: {
        name: 'Test Table',
        small_blind: 1,
        big_blind: 2,
        min_buy_in: 100,
        max_buy_in: 200
      },
      error: null
    }),
  }
}));

describe('GameRoom Component', () => {
  const mockInitializeGame = vi.fn().mockResolvedValue(undefined);
  const mockDisconnectGame = vi.fn();
  const mockTakeSeat = vi.fn().mockResolvedValue(undefined);
  const mockLeaveSeat = vi.fn().mockResolvedValue(undefined);
  
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock react-router
    vi.mock('react-router-dom', async () => {
      const actual = await vi.importActual('react-router-dom');
      return {
        ...actual,
        useParams: () => ({ tableId: 'test-table-id' }),
        useNavigate: () => vi.fn(),
      };
    });
    
    // Mock game store
    (useGameStore as any).mockReturnValue({
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
      isLoading: false,
      error: null,
      initializeGame: mockInitializeGame,
      disconnectGame: mockDisconnectGame,
      takeSeat: mockTakeSeat,
      leaveSeat: mockLeaveSeat,
    });
    
    // Mock auth store
    (useAuth as any).mockReturnValue({
      user: { id: 'user-123', email: 'player@example.com' },
    });
  });

  it('renders the game room and initializes the game', async () => {
    render(<GameRoom />);
    
    await waitFor(() => {
      expect(mockInitializeGame).toHaveBeenCalledWith('test-table-id');
    });
    
    expect(screen.getByText(/leave table/i)).toBeInTheDocument();
  });

  it('handles sit down action', async () => {
    render(<GameRoom />);
    
    // Wait for component to initialize
    await waitFor(() => {
      expect(mockInitializeGame).toHaveBeenCalled();
    });
    
    // Find all "Sit Down" buttons (there should be 9 since all seats are null)
    const sitDownButtons = await screen.findAllByRole('button', { name: /sit down/i });
    expect(sitDownButtons.length).toBeGreaterThan(0);
    
    // Click the first "Sit Down" button
    sitDownButtons[0].click();
    
    await waitFor(() => {
      expect(mockTakeSeat).toHaveBeenCalledWith(
        0, // seat number
        'user-123', // user ID
        expect.any(String), // player name
        expect.any(Number) // buy-in amount
      );
    });
  });

  it('calls disconnectGame on unmount', async () => {
    const { unmount } = render(<GameRoom />);
    
    await waitFor(() => {
      expect(mockInitializeGame).toHaveBeenCalled();
    });
    
    unmount();
    expect(mockDisconnectGame).toHaveBeenCalled();
  });
});
