
import type { Meta, StoryObj } from '@storybook/react';
import { PokerCard } from './PokerCard';

const meta: Meta<typeof PokerCard> = {
  title: 'Poker/PokerCard',
  component: PokerCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the card',
    },
    faceDown: {
      control: 'boolean',
      description: 'Whether the card is face down or face up',
    },
    card: {
      control: 'object',
      description: 'Card data with value and suit',
    },
  },
};

export default meta;
type Story = StoryObj<typeof PokerCard>;

export const Default: Story = {
  args: {
    card: {
      value: 'A',
      suit: 'spades',
      rank: 'A'
    },
    faceDown: false,
    size: 'md',
  },
};

export const FaceDown: Story = {
  args: {
    card: {
      value: 'K',
      suit: 'hearts',
      rank: 'K'
    },
    faceDown: true,
    size: 'md',
  },
};

export const SmallCard: Story = {
  args: {
    card: {
      value: 'Q',
      suit: 'diamonds',
      rank: 'Q'
    },
    size: 'sm',
  },
};

export const LargeCard: Story = {
  args: {
    card: {
      value: 'J',
      suit: 'clubs',
      rank: 'J'
    },
    size: 'lg',
  },
};

export const SuitVariants: Story = {
  render: () => (
    <div className="flex gap-2">
      <PokerCard card={{ value: 'A', suit: 'hearts', rank: 'A' }} />
      <PokerCard card={{ value: 'A', suit: 'diamonds', rank: 'A' }} />
      <PokerCard card={{ value: 'A', suit: 'clubs', rank: 'A' }} />
      <PokerCard card={{ value: 'A', suit: 'spades', rank: 'A' }} />
    </div>
  ),
};

export const RankVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2 max-w-[400px]">
      <PokerCard card={{ value: '2', suit: 'spades', rank: '2' }} />
      <PokerCard card={{ value: '3', suit: 'spades', rank: '3' }} />
      <PokerCard card={{ value: '4', suit: 'spades', rank: '4' }} />
      <PokerCard card={{ value: '5', suit: 'spades', rank: '5' }} />
      <PokerCard card={{ value: '6', suit: 'spades', rank: '6' }} />
      <PokerCard card={{ value: '7', suit: 'spades', rank: '7' }} />
      <PokerCard card={{ value: '8', suit: 'spades', rank: '8' }} />
      <PokerCard card={{ value: '9', suit: 'spades', rank: '9' }} />
      <PokerCard card={{ value: '10', suit: 'spades', rank: '10' }} />
      <PokerCard card={{ value: 'J', suit: 'spades', rank: 'J' }} />
      <PokerCard card={{ value: 'Q', suit: 'spades', rank: 'Q' }} />
      <PokerCard card={{ value: 'K', suit: 'spades', rank: 'K' }} />
      <PokerCard card={{ value: 'A', suit: 'spades', rank: 'A' }} />
    </div>
  ),
};
