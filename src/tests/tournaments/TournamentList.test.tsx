
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@/test/utils';
import { TournamentLobby } from '@/pages/Tournaments/TournamentLobby';
import { useTournaments } from '@/hooks/useTournaments';
import { MemoryRouter } from 'react-router-dom';

// Mock the tournaments hook
jest.mock('@/hooks/useTournaments');
const mockUseTournaments = useTournaments as jest.MockedFunction<typeof useTournaments>;

// Mock the useTranslation hook
jest.mock('@/hooks/useTranslation', () => ({
  useTranslation: () => ({
    t: (key: string) => key
  })
}));

// Mock the useAuth hook
jest.mock('@/stores/auth', () => ({
  useAuth: () => ({
    user: null
  })
}));

describe('TournamentLobby', () => {
  beforeEach(() => {
    mockUseTournaments.mockReturnValue({
      tournaments: [
        {
          id: '1',
          name: 'Weekly Tournament',
          description: 'Weekly poker tournament',
          tournament_type: 'MULTI_TABLE',
          status: 'REGISTERING',
          start_time: new Date().toISOString(),
          registration_open_time: new Date(Date.now() - 86400000).toISOString(),
          buy_in: 50,
          prize_pool: 1000,
          fee_percent: 5,
          starting_chips: 10000,
          min_players: 2,
          max_players: 100,
          rebuy_allowed: false,
          addon_allowed: false,
          is_private: false,
          blind_structure: [],
          payout_structure: [],
          current_level: 0,
          is_featured: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          registered_players_count: 10
        }
      ],
      loading: false,
      error: null,
      refreshTournaments: jest.fn()
    });
  });

  test('renders tournaments lobby page', () => {
    render(
      <MemoryRouter>
        <TournamentLobby />
      </MemoryRouter>
    );
    
    expect(screen.getByText('tournaments.lobby')).toBeInTheDocument();
    expect(screen.getByText('Weekly Tournament')).toBeInTheDocument();
  });

  test('displays loading state when loading', () => {
    mockUseTournaments.mockReturnValue({
      tournaments: [],
      loading: true,
      error: null,
      refreshTournaments: jest.fn()
    });

    render(
      <MemoryRouter>
        <TournamentLobby />
      </MemoryRouter>
    );
    
    expect(screen.getByText('loading')).toBeInTheDocument();
  });

  test('displays error when error occurs', () => {
    mockUseTournaments.mockReturnValue({
      tournaments: [],
      loading: false,
      error: 'Failed to load tournaments',
      refreshTournaments: jest.fn()
    });

    render(
      <MemoryRouter>
        <TournamentLobby />
      </MemoryRouter>
    );
    
    expect(screen.getByText('Failed to load tournaments')).toBeInTheDocument();
  });

  test('displays no tournaments message when no tournaments available', () => {
    mockUseTournaments.mockReturnValue({
      tournaments: [],
      loading: false,
      error: null,
      refreshTournaments: jest.fn()
    });

    render(
      <MemoryRouter>
        <TournamentLobby />
      </MemoryRouter>
    );
    
    expect(screen.getByText('tournaments.noTournaments')).toBeInTheDocument();
  });

  test('filters can be changed', async () => {
    const refreshMock = jest.fn();
    mockUseTournaments.mockReturnValue({
      tournaments: [],
      loading: false,
      error: null,
      refreshTournaments: refreshMock
    });

    render(
      <MemoryRouter>
        <TournamentLobby />
      </MemoryRouter>
    );
    
    // Click the refresh button
    fireEvent.click(screen.getByText('refresh'));
    expect(refreshMock).toHaveBeenCalled();
  });
});
