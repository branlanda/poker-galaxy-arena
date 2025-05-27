
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, DollarSign } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface PrizeStructureProps {
  prizePool: number;
  payoutStructure: Array<{
    position: number;
    percentage: number;
  }>;
  playersCount: number;
}

export const TournamentPrizeStructure: React.FC<PrizeStructureProps> = ({
  prizePool,
  payoutStructure,
  playersCount
}) => {
  const { t } = useTranslation();

  const calculatePrize = (percentage: number) => {
    return (prizePool * percentage) / 100;
  };

  const getPositionSuffix = (position: number) => {
    if (position === 1) return 'st';
    if (position === 2) return 'nd';
    if (position === 3) return 'rd';
    return 'th';
  };

  return (
    <Card className="bg-navy/50 border-emerald/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Trophy className="h-5 w-5 text-emerald" />
          {t('tournaments.prizeStructure', 'Prize Structure')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Total Prize Pool */}
          <div className="bg-emerald/10 rounded-lg p-4 border border-emerald/20">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Total Prize Pool</span>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-emerald" />
                <span className="text-xl font-bold text-emerald">${prizePool.toLocaleString()}</span>
              </div>
            </div>
            <div className="text-sm text-gray-400 mt-1">
              Guaranteed • {playersCount} entries
            </div>
          </div>

          {/* Prize Breakdown */}
          <div className="space-y-2">
            {payoutStructure.slice(0, 6).map((payout) => (
              <div key={payout.position} className="flex items-center justify-between p-3 bg-navy/30 rounded-lg border border-emerald/10">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    payout.position === 1 ? 'bg-yellow-500/20 text-yellow-500' :
                    payout.position === 2 ? 'bg-gray-400/20 text-gray-400' :
                    payout.position === 3 ? 'bg-orange-500/20 text-orange-500' :
                    'bg-emerald/20 text-emerald'
                  }`}>
                    {payout.position}
                  </div>
                  <span className="text-white font-medium">
                    {payout.position}{getPositionSuffix(payout.position)} Place
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-white font-bold">
                    ${calculatePrize(payout.percentage).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-400">
                    {payout.percentage}%
                  </div>
                </div>
              </div>
            ))}
            
            {payoutStructure.length > 6 && (
              <div className="text-center py-2">
                <span className="text-gray-400 text-sm">
                  +{payoutStructure.length - 6} more places
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
