
import type { Meta, StoryObj } from '@storybook/react';
import { BetActions } from './BetActions';
import { useGameStore } from '@/stores/game';

// Mock the useGameStore
const mockPlaceBet = async (playerId: string, amount: number, action: any) => {
  console.log('Mock placeBet called with:', { playerId, amount, action });
  return Promise.resolve();
};

// Override the useGameStore implementation for Storybook
vi.mock('@/stores/game', () => ({
  useGameStore: () => ({
    placeBet: mockPlaceBet,
  }),
}));

const meta: Meta<typeof BetActions> = {
  title: 'Poker/BetActions',
  component: BetActions,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    playerId: {
      control: 'text',
      description: 'ID of the player',
    },
    playerStack: {
      control: 'number',
      description: 'Amount of chips the player has',
    },
    currentBet: {
      control: 'number',
      description: 'Current bet on the table',
    },
    playerBet: {
      control: 'number',
      description: 'Amount the player has already bet',
    },
  },
};

export default meta;
type Story = StoryObj<typeof BetActions>;

export const CheckOrBet: Story = {
  args: {
    playerId: 'player-123',
    playerStack: 1000,
    currentBet: 0,
    playerBet: 0,
  },
};

export const CallOrRaise: Story = {
  args: {
    playerId: 'player-123',
    playerStack: 1000,
    currentBet: 20,
    playerBet: 0,
  },
};

export const LowStack: Story = {
  args: {
    playerId: 'player-123',
    playerStack: 50,
    currentBet: 40,
    playerBet: 0,
  },
};

export const AlreadyBet: Story = {
  args: {
    playerId: 'player-123',
    playerStack: 1000,
    currentBet: 40,
    playerBet: 20,
  },
};
