
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/stores/auth';
import { useTranslation } from '@/hooks/useTranslation';
import { PlayerStatistics } from '@/hooks/usePlayerStatistics';
import { Star, Trophy, TrendingUp } from 'lucide-react';

interface ProfileHeaderProps {
  statistics: PlayerStatistics | null;
  onEditAvatar: () => void;
  loading?: boolean;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  statistics,
  onEditAvatar,
  loading = false
}) => {
  const { user } = useAuth();
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="bg-navy/70 rounded-lg border border-emerald/20 p-6">
        <div className="flex items-center space-x-6">
          <div className="w-20 h-20 bg-navy/50 rounded-full animate-pulse"></div>
          <div className="space-y-3">
            <div className="h-6 w-48 bg-navy/50 rounded animate-pulse"></div>
            <div className="h-4 w-32 bg-navy/50 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'legendary': return 'bg-yellow-500';
      case 'epic': return 'bg-purple-500';
      case 'rare': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getLevelTitle = (level: number) => {
    if (level >= 50) return 'Poker Legend';
    if (level >= 30) return 'High Roller';
    if (level >= 20) return 'Poker Pro';
    if (level >= 10) return 'Experienced Player';
    return 'Rookie';
  };

  return (
    <div className="bg-navy/70 rounded-lg border border-emerald/20 p-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
        <div className="flex items-center space-x-6">
          <div className="relative">
            <Avatar className="w-20 h-20 border-2 border-emerald/30">
              <AvatarImage src={user?.avatarUrl} alt={user?.alias || user?.email} />
              <AvatarFallback className="bg-emerald/20 text-emerald text-xl">
                {(user?.alias || user?.email)?.charAt(0).toUpperCase() || 'P'}
              </AvatarFallback>
            </Avatar>
            <Button
              size="sm"
              variant="outline"
              className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs"
              onClick={onEditAvatar}
            >
              Edit
            </Button>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold text-white">
                {user?.alias || 'Anonymous Player'}
              </h1>
              <Badge variant="secondary" className="bg-emerald/20 text-emerald">
                Level {statistics?.level || 1}
              </Badge>
            </div>
            
            <p className="text-gray-400">
              {getLevelTitle(statistics?.level || 1)}
            </p>

            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1 text-emerald">
                <Star className="h-4 w-4" />
                <span>{statistics?.xp || 0} XP</span>
              </div>
              <div className="flex items-center space-x-1 text-gold">
                <Trophy className="h-4 w-4" />
                <span>Rank #{statistics?.rankPosition || 'Unranked'}</span>
              </div>
              <div className="flex items-center space-x-1 text-blue-400">
                <TrendingUp className="h-4 w-4" />
                <span>{statistics?.winRate?.toFixed(1) || 0}% Win Rate</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end space-y-2">
          <div className="text-right">
            <p className="text-2xl font-bold text-emerald">
              Ξ {statistics?.totalWinnings?.toFixed(2) || '0.00'}
            </p>
            <p className="text-sm text-gray-400">Total Winnings</p>
          </div>
          
          <div className="flex space-x-2">
            <Badge variant="outline" className="text-xs">
              {statistics?.totalGamesPlayed || 0} Games
            </Badge>
            <Badge variant="outline" className="text-xs">
              {statistics?.tournamentWins || 0} Tournament Wins
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};
