
import React from 'react';
import { render, screen } from '@/test/utils';
import TournamentLobby from '@/pages/Tournaments/TournamentLobby';
import { TournamentType, TournamentStatus } from '@/types/tournaments';

// Mock the hooks
vi.mock('@/hooks/useTournaments');
vi.mock('@/hooks/useTranslation');
vi.mock('@/stores/auth');

const mockUseTournaments = require('@/hooks/useTournaments').useTournaments;
const mockUseTranslation = require('@/hooks/useTranslation').useTranslation;
const mockUseAuth = require('@/stores/auth').useAuth;

describe('TournamentLobby', () => {
  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string) => key,
    });
    
    mockUseAuth.mockReturnValue({
      user: { id: '1', username: 'testuser' },
    });
  });

  it('renders tournament list correctly', () => {
    const mockTournaments = [
      {
        id: '1',
        name: 'Test Tournament',
        description: 'Test Description',
        tournament_type: TournamentType.MULTI_TABLE,
        status: TournamentStatus.REGISTERING,
        buy_in: 100,
        max_players: 100,
        players_registered: 25,
        prize_pool: 10000,
        start_date: '2024-01-01',
        created_at: '2024-01-01',
      },
    ];

    mockUseTournaments.mockReturnValue({
      tournaments: mockTournaments,
      loading: false,
      error: '',
      filters: {
        searchQuery: '',
        type: 'ALL',
        status: 'ALL',
      },
      setFilters: vi.fn(),
      fetchTournaments: vi.fn(),
      refreshTournaments: vi.fn(),
    });

    render(<TournamentLobby />);

    expect(screen.getByText('Test Tournament')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    mockUseTournaments.mockReturnValue({
      tournaments: [],
      loading: true,
      error: '',
      filters: {},
      setFilters: vi.fn(),
      fetchTournaments: vi.fn(),
      refreshTournaments: vi.fn(),
    });

    render(<TournamentLobby />);

    // Should show loading skeletons
    expect(document.querySelectorAll('.animate-pulse')).toHaveLength(6);
  });
});
