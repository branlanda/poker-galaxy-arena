
import React from 'react';
import { render, screen } from '@/test/utils';
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
    'SCHEDULED',
    'REGISTERING',
    'RUNNING',
    'BREAK',
    'FINAL_TABLE',
    'COMPLETED',
    'CANCELLED'
  ];

  test.each(statuses)('renders correct text for %s status', (status) => {
    render(<TournamentStatusBadge status={status} />);
    
    // Check that we have the appropriate text for each status
    const expectedTexts: Record<TournamentStatus, string> = {
      'SCHEDULED': 'Scheduled',
      'REGISTERING': 'Registering',
      'RUNNING': 'Running',
      'BREAK': 'Break',
      'FINAL_TABLE': 'Final Table',
      'COMPLETED': 'Completed',
      'CANCELLED': 'Cancelled',
    };
    
    expect(screen.getByText(expectedTexts[status])).toBeInTheDocument();
  });

  test('applies the correct color class for each status', () => {
    const { rerender } = render(<TournamentStatusBadge status="SCHEDULED" />);
    
    // Check SCHEDULED status has blue color
    expect(document.querySelector('.text-blue-500')).toBeInTheDocument();
    
    // Check REGISTERING status has emerald color
    rerender(<TournamentStatusBadge status="REGISTERING" />);
    expect(document.querySelector('.text-emerald-500')).toBeInTheDocument();
    
    // Check RUNNING status has amber color
    rerender(<TournamentStatusBadge status="RUNNING" />);
    expect(document.querySelector('.text-amber-500')).toBeInTheDocument();
    
    // Check CANCELLED status has red color
    rerender(<TournamentStatusBadge status="CANCELLED" />);
    expect(document.querySelector('.text-red-500')).toBeInTheDocument();
  });
});
