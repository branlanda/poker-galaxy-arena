
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { TournamentFilters, TournamentStatus, TournamentType } from '@/types/tournaments';
import { Search, Filter, X } from 'lucide-react';

export interface TournamentFiltersPanelProps {
  filters: TournamentFilters;
  onFiltersChange: (filters: TournamentFilters) => void;
}

export function TournamentFiltersPanel({ filters, onFiltersChange }: TournamentFiltersPanelProps) {
  const updateFilters = (updates: Partial<TournamentFilters>) => {
    onFiltersChange({ ...filters, ...updates });
  };

  const clearFilters = () => {
    onFiltersChange({
      searchQuery: '',
      status: 'ALL',
      buyInMin: null,
      buyInMax: null,
      type: 'ALL',
      isPrivate: null,
      isFeatured: null
    });
  };

  const hasActiveFilters = () => {
    return filters.searchQuery ||
           (filters.status && filters.status !== 'ALL') ||
           filters.buyInMin !== null ||
           filters.buyInMax !== null ||
           (filters.type && filters.type !== 'ALL') ||
           filters.isPrivate !== null ||
           filters.isFeatured !== null;
  };

  return (
    <Card className="h-fit bg-slate-800/70 border-emerald/20 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center text-white">
            <Filter className="h-5 w-5 mr-2 text-emerald" />
            Filters
          </CardTitle>
          {hasActiveFilters() && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-xs text-gray-400 hover:text-white hover:bg-slate-700/50"
            >
              <X className="h-3 w-3 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search" className="text-gray-300">Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              id="search"
              placeholder="Tournament name..."
              value={filters.searchQuery || ''}
              onChange={(e) => updateFilters({ searchQuery: e.target.value })}
              className="pl-10 bg-slate-800/60 border-emerald/20 text-white placeholder-gray-400"
            />
          </div>
        </div>

        <Separator className="bg-emerald/20" />

        {/* Status Filter */}
        <div className="space-y-3">
          <Label className="text-gray-300">Status</Label>
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={filters.status === 'ALL' ? "default" : "outline"}
              className={`cursor-pointer ${
                filters.status === 'ALL' 
                  ? 'bg-emerald text-white' 
                  : 'bg-slate-700/50 text-gray-300 border-emerald/20 hover:bg-slate-600/50'
              }`}
              onClick={() => updateFilters({ status: 'ALL' })}
            >
              All
            </Badge>
            {Object.values(TournamentStatus).map((status) => (
              <Badge
                key={status}
                variant={filters.status === status ? "default" : "outline"}
                className={`cursor-pointer ${
                  filters.status === status 
                    ? 'bg-emerald text-white' 
                    : 'bg-slate-700/50 text-gray-300 border-emerald/20 hover:bg-slate-600/50'
                }`}
                onClick={() => {
                  updateFilters({ status: status });
                }}
              >
                {status.replace('_', ' ')}
              </Badge>
            ))}
          </div>
        </div>

        <Separator className="bg-emerald/20" />

        {/* Buy-in Range */}
        <div className="space-y-3">
          <Label className="text-gray-300">Buy-in Range</Label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="buyInMin" className="text-xs text-gray-400">Min</Label>
              <Input
                id="buyInMin"
                type="number"
                placeholder="0"
                value={filters.buyInMin || ''}
                onChange={(e) => updateFilters({ 
                  buyInMin: e.target.value ? parseFloat(e.target.value) : null 
                })}
                className="bg-slate-800/60 border-emerald/20 text-white placeholder-gray-400"
              />
            </div>
            <div>
              <Label htmlFor="buyInMax" className="text-xs text-gray-400">Max</Label>
              <Input
                id="buyInMax"
                type="number"
                placeholder="∞"
                value={filters.buyInMax || ''}
                onChange={(e) => updateFilters({ 
                  buyInMax: e.target.value ? parseFloat(e.target.value) : null 
                })}
                className="bg-slate-800/60 border-emerald/20 text-white placeholder-gray-400"
              />
            </div>
          </div>
        </div>

        <Separator className="bg-emerald/20" />

        {/* Tournament Type */}
        <div className="space-y-3">
          <Label className="text-gray-300">Type</Label>
          <div className="space-y-2">
            <Badge
              variant={filters.type === 'ALL' ? "default" : "outline"}
              className={`cursor-pointer w-full justify-center ${
                filters.type === 'ALL' 
                  ? 'bg-emerald text-white' 
                  : 'bg-slate-700/50 text-gray-300 border-emerald/20 hover:bg-slate-600/50'
              }`}
              onClick={() => updateFilters({ type: 'ALL' })}
            >
              All Types
            </Badge>
            {Object.values(TournamentType).map((type) => (
              <Badge
                key={type}
                variant={filters.type === type ? "default" : "outline"}
                className={`cursor-pointer w-full justify-center ${
                  filters.type === type 
                    ? 'bg-emerald text-white' 
                    : 'bg-slate-700/50 text-gray-300 border-emerald/20 hover:bg-slate-600/50'
                }`}
                onClick={() => updateFilters({ type: type })}
              >
                {type.replace('_', ' ')}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
