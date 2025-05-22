
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
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, Filter, Search, SortDesc } from "lucide-react";
import { useTranslation } from '@/hooks/useTranslation';
import { Badge } from '@/components/ui/badge';
import { useDeviceInfo } from '@/hooks/use-mobile';

interface LobbyFiltersProps {
  filters: TableFilters;
  onChange: (filters: TableFilters) => void;
  onReset: () => void;
}

export function LobbyFilters({ filters, onChange, onReset }: LobbyFiltersProps) {
  const [blindsRange, setBlindsRange] = useState<number[]>(filters.blindsRange);
  const [buyInRange, setBuyInRange] = useState<number[]>(filters.buyInRange);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const { t } = useTranslation();
  const { isMobile } = useDeviceInfo();
  
  // Count active filters
  useEffect(() => {
    let count = 0;
    
    if (filters.searchQuery) count++;
    if (filters.tableType !== 'ALL') count++;
    if (filters.showActive) count++;
    if (!filters.showFull) count++;
    if (!filters.showEmpty) count++;
    if (!filters.showPrivate) count++;
    if (filters.blindsRange[0] !== DEFAULT_FILTERS.blindsRange[0] ||
        filters.blindsRange[1] !== DEFAULT_FILTERS.blindsRange[1]) count++;
    if (filters.buyInRange[0] !== DEFAULT_FILTERS.buyInRange[0] ||
        filters.buyInRange[1] !== DEFAULT_FILTERS.buyInRange[1]) count++;
    if (filters.sortBy !== DEFAULT_FILTERS.sortBy) count++;
    
    setActiveFiltersCount(count);
  }, [filters]);
  
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
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 items-start">
        {/* Quick Search */}
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <Input
            type="text"
            id="search"
            placeholder={t('searchTablesByName', 'Buscar mesas por nombre...')}
            value={filters.searchQuery}
            onChange={(e) => updateFilter({ searchQuery: e.target.value })}
            className="pl-10"
          />
        </div>
        
        {/* Quick Filter Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button 
            variant={filters.showActive ? "primary" : "outline"} 
            size="sm"
            onClick={() => updateFilter({ showActive: !filters.showActive })}
            className="whitespace-nowrap"
          >
            {t('activeGames', 'Juegos Activos')}
          </Button>
          
          <Button 
            variant={!filters.showFull ? "outline" : "ghost"} 
            size="sm"
            onClick={() => updateFilter({ showFull: !filters.showFull })}
            className="whitespace-nowrap"
          >
            {filters.showFull ? t('hideFull', 'Ocultar Completas') : t('showFull', 'Mostrar Completas')}
          </Button>
          
          {/* Filter Toggle Button */}
          <CollapsibleTrigger asChild onClick={() => setIsFilterOpen(!isFilterOpen)}>
            <Button variant="outline" size="sm" className="whitespace-nowrap relative">
              <Filter className="h-4 w-4 mr-2" />
              {t('moreFilters', 'Más Filtros')}
              <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
              {activeFiltersCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </CollapsibleTrigger>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onReset}
            className="whitespace-nowrap"
            disabled={activeFiltersCount === 0}
          >
            {t('reset', 'Reiniciar')}
          </Button>
        </div>
      </div>
      
      {/* Advanced Filters */}
      <Collapsible open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <CollapsibleContent>
          <div className="bg-navy/30 border border-emerald/10 rounded-lg p-4 md:p-6 mt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Table Type */}
              <div className="space-y-2">
                <Label htmlFor="table-type">{t('tableType', 'Tipo de Mesa')}</Label>
                <Select 
                  value={filters.tableType} 
                  onValueChange={(value) => updateFilter({ tableType: value as TableType })}
                >
                  <SelectTrigger id="table-type">
                    <SelectValue placeholder={t('all', 'Todas')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">{t('allTypes', 'Todos los Tipos')}</SelectItem>
                    <SelectItem value="CASH">{t('cashGame', 'Cash Game')}</SelectItem>
                    <SelectItem value="TOURNAMENT">{t('tournament', 'Torneo')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
                
              {/* Sorting */}
              <div className="space-y-2">
                <Label htmlFor="sort-by">{t('sortBy', 'Ordenar Por')}</Label>
                <Select 
                  value={filters.sortBy} 
                  onValueChange={(value) => updateFilter({ sortBy: value as any })}
                >
                  <SelectTrigger id="sort-by">
                    <SelectValue placeholder={t('latest', 'Recientes')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="activity">{t('mostActive', 'Más Activas')}</SelectItem>
                    <SelectItem value="players">{t('mostPlayers', 'Más Jugadores')}</SelectItem>
                    <SelectItem value="newest">{t('newest', 'Más Nuevas')}</SelectItem>
                    <SelectItem value="blinds_asc">{t('smallestBlinds', 'Ciegas Menores')}</SelectItem>
                    <SelectItem value="blinds_desc">{t('largestBlinds', 'Ciegas Mayores')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
              
            <div className={`grid grid-cols-1 ${isMobile ? '' : 'md:grid-cols-2'} gap-4 mt-4`}>
              {/* Blinds Range */}
              <div className="space-y-2">
                <Label>{t('blindsRange', 'Rango de Ciegas')} ({blindsRange[0]} - {blindsRange[1]})</Label>
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
                <Label>{t('buyInRange', 'Rango de Compra')} ({buyInRange[0]} - {buyInRange[1]})</Label>
                <Slider
                  defaultValue={filters.buyInRange}
                  min={0}
                  max={10000}
                  step={100}
                  onValueChange={(value) => setBuyInRange(value)}
                />
              </div>
            </div>
              
            <div className={`grid grid-cols-1 ${isMobile ? 'grid-cols-2' : 'md:grid-cols-3'} gap-4 mt-4`}>
              {/* Show Full Tables */}
              <div className="flex items-center space-x-2">
                <Switch
                  id="show-full"
                  checked={filters.showFull}
                  onCheckedChange={(checked) => updateFilter({ showFull: checked })}
                />
                <Label htmlFor="show-full">{t('showFullTables', 'Mostrar Mesas Completas')}</Label>
              </div>
                
              {/* Show Empty Tables */}
              <div className="flex items-center space-x-2">
                <Switch
                  id="show-empty"
                  checked={filters.showEmpty}
                  onCheckedChange={(checked) => updateFilter({ showEmpty: checked })}
                />
                <Label htmlFor="show-empty">{t('showEmptyTables', 'Mostrar Mesas Vacías')}</Label>
              </div>
                
              {/* Show Private Tables */}
              <div className="flex items-center space-x-2">
                <Switch
                  id="show-private"
                  checked={filters.showPrivate}
                  onCheckedChange={(checked) => updateFilter({ showPrivate: checked })}
                />
                <Label htmlFor="show-private">{t('showPrivateTables', 'Mostrar Mesas Privadas')}</Label>
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
