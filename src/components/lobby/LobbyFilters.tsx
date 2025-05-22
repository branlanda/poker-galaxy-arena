import { useState, useEffect } from 'react';
import { TableFilters, TableType } from '@/types/lobby';
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LobbyFiltersProps {
  filters: TableFilters;
  onChange: (filters: TableFilters) => void;
  onReset: () => void;
}

export function LobbyFilters({ filters, onChange, onReset }: LobbyFiltersProps) {
  const [blindsRange, setBlindsRange] = useState<number[]>(filters.blindsRange);
  const [buyInRange, setBuyInRange] = useState<number[]>(filters.buyInRange);
  
  // Debounce range updates
  useEffect(() => {
    const timer = setTimeout(() => {
      onChange({
        ...filters,
        blindsRange: [blindsRange[0], blindsRange[1]],
        buyInRange: [buyInRange[0], buyInRange[1]],
      });
    }, 500); // 500ms debounce
    
    return () => clearTimeout(timer);
  }, [blindsRange, buyInRange]);
  
  const updateFilter = (newFilters: Partial<TableFilters>) => {
    onChange({ ...filters, ...newFilters });
  };

  return (
    <div className="bg-navy/30 border border-emerald/10 rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Filters</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Search Query */}
        <div className="space-y-2">
          <Label htmlFor="search">Search Table</Label>
          <Input
            type="text"
            id="search"
            placeholder="Search by table name..."
            value={filters.searchQuery}
            onChange={(e) => updateFilter({ searchQuery: e.target.value })}
          />
        </div>
        
        {/* Table Type */}
        <div className="space-y-2">
          <Label htmlFor="table-type">Table Type</Label>
          <Select 
            value={filters.tableType} 
            onValueChange={(value) => updateFilter({ tableType: value as TableType })}
          >
            <SelectTrigger id="table-type">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Types</SelectItem>
              <SelectItem value="CASH">Cash Game</SelectItem>
              <SelectItem value="TOURNAMENT">Tournament</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {/* Blinds Range */}
        <div className="space-y-2">
          <Label>Blinds Range ({blindsRange[0]} - {blindsRange[1]})</Label>
          <Slider
            defaultValue={filters.blindsRange}
            min={0}
            max={10000}
            step={100}
            onValueChange={(value) => setBlindsRange(value)}
          />
        </div>
        
        {/* Buy-in Range */}
        <div className="space-y-2">
          <Label>Buy-in Range ({buyInRange[0]} - {buyInRange[1]})</Label>
          <Slider
            defaultValue={filters.buyInRange}
            min={0}
            max={10000}
            step={100}
            onValueChange={(value) => setBuyInRange(value)}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {/* Show Full Tables */}
        <div className="flex items-center space-x-2">
          <Switch
            id="show-full"
            checked={filters.showFull}
            onCheckedChange={(checked) => updateFilter({ showFull: checked })}
          />
          <Label htmlFor="show-full">Show Full Tables</Label>
        </div>
        
        {/* Show Empty Tables */}
        <div className="flex items-center space-x-2">
          <Switch
            id="show-empty"
            checked={filters.showEmpty}
            onCheckedChange={(checked) => updateFilter({ showEmpty: checked })}
          />
          <Label htmlFor="show-empty">Show Empty Tables</Label>
        </div>
        
        {/* Show Private Tables */}
        <div className="flex items-center space-x-2">
          <Switch
            id="show-private"
            checked={filters.showPrivate}
            onCheckedChange={(checked) => updateFilter({ showPrivate: checked })}
          />
          <Label htmlFor="show-private">Show Private Tables</Label>
        </div>
      </div>
      
      <Button variant="outline" className="mt-6 w-full" onClick={onReset}>
        Reset Filters
      </Button>
    </div>
  );
}
