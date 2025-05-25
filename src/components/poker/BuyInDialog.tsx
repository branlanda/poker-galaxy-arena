
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';

interface BuyInDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (amount: number) => void;
  seatNumber: number | null;
  minBuyIn: number;
  maxBuyIn: number;
}

export function BuyInDialog({
  open,
  onOpenChange,
  onConfirm,
  seatNumber,
  minBuyIn,
  maxBuyIn
}: BuyInDialogProps) {
  const [buyIn, setBuyIn] = useState(minBuyIn);
  
  const handleConfirm = () => {
    onConfirm(buyIn);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Buy In to Seat {seatNumber !== null ? seatNumber + 1 : ''}</DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="flex justify-between text-sm">
            <span>Min: {minBuyIn}</span>
            <span>Max: {maxBuyIn}</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Slider
              value={[buyIn]}
              min={minBuyIn}
              max={maxBuyIn}
              step={minBuyIn / 10}
              onValueChange={(values) => setBuyIn(values[0])}
              className="flex-1"
            />
            <Input
              type="number"
              min={minBuyIn}
              max={maxBuyIn}
              value={buyIn}
              onChange={(e) => setBuyIn(Number(e.target.value))}
              className="w-24"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleConfirm}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
