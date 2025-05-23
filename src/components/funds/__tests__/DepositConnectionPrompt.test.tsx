
import React from 'react';
import { render, screen } from '@/test/utils';
import DepositConnectionPrompt from '../DepositConnectionPrompt';

// Mock the wallet connect component
vi.mock('@/components/wallet/WalletConnect', () => ({
  WalletConnect: () => <button data-testid="wallet-connect">Connect Wallet</button>
}));

// Mock the useTranslation hook
vi.mock('@/hooks/useTranslation', () => ({
  useTranslation: () => ({
    t: (key: string, defaultValue: string) => defaultValue || key
  })
}));

describe('DepositConnectionPrompt', () => {
  test('renders without crashing', () => {
    render(<DepositConnectionPrompt />);
    
    // Check for key elements
    expect(screen.getByText(/Conecta tu wallet para continuar/i)).toBeInTheDocument();
    expect(screen.getByText(/Para depositar fondos a tu cuenta/i)).toBeInTheDocument();
    expect(screen.getByTestId('wallet-connect')).toBeInTheDocument();
  });

  test('contains wallet connect button', () => {
    render(<DepositConnectionPrompt />);
    const connectButton = screen.getByTestId('wallet-connect');
    expect(connectButton).toBeInTheDocument();
  });

  test('contains learn more link', () => {
    render(<DepositConnectionPrompt />);
    const learnMoreLink = screen.getByText(/Aprender más/i);
    expect(learnMoreLink).toBeInTheDocument();
    expect(learnMoreLink.closest('a')).toHaveAttribute('href', '/funds');
  });

  test('displays supported wallets text', () => {
    render(<DepositConnectionPrompt />);
    expect(screen.getByText(/Soportamos MetaMask, WalletConnect y más/i)).toBeInTheDocument();
  });
});
