
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
      code: 'AS'
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
      code: 'KH'
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
      code: 'QD'
    },
    size: 'sm',
  },
};

export const LargeCard: Story = {
  args: {
    card: {
      value: 'J',
      suit: 'clubs',
      code: 'JC'
    },
    size: 'lg',
  },
};

export const SuitVariants: Story = {
  render: () => (
    <div className="flex gap-2">
      <PokerCard card={{ value: 'A', suit: 'hearts', code: 'AH' }} />
      <PokerCard card={{ value: 'A', suit: 'diamonds', code: 'AD' }} />
      <PokerCard card={{ value: 'A', suit: 'clubs', code: 'AC' }} />
      <PokerCard card={{ value: 'A', suit: 'spades', code: 'AS' }} />
    </div>
  ),
};

export const RankVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2 max-w-[400px]">
      <PokerCard card={{ value: '2', suit: 'spades', code: '2S' }} />
      <PokerCard card={{ value: '3', suit: 'spades', code: '3S' }} />
      <PokerCard card={{ value: '4', suit: 'spades', code: '4S' }} />
      <PokerCard card={{ value: '5', suit: 'spades', code: '5S' }} />
      <PokerCard card={{ value: '6', suit: 'spades', code: '6S' }} />
      <PokerCard card={{ value: '7', suit: 'spades', code: '7S' }} />
      <PokerCard card={{ value: '8', suit: 'spades', code: '8S' }} />
      <PokerCard card={{ value: '9', suit: 'spades', code: '9S' }} />
      <PokerCard card={{ value: '10', suit: 'spades', code: '10S' }} />
      <PokerCard card={{ value: 'J', suit: 'spades', code: 'JS' }} />
      <PokerCard card={{ value: 'Q', suit: 'spades', code: 'QS' }} />
      <PokerCard card={{ value: 'K', suit: 'spades', code: 'KS' }} />
      <PokerCard card={{ value: 'A', suit: 'spades', code: 'AS' }} />
    </div>
  ),
};
