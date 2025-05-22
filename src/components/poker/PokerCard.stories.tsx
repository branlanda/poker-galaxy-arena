
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
      description: 'Card data with rank and suit',
    },
  },
};

export default meta;
type Story = StoryObj<typeof PokerCard>;

export const Default: Story = {
  args: {
    card: {
      rank: 'A',
      suit: 'spades',
    },
    faceDown: false,
    size: 'md',
  },
};

export const FaceDown: Story = {
  args: {
    card: {
      rank: 'K',
      suit: 'hearts',
    },
    faceDown: true,
    size: 'md',
  },
};

export const SmallCard: Story = {
  args: {
    card: {
      rank: 'Q',
      suit: 'diamonds',
    },
    size: 'sm',
  },
};

export const LargeCard: Story = {
  args: {
    card: {
      rank: 'J',
      suit: 'clubs',
    },
    size: 'lg',
  },
};

export const SuitVariants: Story = {
  render: () => (
    <div className="flex gap-2">
      <PokerCard card={{ rank: 'A', suit: 'hearts' }} />
      <PokerCard card={{ rank: 'A', suit: 'diamonds' }} />
      <PokerCard card={{ rank: 'A', suit: 'clubs' }} />
      <PokerCard card={{ rank: 'A', suit: 'spades' }} />
    </div>
  ),
};

export const RankVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2 max-w-[400px]">
      <PokerCard card={{ rank: '2', suit: 'spades' }} />
      <PokerCard card={{ rank: '3', suit: 'spades' }} />
      <PokerCard card={{ rank: '4', suit: 'spades' }} />
      <PokerCard card={{ rank: '5', suit: 'spades' }} />
      <PokerCard card={{ rank: '6', suit: 'spades' }} />
      <PokerCard card={{ rank: '7', suit: 'spades' }} />
      <PokerCard card={{ rank: '8', suit: 'spades' }} />
      <PokerCard card={{ rank: '9', suit: 'spades' }} />
      <PokerCard card={{ rank: '10', suit: 'spades' }} />
      <PokerCard card={{ rank: 'J', suit: 'spades' }} />
      <PokerCard card={{ rank: 'Q', suit: 'spades' }} />
      <PokerCard card={{ rank: 'K', suit: 'spades' }} />
      <PokerCard card={{ rank: 'A', suit: 'spades' }} />
    </div>
  ),
};
