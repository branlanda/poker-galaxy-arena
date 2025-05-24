
import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import TournamentLobby from '@/pages/Tournaments/TournamentLobby';
import { TournamentType, TournamentStatus } from '@/types/tournaments';

// Mock the hooks
jest.mock('@/hooks/useTournaments');
jest.mock('@/hooks/useTranslation');
jest.mock('@/stores/auth');

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
      setFilters: jest.fn(),
      fetchTournaments: jest.fn(),
      refreshTournaments: jest.fn(),
    });

    render(
      <BrowserRouter>
        <TournamentLobby />
      </BrowserRouter>
    );

    expect(screen.getByText('Test Tournament')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    mockUseTournaments.mockReturnValue({
      tournaments: [],
      loading: true,
      error: '',
      filters: {},
      setFilters: jest.fn(),
      fetchTournaments: jest.fn(),
      refreshTournaments: jest.fn(),
    });

    render(
      <BrowserRouter>
        <TournamentLobby />
      </BrowserRouter>
    );

    // Should show loading skeletons
    expect(document.querySelectorAll('.animate-pulse')).toHaveLength(6);
  });
});
