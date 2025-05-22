
import React from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { TournamentFilters, DEFAULT_TOURNAMENT_FILTERS, TournamentType, TournamentStatus } from '@/types/tournaments';
import { useTranslation } from '@/hooks/useTranslation';

export interface TournamentFiltersPanelProps {
  filters: TournamentFilters;
  onChange: (filters: TournamentFilters) => void;
}

export function TournamentFiltersPanel({ 
  filters, 
  onChange 
}: TournamentFiltersPanelProps) {
  const { t } = useTranslation();
  
  const handleReset = () => {
    onChange(DEFAULT_TOURNAMENT_FILTERS);
  };
  
  const handleTypeChange = (value: string) => {
    onChange({
      ...filters,
      type: value as TournamentType | 'ALL'
    });
  };
  
  const handleStatusChange = (value: string) => {
    onChange({
      ...filters,
      status: value as TournamentStatus | 'ALL'
    });
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...filters,
      searchQuery: e.target.value
    });
  };
  
  const handleShowPrivateChange = (checked: boolean) => {
    onChange({
      ...filters,
      showPrivate: checked
    });
  };
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="search">{t('search', 'Search')}</Label>
            <Input
              id="search"
              placeholder={t('tournaments.searchPlaceholder', 'Search tournaments...')}
              value={filters.searchQuery || ''}
              onChange={handleSearchChange}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="type">{t('tournaments.type', 'Tournament Type')}</Label>
            <Select
              value={filters.type || 'ALL'}
              onValueChange={handleTypeChange}
            >
              <SelectTrigger id="type" className="mt-1">
                <SelectValue placeholder={t('all', 'All')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">{t('all', 'All')}</SelectItem>
                <SelectItem value="SIT_N_GO">{t('tournaments.types.sitNGo', 'Sit & Go')}</SelectItem>
                <SelectItem value="FREEROLL">{t('tournaments.types.freeroll', 'Freeroll')}</SelectItem>
                <SelectItem value="MULTI_TABLE">{t('tournaments.types.multiTable', 'Multi-Table')}</SelectItem>
                <SelectItem value="SPECIAL_EVENT">{t('tournaments.types.specialEvent', 'Special Event')}</SelectItem>
                <SelectItem value="SATELLITE">{t('tournaments.types.satellite', 'Satellite')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="status">{t('tournaments.status.label', 'Status')}</Label>
            <Select
              value={filters.status || 'ALL'}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger id="status" className="mt-1">
                <SelectValue placeholder={t('all', 'All')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">{t('all', 'All')}</SelectItem>
                <SelectItem value="SCHEDULED">{t('tournaments.status.scheduled', 'Scheduled')}</SelectItem>
                <SelectItem value="REGISTERING">{t('tournaments.status.registering', 'Registering')}</SelectItem>
                <SelectItem value="RUNNING">{t('tournaments.status.running', 'Running')}</SelectItem>
                <SelectItem value="BREAK">{t('tournaments.status.break', 'Break')}</SelectItem>
                <SelectItem value="FINAL_TABLE">{t('tournaments.status.finalTable', 'Final Table')}</SelectItem>
                <SelectItem value="COMPLETED">{t('tournaments.status.completed', 'Completed')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="showPrivate" className="cursor-pointer">
              {t('tournaments.showPrivate', 'Show private tournaments')}
            </Label>
            <Switch 
              id="showPrivate" 
              checked={filters.showPrivate || false}
              onCheckedChange={handleShowPrivateChange}
            />
          </div>
          
          <Button 
            variant="outline" 
            className="w-full mt-2"
            onClick={handleReset}
          >
            {t('resetFilters', 'Reset Filters')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
