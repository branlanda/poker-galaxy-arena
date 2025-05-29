
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { TableFilters } from '@/types/lobby';
import { Search, Filter, X, Settings, DollarSign, Users, Clock, ChevronDown, ChevronUp, Eye, EyeOff, Lock, Unlock, Activity } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { motion, AnimatePresence } from 'framer-motion';

interface LobbyFiltersProps {
  filters: TableFilters;
  onFilterChange: (filters: Partial<TableFilters>) => void;
}

export function LobbyFilters({ filters, onFilterChange }: LobbyFiltersProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(true);

  const hasActiveFilters = () => {
    return filters.searchQuery ||
           filters.tableType !== 'ALL' ||
           filters.buyInRange[0] > 0 ||
           filters.buyInRange[1] < 10000 ||
           filters.showFull !== true ||
           filters.showEmpty !== true ||
           filters.sortBy !== 'activity';
  };

  const clearFilters = () => {
    onFilterChange({
      searchQuery: '',
      tableType: 'ALL',
      buyInRange: [0, 10000],
      blindsRange: [0, 1000],
      showFull: true,
      showEmpty: true,
      showActive: false,
      showPrivate: true,
      sortBy: 'activity'
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.searchQuery) count++;
    if (filters.tableType !== 'ALL') count++;
    if (filters.buyInRange[0] > 0 || filters.buyInRange[1] < 10000) count++;
    if (filters.blindsRange[0] > 0 || filters.blindsRange[1] < 1000) count++;
    if (!filters.showFull || !filters.showEmpty) count++;
    if (filters.showActive) count++;
    if (!filters.showPrivate) count++;
    if (filters.sortBy !== 'activity') count++;
    return count;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-gradient-to-r from-slate-900/95 to-slate-800/95 border-emerald/30 backdrop-blur-lg shadow-2xl">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <CardHeader className="pb-4 cursor-pointer hover:bg-slate-800/30 transition-colors rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-600/20 rounded-lg">
                    <Filter className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-white font-semibold flex items-center gap-2">
                      {t('lobby.filters', 'Filtros Avanzados')}
                      {getActiveFilterCount() > 0 && (
                        <Badge className="bg-emerald-600 text-white text-xs">
                          {getActiveFilterCount()}
                        </Badge>
                      )}
                    </CardTitle>
                    <p className="text-sm text-gray-400 mt-1">
                      Personaliza tu búsqueda de mesas
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {hasActiveFilters() && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        clearFilters();
                      }}
                      className="text-xs text-emerald-400 hover:text-emerald-300 hover:bg-emerald/10"
                    >
                      <X className="h-3 w-3 mr-1" />
                      {t('common.clear', 'Limpiar')}
                    </Button>
                  )}
                  {isOpen ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          
          <AnimatePresence>
            {isOpen && (
              <CollapsibleContent forceMount>
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <CardContent className="space-y-8 pt-0">
                    {/* Search Section */}
                    <div className="space-y-3">
                      <Label htmlFor="search" className="text-gray-300 font-medium flex items-center gap-2">
                        <Search className="h-4 w-4 text-emerald-400" />
                        {t('lobby.search', 'Buscar Mesa')}
                      </Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          id="search"
                          placeholder={t('lobby.searchPlaceholder', 'Nombre de la mesa, creador...')}
                          value={filters.searchQuery || ''}
                          onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
                          className="pl-10 bg-slate-800/60 border-emerald/30 text-white placeholder-gray-400 focus:border-emerald/50 focus:ring-emerald/20"
                        />
                        {filters.searchQuery && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onFilterChange({ searchQuery: '' })}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-slate-700"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>

                    <Separator className="bg-emerald/20" />

                    {/* Game Type and Sort */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label className="text-gray-300 font-medium flex items-center gap-2">
                          <Clock className="h-4 w-4 text-emerald-400" />
                          {t('lobby.gameType', 'Tipo de Juego')}
                        </Label>
                        <Select 
                          value={filters.tableType || 'ALL'} 
                          onValueChange={(value) => onFilterChange({ tableType: value as any })}
                        >
                          <SelectTrigger className="bg-slate-800/60 border-emerald/30 text-white hover:border-emerald/50 focus:ring-emerald/20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-emerald/30">
                            <SelectItem value="ALL" className="text-white hover:bg-slate-700 focus:bg-slate-700">
                              🎯 Todos los Juegos
                            </SelectItem>
                            <SelectItem value="CASH" className="text-white hover:bg-slate-700 focus:bg-slate-700">
                              💰 Juegos de Dinero
                            </SelectItem>
                            <SelectItem value="TOURNAMENT" className="text-white hover:bg-slate-700 focus:bg-slate-700">
                              🏆 Torneos
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-3">
                        <Label className="text-gray-300 font-medium flex items-center gap-2">
                          <Settings className="h-4 w-4 text-emerald-400" />
                          {t('lobby.sortBy', 'Ordenar Por')}
                        </Label>
                        <Select 
                          value={filters.sortBy || 'activity'} 
                          onValueChange={(value) => onFilterChange({ sortBy: value as any })}
                        >
                          <SelectTrigger className="bg-slate-800/60 border-emerald/30 text-white hover:border-emerald/50 focus:ring-emerald/20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-emerald/30">
                            <SelectItem value="activity" className="text-white hover:bg-slate-700 focus:bg-slate-700">
                              ⚡ Actividad Reciente
                            </SelectItem>
                            <SelectItem value="players" className="text-white hover:bg-slate-700 focus:bg-slate-700">
                              👥 Cantidad de Jugadores
                            </SelectItem>
                            <SelectItem value="newest" className="text-white hover:bg-slate-700 focus:bg-slate-700">
                              🆕 Recién Creadas
                            </SelectItem>
                            <SelectItem value="blinds_asc" className="text-white hover:bg-slate-700 focus:bg-slate-700">
                              💵 Stakes (Menor a Mayor)
                            </SelectItem>
                            <SelectItem value="blinds_desc" className="text-white hover:bg-slate-700 focus:bg-slate-700">
                              💸 Stakes (Mayor a Menor)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Separator className="bg-emerald/20" />

                    {/* Buy-in Range */}
                    <div className="space-y-4">
                      <Label className="text-gray-300 font-medium flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-emerald-400" />
                        {t('lobby.buyInRange', 'Rango de Buy-in')}
                      </Label>
                      <div className="space-y-4">
                        <Slider
                          value={filters.buyInRange}
                          onValueChange={(value) => onFilterChange({ buyInRange: value as [number, number] })}
                          max={10000}
                          min={0}
                          step={50}
                          className="w-full"
                        />
                        <div className="flex justify-between items-center text-sm">
                          <div className="bg-slate-800/60 px-3 py-1 rounded-md text-emerald-400 font-medium">
                            ${filters.buyInRange[0].toLocaleString()}
                          </div>
                          <div className="text-gray-400">hasta</div>
                          <div className="bg-slate-800/60 px-3 py-1 rounded-md text-emerald-400 font-medium">
                            ${filters.buyInRange[1].toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Blinds Range */}
                    <div className="space-y-4">
                      <Label className="text-gray-300 font-medium flex items-center gap-2">
                        🎲 Rango de Blinds
                      </Label>
                      <div className="space-y-4">
                        <Slider
                          value={filters.blindsRange}
                          onValueChange={(value) => onFilterChange({ blindsRange: value as [number, number] })}
                          max={1000}
                          min={0}
                          step={5}
                          className="w-full"
                        />
                        <div className="flex justify-between items-center text-sm">
                          <div className="bg-slate-800/60 px-3 py-1 rounded-md text-blue-400 font-medium">
                            ${filters.blindsRange[0]}
                          </div>
                          <div className="text-gray-400">hasta</div>
                          <div className="bg-slate-800/60 px-3 py-1 rounded-md text-blue-400 font-medium">
                            ${filters.blindsRange[1]}
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator className="bg-emerald/20" />

                    {/* Table Options */}
                    <div className="space-y-4">
                      <Label className="text-gray-300 font-medium flex items-center gap-2">
                        <Users className="h-4 w-4 text-emerald-400" />
                        {t('lobby.tableOptions', 'Opciones de Mesa')}
                      </Label>
                      <div className="grid grid-cols-2 gap-3">
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Badge
                            variant={filters.showFull ? "default" : "outline"}
                            className={`cursor-pointer transition-all w-full h-12 flex items-center justify-center gap-2 text-sm ${
                              filters.showFull 
                                ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg' 
                                : 'bg-slate-800/50 text-gray-300 border-emerald/30 hover:bg-emerald/10 hover:text-emerald-300'
                            }`}
                            onClick={() => onFilterChange({ showFull: !filters.showFull })}
                          >
                            {filters.showFull ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                            {t('lobby.showFull', 'Mostrar Llenas')}
                          </Badge>
                        </motion.div>

                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Badge
                            variant={filters.showEmpty ? "default" : "outline"}
                            className={`cursor-pointer transition-all w-full h-12 flex items-center justify-center gap-2 text-sm ${
                              filters.showEmpty 
                                ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg' 
                                : 'bg-slate-800/50 text-gray-300 border-emerald/30 hover:bg-emerald/10 hover:text-emerald-300'
                            }`}
                            onClick={() => onFilterChange({ showEmpty: !filters.showEmpty })}
                          >
                            {filters.showEmpty ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                            {t('lobby.showEmpty', 'Mostrar Vacías')}
                          </Badge>
                        </motion.div>

                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Badge
                            variant={filters.showActive ? "default" : "outline"}
                            className={`cursor-pointer transition-all w-full h-12 flex items-center justify-center gap-2 text-sm ${
                              filters.showActive 
                                ? 'bg-orange-600 text-white hover:bg-orange-700 shadow-lg' 
                                : 'bg-slate-800/50 text-gray-300 border-orange/30 hover:bg-orange/10 hover:text-orange-300'
                            }`}
                            onClick={() => onFilterChange({ showActive: !filters.showActive })}
                          >
                            <Activity className="h-4 w-4" />
                            {t('lobby.activeOnly', 'Solo Activas')}
                          </Badge>
                        </motion.div>

                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Badge
                            variant={filters.showPrivate ? "default" : "outline"}
                            className={`cursor-pointer transition-all w-full h-12 flex items-center justify-center gap-2 text-sm ${
                              filters.showPrivate 
                                ? 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg' 
                                : 'bg-slate-800/50 text-gray-300 border-purple/30 hover:bg-purple/10 hover:text-purple-300'
                            }`}
                            onClick={() => onFilterChange({ showPrivate: !filters.showPrivate })}
                          >
                            {filters.showPrivate ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                            {t('lobby.showPrivate', 'Mostrar Privadas')}
                          </Badge>
                        </motion.div>
                      </div>
                    </div>

                    {/* Quick Filter Presets */}
                    <div className="space-y-4">
                      <Label className="text-gray-300 font-medium flex items-center gap-2">
                        ⚡ Filtros Rápidos
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onFilterChange({ 
                            tableType: 'CASH', 
                            buyInRange: [0, 500],
                            showEmpty: true,
                            showFull: false
                          })}
                          className="bg-slate-800/40 border-emerald/20 text-emerald-400 hover:bg-emerald/10"
                        >
                          💰 Cash Bajos
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onFilterChange({ 
                            tableType: 'TOURNAMENT',
                            sortBy: 'newest'
                          })}
                          className="bg-slate-800/40 border-orange/20 text-orange-400 hover:bg-orange/10"
                        >
                          🏆 Torneos Nuevos
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onFilterChange({ 
                            showActive: true,
                            showEmpty: false,
                            sortBy: 'players'
                          })}
                          className="bg-slate-800/40 border-blue/20 text-blue-400 hover:bg-blue/10"
                        >
                          🔥 Mesas Populares
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </motion.div>
              </CollapsibleContent>
            )}
          </AnimatePresence>
        </Collapsible>
      </Card>
    </motion.div>
  );
}
