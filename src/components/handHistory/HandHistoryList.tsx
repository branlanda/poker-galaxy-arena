
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DetailedHandHistory } from '@/types/handHistory';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  Eye, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Users, 
  Coins,
  Play,
  Share,
  Flag,
  BarChart3
} from 'lucide-react';
import { HandDetailDialog } from './HandDetailDialog';

interface HandHistoryListProps {
  hands: DetailedHandHistory[];
  loading: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

export const HandHistoryList: React.FC<HandHistoryListProps> = ({
  hands,
  loading,
  onLoadMore,
  hasMore
}) => {
  const [selectedHand, setSelectedHand] = useState<DetailedHandHistory | null>(null);

  const formatResult = (result: number) => {
    if (result > 0) {
      return { text: `+Ξ${result.toFixed(2)}`, color: 'text-green-400', icon: TrendingUp };
    } else if (result < 0) {
      return { text: `Ξ${result.toFixed(2)}`, color: 'text-red-400', icon: TrendingDown };
    }
    return { text: 'Ξ0.00', color: 'text-gray-400', icon: Clock };
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return 'N/A';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getHandStrengthColor = (strength?: string) => {
    const strengthColors: Record<string, string> = {
      'ROYAL_FLUSH': 'text-purple-400',
      'STRAIGHT_FLUSH': 'text-blue-400',
      'FOUR_OF_A_KIND': 'text-red-400',
      'FULL_HOUSE': 'text-orange-400',
      'FLUSH': 'text-cyan-400',
      'STRAIGHT': 'text-green-400',
      'THREE_OF_A_KIND': 'text-yellow-400',
      'TWO_PAIR': 'text-pink-400',
      'PAIR': 'text-gray-400',
      'HIGH_CARD': 'text-gray-500'
    };
    return strengthColors[strength || ''] || 'text-gray-400';
  };

  if (loading && hands.length === 0) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="bg-navy/70 border-emerald/20 animate-pulse">
            <CardContent className="p-6">
              <div className="h-20 bg-navy/50 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (hands.length === 0) {
    return (
      <Card className="bg-navy/70 border-emerald/20">
        <CardContent className="p-8 text-center">
          <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold text-white mb-2">No hay historial disponible</h3>
          <p className="text-gray-400">No se encontraron manos con los filtros aplicados.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {hands.map((hand) => {
          const result = formatResult(hand.player_result);
          const ResultIcon = result.icon;
          
          return (
            <Card key={hand.id} className="bg-navy/70 border-emerald/20 hover:border-emerald/40 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center space-x-4">
                      <h3 className="text-lg font-semibold text-white">
                        {hand.table_name} - Mano #{hand.hand_number}
                      </h3>
                      <Badge variant="outline" className="text-emerald border-emerald/30">
                        {hand.game_type.replace('_', ' ')}
                      </Badge>
                      <Badge variant="outline" className="text-blue-400 border-blue-400/30">
                        {hand.table_type}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{formatDistanceToNow(new Date(hand.played_at), { 
                          addSuffix: true, 
                          locale: es 
                        })}</span>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>Posición {hand.player_position || 'N/A'}</span>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <Coins className="h-4 w-4" />
                        <span>Bote: Ξ{hand.final_pot.toFixed(2)}</span>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <span>Blinds: {hand.blinds}</span>
                      </div>
                      
                      {hand.duration_seconds && (
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{formatDuration(hand.duration_seconds)}</span>
                        </div>
                      )}
                    </div>
                    
                    {hand.hand_strength && (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-400">Jugada:</span>
                        <span className={`text-sm font-medium ${getHandStrengthColor(hand.hand_strength)}`}>
                          {hand.hand_strength.replace('_', ' ')}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className={`flex items-center space-x-2 ${result.color} font-bold text-lg`}>
                      <ResultIcon className="h-5 w-5" />
                      <span>{result.text}</span>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedHand(hand)}
                        className="border-emerald/20 text-white hover:bg-emerald/10"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Ver
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {hasMore && (
        <div className="mt-6 text-center">
          <Button
            onClick={onLoadMore}
            disabled={loading}
            variant="outline"
            className="border-emerald/20 text-white hover:bg-emerald/10"
          >
            {loading ? 'Cargando...' : 'Cargar Más'}
          </Button>
        </div>
      )}
      
      {selectedHand && (
        <HandDetailDialog
          hand={selectedHand}
          open={!!selectedHand}
          onClose={() => setSelectedHand(null)}
        />
      )}
    </>
  );
};
