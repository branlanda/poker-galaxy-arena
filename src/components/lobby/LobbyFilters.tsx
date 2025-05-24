
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { TableFilters, TableType, SortOption } from '@/types/lobby';
import { useTranslation } from '@/hooks/useTranslation';
import { Search, SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { motion, AnimatePresence } from 'framer-motion';

interface LobbyFiltersProps {
  filters: TableFilters;
  onFilterChange: (filters: Partial<TableFilters>) => void;
}

export function LobbyFilters({ filters, onFilterChange }: LobbyFiltersProps) {
  const { t } = useTranslation();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [blindsRange, setBlindsRange] = useState<[number, number]>(filters.blindsRange);
  const [buyInRange, setBuyInRange] = useState<[number, number]>(filters.buyInRange);
  
  // Apply slider changes after a delay to prevent too many updates
  const handleBlindsChange = (value: number[]) => {
    setBlindsRange([value[0], value[1]]);
    onFilterChange({ blindsRange: [value[0], value[1]] });
  };
  
  const handleBuyInChange = (value: number[]) => {
    setBuyInRange([value[0], value[1]]);
    onFilterChange({ buyInRange: [value[0], value[1]] });
  };

  return (
    <div className="space-y-4 bg-navy-800/50 rounded-lg p-4 border border-emerald/10">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            className="pl-8"
            placeholder={t('lobby.searchByName')}
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
          />
        </div>
        
        <div className="flex gap-2">
          <Select 
            value={filters.tableType} 
            onValueChange={(value) => onFilterChange({ tableType: value as TableType | 'ALL' })}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder={t('lobby.tableType')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">{t('lobby.allTableTypes')}</SelectItem>
              <SelectItem value="CASH">{t('lobby.cashGame')}</SelectItem>
              <SelectItem value="TOURNAMENT">{t('lobby.tournament')}</SelectItem>
            </SelectContent>
          </Select>
          
          <Select 
            value={filters.sortBy} 
            onValueChange={(value) => onFilterChange({ sortBy: value as SortOption })}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder={t('lobby.sortBy')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="activity">{t('lobby.sortActivity')}</SelectItem>
              <SelectItem value="players">{t('lobby.sortPlayers')}</SelectItem>
              <SelectItem value="newest">{t('lobby.sortNewest')}</SelectItem>
              <SelectItem value="blinds_asc">{t('lobby.sortBlindsAsc')}</SelectItem>
              <SelectItem value="blinds_desc">{t('lobby.sortBlindsDesc')}</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => setFiltersOpen(!filtersOpen)}
            className={filtersOpen ? 'bg-emerald/10' : ''}
          >
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <AnimatePresence>
        {filtersOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-emerald/10">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">{t('lobby.blindsRange')}</h3>
                  <div className="space-y-4">
                    <Slider
                      value={[blindsRange[0], blindsRange[1]]}
                      min={0}
                      max={1000}
                      step={10}
                      onValueChange={handleBlindsChange}
                      className="my-4"
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        ${blindsRange[0]} - ${blindsRange[1]}
                      </span>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setBlindsRange([0, 1000]);
                          onFilterChange({ blindsRange: [0, 1000] });
                        }}
                      >
                        {t('common.reset')}
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">{t('lobby.buyInRange')}</h3>
                  <div className="space-y-4">
                    <Slider
                      value={[buyInRange[0], buyInRange[1]]}
                      min={0}
                      max={10000}
                      step={100}
                      onValueChange={handleBuyInChange}
                      className="my-4"
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        ${buyInRange[0]} - ${buyInRange[1]}
                      </span>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setBuyInRange([0, 10000]);
                          onFilterChange({ buyInRange: [0, 10000] });
                        }}
                      >
                        {t('common.reset')}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="showEmpty" className="flex items-center space-x-2 cursor-pointer">
                    <span>{t('lobby.showEmptyTables')}</span>
                  </Label>
                  <Switch 
                    id="showEmpty"
                    checked={filters.showEmpty}
                    onCheckedChange={(checked) => onFilterChange({ showEmpty: checked })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="showFull" className="flex items-center space-x-2 cursor-pointer">
                    <span>{t('lobby.showFullTables')}</span>
                  </Label>
                  <Switch 
                    id="showFull"
                    checked={filters.showFull}
                    onCheckedChange={(checked) => onFilterChange({ showFull: checked })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="showPrivate" className="flex items-center space-x-2 cursor-pointer">
                    <span>{t('lobby.showPrivateTables')}</span>
                  </Label>
                  <Switch 
                    id="showPrivate"
                    checked={filters.showPrivate}
                    onCheckedChange={(checked) => onFilterChange({ showPrivate: checked })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="showActive" className="flex items-center space-x-2 cursor-pointer">
                    <span>{t('lobby.onlyActiveTables')}</span>
                  </Label>
                  <Switch 
                    id="showActive"
                    checked={filters.showActive}
                    onCheckedChange={(checked) => onFilterChange({ showActive: checked })}
                  />
                </div>
                
                <div className="flex justify-end mt-4">
                  <Button
                    variant="outline"
                    onClick={() => onFilterChange({
                      searchQuery: '',
                      tableType: 'ALL',
                      blindsRange: [0, 1000],
                      buyInRange: [0, 10000],
                      showFull: true,
                      showEmpty: true,
                      showPrivate: true,
                      showActive: false,
                      sortBy: 'activity'
                    })}
                  >
                    {t('lobby.resetAllFilters')}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
