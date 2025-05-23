
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Trophy, Star, Users, Calendar } from 'lucide-react';
import { PlayerStatistics } from '@/hooks/useUserProfile';

interface StatisticsSectionProps {
  stats: PlayerStatistics;
  loading?: boolean;
}

export const StatisticsSection: React.FC<StatisticsSectionProps> = ({ 
  stats,
  loading = false 
}) => {
  const { t } = useTranslation();
  
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-24 bg-navy/70 rounded-md animate-pulse"></div>
        ))}
      </div>
    );
  }
  
  const statCards = [
    {
      label: t('profile.winRate'),
      value: `${stats.winRate}%`,
      icon: <Trophy className="h-5 w-5 text-emerald" />,
    },
    {
      label: t('profile.handsPlayed'),
      value: stats.totalHands.toLocaleString(),
      icon: <Calendar className="h-5 w-5 text-emerald" />,
    },
    {
      label: t('profile.totalWinnings'),
      value: `Ξ ${stats.totalWinnings}`,
      icon: <Star className="h-5 w-5 text-emerald" />,
    },
    {
      label: t('profile.bestHand'),
      value: stats.bestHand,
      icon: <Star className="h-5 w-5 text-emerald" />,
    },
    {
      label: t('profile.tournamentWins'),
      value: stats.tournamentWins.toString(),
      icon: <Trophy className="h-5 w-5 text-emerald" />,
    },
    {
      label: t('profile.ranking'),
      value: `#${stats.rankPosition}`,
      icon: <Users className="h-5 w-5 text-emerald" />,
    },
  ];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {statCards.map((stat, index) => (
        <div 
          key={index}
          className="bg-navy/70 p-4 rounded-lg border border-emerald/10 flex flex-col"
        >
          <div className="flex items-center mb-2">
            <div className="mr-2">{stat.icon}</div>
            <div className="text-gray-400 text-sm">{stat.label}</div>
          </div>
          <div className="text-lg font-bold text-white">{stat.value}</div>
        </div>
      ))}
    </div>
  );
};
