import React from 'react';
import { Label } from '@/components/ui/label';
import { Check, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Option {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: Option[];
  selected: string[];
  onChange: (selected: string[]) => void;
  label?: string;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  selected,
  onChange,
  label,
}) => {
  const handleSelect = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter(item => item !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <div className="flex flex-wrap gap-2 mb-2">
        {selected.map(value => {
          const option = options.find(opt => opt.value === value);
          return (
            <Badge key={value} variant="outline" className="flex items-center gap-1">
              {option?.label || value}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleSelect(value)}
              />
            </Badge>
          );
        })}
      </div>
      <div className="flex flex-wrap gap-1">
        {options.map(option => (
          <Button
            key={option.value}
            type="button"
            size="sm"
            variant={selected.includes(option.value) ? "primary" : "outline"}
            onClick={() => handleSelect(option.value)}
            className="flex items-center gap-1"
          >
            {selected.includes(option.value) && <Check className="h-3 w-3" />}
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  );
};
