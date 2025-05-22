
import type { Meta, StoryObj } from '@storybook/react';
import { PokerChip } from './PokerChip';

const meta: Meta<typeof PokerChip> = {
  title: 'Poker/PokerChip',
  component: PokerChip,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'number',
      description: 'Chip value',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the chip',
    },
  },
};

export default meta;
type Story = StoryObj<typeof PokerChip>;

export const Default: Story = {
  args: {
    value: 5,
    size: 'md',
  },
};

export const Small: Story = {
  args: {
    value: 10,
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    value: 100,
    size: 'lg',
  },
};

export const DifferentValues: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <PokerChip value={1} />
      <PokerChip value={5} />
      <PokerChip value={10} />
      <PokerChip value={25} />
      <PokerChip value={50} />
      <PokerChip value={100} />
      <PokerChip value={500} />
      <PokerChip value={1000} />
      <PokerChip value={5000} />
    </div>
  ),
};

export const SizeComparison: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <PokerChip value={100} size="sm" />
      <PokerChip value={100} size="md" />
      <PokerChip value={100} size="lg" />
    </div>
  ),
};
