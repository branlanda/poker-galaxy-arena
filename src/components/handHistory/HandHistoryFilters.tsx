
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HandHistoryFilters as Filters } from '@/types/handHistory';
import { CalendarDays, Filter, RotateCcw } from 'lucide-react';

interface HandHistoryFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  onApplyFilters: () => void;
  onResetFilters: () => void;
}

export const HandHistoryFilters: React.FC<HandHistoryFiltersProps> = ({
  filters,
  onFiltersChange,
  onApplyFilters,
  onResetFilters
}) => {
  const updateFilter = (key: keyof Filters, value: any) => {
    // Convert "ALL" back to undefined for the filter
    const filterValue = value === 'ALL' ? undefined : value;
    onFiltersChange({ ...filters, [key]: filterValue });
  };

  return (
    <Card className="bg-navy/70 border-emerald/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Filter className="h-5 w-5 mr-2" />
          Hand History Filters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Date Range */}
          <div className="space-y-2">
            <Label className="text-white">From Date</Label>
            <Input
              type="date"
              value={filters.dateFrom || ''}
              onChange={(e) => updateFilter('dateFrom', e.target.value)}
              className="bg-navy/50 border-emerald/20 text-white"
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-white">To Date</Label>
            <Input
              type="date"
              value={filters.dateTo || ''}
              onChange={(e) => updateFilter('dateTo', e.target.value)}
              className="bg-navy/50 border-emerald/20 text-white"
            />
          </div>

          {/* Game Type */}
          <div className="space-y-2">
            <Label className="text-white">Game Type</Label>
            <Select
              value={filters.gameType || 'ALL'}
              onValueChange={(value) => updateFilter('gameType', value)}
            >
              <SelectTrigger className="bg-navy/50 border-emerald/20 text-white">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All</SelectItem>
                <SelectItem value="TEXAS_HOLDEM">Texas Hold'em</SelectItem>
                <SelectItem value="OMAHA">Omaha</SelectItem>
                <SelectItem value="SEVEN_CARD_STUD">Seven Card Stud</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table Type */}
          <div className="space-y-2">
            <Label className="text-white">Table Type</Label>
            <Select
              value={filters.tableType || 'ALL'}
              onValueChange={(value) => updateFilter('tableType', value)}
            >
              <SelectTrigger className="bg-navy/50 border-emerald/20 text-white">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All</SelectItem>
                <SelectItem value="CASH">Cash Game</SelectItem>
                <SelectItem value="TOURNAMENT">Tournament</SelectItem>
                <SelectItem value="SIT_N_GO">Sit & Go</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Result Filter */}
          <div className="space-y-2">
            <Label className="text-white">Result</Label>
            <Select
              value={filters.result || 'ALL'}
              onValueChange={(value) => updateFilter('result', value as any)}
            >
              <SelectTrigger className="bg-navy/50 border-emerald/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All</SelectItem>
                <SelectItem value="WINS">Wins Only</SelectItem>
                <SelectItem value="LOSSES">Losses Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Pot Range */}
          <div className="space-y-2">
            <Label className="text-white">Minimum Pot</Label>
            <Input
              type="number"
              placeholder="0"
              value={filters.minPot || ''}
              onChange={(e) => updateFilter('minPot', e.target.value ? Number(e.target.value) : undefined)}
              className="bg-navy/50 border-emerald/20 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-white">Maximum Pot</Label>
            <Input
              type="number"
              placeholder="No limit"
              value={filters.maxPot || ''}
              onChange={(e) => updateFilter('maxPot', e.target.value ? Number(e.target.value) : undefined)}
              className="bg-navy/50 border-emerald/20 text-white"
            />
          </div>

          {/* Table Name */}
          <div className="space-y-2">
            <Label className="text-white">Table Name</Label>
            <Input
              placeholder="Search table..."
              value={filters.tableName || ''}
              onChange={(e) => updateFilter('tableName', e.target.value || undefined)}
              className="bg-navy/50 border-emerald/20 text-white"
            />
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <Button onClick={onApplyFilters} className="bg-emerald text-white hover:bg-emerald/80">
            <Filter className="h-4 w-4 mr-2" />
            Apply Filters
          </Button>
          <Button onClick={onResetFilters} variant="outline" className="border-emerald/20 text-white hover:bg-emerald/10">
            <RotateCcw className="h-4 w-4 mr-2" />
            Clear
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
