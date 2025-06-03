
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { POKER_VARIANTS, PokerVariant } from '@/types/pokerVariants';

interface VariantSelectorProps {
  value: PokerVariant;
  onValueChange: (variant: PokerVariant) => void;
  disabled?: boolean;
}

export const VariantSelector: React.FC<VariantSelectorProps> = ({
  value,
  onValueChange,
  disabled = false
}) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-300">
        Variante de Poker
      </label>
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-slate-800 border-slate-600">
          {Object.entries(POKER_VARIANTS).map(([key, config]) => (
            <SelectItem key={key} value={key} className="text-white hover:bg-slate-700">
              <div className="flex items-center justify-between w-full">
                <div>
                  <div className="font-medium">{config.name}</div>
                  <div className="text-xs text-gray-400">{config.description}</div>
                </div>
                <div className="flex gap-1 ml-4">
                  <Badge variant="secondary" className="text-xs">
                    {config.maxPlayers} max
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {config.holeCards} cartas
                  </Badge>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
