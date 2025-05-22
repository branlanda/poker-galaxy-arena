
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { TableFilters, DEFAULT_FILTERS, TableType } from '@/types/lobby';
import { Search, Filter } from 'lucide-react';

interface LobbyFiltersProps {
  filters: TableFilters;
  onChange: (filters: TableFilters) => void;
  onReset: () => void;
}

export function LobbyFilters({ filters, onChange, onReset }: LobbyFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...filters, searchQuery: e.target.value });
  };
  
  const handleTypeChange = (value: string) => {
    onChange({ ...filters, tableType: value as TableType | 'ALL' });
  };
  
  const handleBlindsChange = (value: number[]) => {
    onChange({ ...filters, blindsRange: [value[0], value[1]] });
  };
  
  const handleBuyInChange = (value: number[]) => {
    onChange({ ...filters, buyInRange: [value[0], value[1]] });
  };
  
  const handleShowFullChange = (checked: boolean) => {
    onChange({ ...filters, showFull: checked });
  };
  
  const handleShowEmptyChange = (checked: boolean) => {
    onChange({ ...filters, showEmpty: checked });
  };
  
  const handleShowPrivateChange = (checked: boolean) => {
    onChange({ ...filters, showPrivate: checked });
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search tables..."
            value={filters.searchQuery}
            onChange={handleSearchChange}
            className="pl-8"
          />
        </div>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => setShowFilters(!showFilters)}
          className={showFilters ? "bg-emerald/10" : ""}
        >
          <Filter className="h-4 w-4" />
        </Button>
        {(showFilters && JSON.stringify(filters) !== JSON.stringify(DEFAULT_FILTERS)) && (
          <Button variant="ghost" size="sm" onClick={onReset}>
            Reset
          </Button>
        )}
      </div>
      
      {showFilters && (
        <div className="border border-emerald/10 rounded-lg p-4 bg-navy/50 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Game Type</Label>
              <Select 
                value={filters.tableType} 
                onValueChange={handleTypeChange}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Types</SelectItem>
                  <SelectItem value="CASH">Cash Game</SelectItem>
                  <SelectItem value="TOURNAMENT">Tournament</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Big Blind Range</Label>
                  <span className="text-xs text-gray-400">
                    {filters.blindsRange[0]} - {filters.blindsRange[1]}
                  </span>
                </div>
                <Slider 
                  defaultValue={[0, 10000]} 
                  min={0} 
                  max={10000} 
                  step={10} 
                  value={[filters.blindsRange[0], filters.blindsRange[1]]} 
                  onValueChange={handleBlindsChange}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Buy-in Range</Label>
                  <span className="text-xs text-gray-400">
                    {filters.buyInRange[0]} - {filters.buyInRange[1]}
                  </span>
                </div>
                <Slider 
                  defaultValue={[0, 10000]} 
                  min={0} 
                  max={10000} 
                  step={100} 
                  value={[filters.buyInRange[0], filters.buyInRange[1]]} 
                  onValueChange={handleBuyInChange}
                />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Switch 
                id="show-full" 
                checked={filters.showFull}
                onCheckedChange={handleShowFullChange}
              />
              <Label htmlFor="show-full">Show Full Tables</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="show-empty" 
                checked={filters.showEmpty}
                onCheckedChange={handleShowEmptyChange}
              />
              <Label htmlFor="show-empty">Show Empty Tables</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="show-private" 
                checked={filters.showPrivate}
                onCheckedChange={handleShowPrivateChange}
              />
              <Label htmlFor="show-private">Show Private Tables</Label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
