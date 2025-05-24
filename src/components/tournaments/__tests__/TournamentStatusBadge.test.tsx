
import React from 'react';
import { render, screen } from '@/test/utils';
import { describe, it, expect, vi } from 'vitest';
import { TournamentStatusBadge } from '../TournamentStatusBadge';
import { TournamentStatus } from '@/types/tournaments';

// Mock the useTranslation hook
vi.mock('@/hooks/useTranslation', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'tournaments.status.scheduled': 'Scheduled',
        'tournaments.status.registering': 'Registering',
        'tournaments.status.running': 'Running',
        'tournaments.status.break': 'Break',
        'tournaments.status.finalTable': 'Final Table',
        'tournaments.status.completed': 'Completed',
        'tournaments.status.cancelled': 'Cancelled',
      };
      return translations[key] || key;
    }
  })
}));

describe('TournamentStatusBadge', () => {
  const statuses: TournamentStatus[] = [
    TournamentStatus.SCHEDULED,
    TournamentStatus.REGISTERING,
    TournamentStatus.RUNNING,
    TournamentStatus.BREAK,
    TournamentStatus.FINAL_TABLE,
    TournamentStatus.COMPLETED,
    TournamentStatus.CANCELLED
  ];

  it.each(statuses)('renders correct text for %s status', (status) => {
    render(<TournamentStatusBadge status={status} />);
    
    // Check that we have the appropriate text for each status
    const expectedTexts: Record<TournamentStatus, string> = {
      [TournamentStatus.SCHEDULED]: 'Scheduled',
      [TournamentStatus.REGISTERING]: 'Registering',
      [TournamentStatus.RUNNING]: 'Running',
      [TournamentStatus.BREAK]: 'Break',
      [TournamentStatus.FINAL_TABLE]: 'Final Table',
      [TournamentStatus.COMPLETED]: 'Completed',
      [TournamentStatus.CANCELLED]: 'Cancelled',
    };
    
    expect(screen.getByText(expectedTexts[status])).toBeInTheDocument();
  });

  it('applies the correct color class for each status', () => {
    const { rerender } = render(<TournamentStatusBadge status={TournamentStatus.SCHEDULED} />);
    
    // Check SCHEDULED status has blue color
    expect(document.querySelector('.text-blue-500')).toBeInTheDocument();
    
    // Check REGISTERING status has emerald color
    rerender(<TournamentStatusBadge status={TournamentStatus.REGISTERING} />);
    expect(document.querySelector('.text-emerald-500')).toBeInTheDocument();
    
    // Check RUNNING status has amber color
    rerender(<TournamentStatusBadge status={TournamentStatus.RUNNING} />);
    expect(document.querySelector('.text-amber-500')).toBeInTheDocument();
    
    // Check CANCELLED status has red color
    rerender(<TournamentStatusBadge status={TournamentStatus.CANCELLED} />);
    expect(document.querySelector('.text-red-500')).toBeInTheDocument();
  });
});
