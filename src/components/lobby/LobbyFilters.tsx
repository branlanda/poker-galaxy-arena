
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/hooks/useTranslation';
import { TableType, TableFilters, SortOption } from '@/types/lobby';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { DEFAULT_FILTERS } from '@/types/lobby';

interface LobbyFiltersProps {
  filters: TableFilters;
  onFilterChange: (filters: TableFilters) => void;
}

export function LobbyFilters({ filters, onFilterChange }: LobbyFiltersProps) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  // Helper function to update a single filter
  const updateFilter = <K extends keyof TableFilters>(key: K, value: TableFilters[K]) => {
    onFilterChange({ ...filters, [key]: value });
  };

  // Reset all filters to defaults
  const resetFilters = () => {
    onFilterChange({
      ...DEFAULT_FILTERS,
      searchQuery: filters.searchQuery, // Preserve search query
    });
  };

  return (
    <Card className="bg-navy/30 border-emerald/10 mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg">{t('filters', 'Filters')}</CardTitle>
            <CardDescription>
              {t('filterDescription', 'Find the perfect table for you')}
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={resetFilters}>
            {t('resetFilters', 'Reset')}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Table Type Filter */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>{t('tableType', 'Table Type')}</Label>
            <div className="flex space-x-2 mt-2">
              {(['ALL', 'CASH', 'TOURNAMENT'] as const).map((type) => (
                <Button
                  key={type}
                  variant={filters.tableType === type ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateFilter('tableType', type)}
                >
                  {t(type.toLowerCase(), type)}
                </Button>
              ))}
            </div>
          </div>

          {/* Sort Options */}
          <div>
            <Label htmlFor="sort-select">{t('sortBy', 'Sort By')}</Label>
            <Select 
              value={filters.sortBy}
              onValueChange={(value) => updateFilter('sortBy', value as SortOption)}
            >
              <SelectTrigger id="sort-select" className="mt-2">
                <SelectValue placeholder={t('sortBy', 'Sort by')} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>{t('sortOptions', 'Sort Options')}</SelectLabel>
                  <SelectItem value="activity">{t('recentActivity', 'Recent Activity')}</SelectItem>
                  <SelectItem value="players">{t('mostPlayers', 'Most Players')}</SelectItem>
                  <SelectItem value="newest">{t('newest', 'Newest Tables')}</SelectItem>
                  <SelectItem value="blinds_asc">{t('blindsLowToHigh', 'Blinds (Low to High)')}</SelectItem>
                  <SelectItem value="blinds_desc">{t('blindsHighToLow', 'Blinds (High to Low)')}</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Blinds Range Filter */}
        <div>
          <div className="flex justify-between mb-1">
            <Label>{t('blinds', 'Blinds Range')}</Label>
            <span className="text-xs text-gray-400">
              {filters.blindsRange[0]} - {filters.blindsRange[1]}
            </span>
          </div>
          <Slider
            value={filters.blindsRange}
            min={DEFAULT_FILTERS.blindsRange[0]}
            max={DEFAULT_FILTERS.blindsRange[1]}
            step={10}
            onValueChange={(value) => updateFilter('blindsRange', value as [number, number])}
          />
        </div>

        {/* Buy-in Range Filter */}
        <div>
          <div className="flex justify-between mb-1">
            <Label>{t('buyIn', 'Buy-in Range')}</Label>
            <span className="text-xs text-gray-400">
              {filters.buyInRange[0]} - {filters.buyInRange[1]}
            </span>
          </div>
          <Slider
            value={filters.buyInRange}
            min={DEFAULT_FILTERS.buyInRange[0]}
            max={DEFAULT_FILTERS.buyInRange[1]}
            step={50}
            onValueChange={(value) => updateFilter('buyInRange', value as [number, number])}
          />
        </div>

        {/* Toggle Filters */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="show-full"
              checked={filters.showFull}
              onCheckedChange={(checked) => updateFilter('showFull', checked)}
            />
            <Label htmlFor="show-full">{t('showFullTables', 'Show Full Tables')}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="show-empty"
              checked={filters.showEmpty}
              onCheckedChange={(checked) => updateFilter('showEmpty', checked)}
            />
            <Label htmlFor="show-empty">{t('showEmptyTables', 'Show Empty Tables')}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="show-private"
              checked={filters.showPrivate}
              onCheckedChange={(checked) => updateFilter('showPrivate', checked)}
            />
            <Label htmlFor="show-private">{t('showPrivateTables', 'Show Private Tables')}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="show-active"
              checked={filters.showActive}
              onCheckedChange={(checked) => updateFilter('showActive', checked)}
            />
            <Label htmlFor="show-active">{t('onlyActiveTables', 'Only Active Tables')}</Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
