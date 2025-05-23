
import React from 'react';
import { PlayerAchievement } from '@/types/gamification';
import { useTranslation } from '@/hooks/useTranslation';
import { Progress } from '@/components/ui/progress';
import { Award, Lock } from 'lucide-react';

interface AchievementsSectionProps {
  achievements: PlayerAchievement[];
  loading?: boolean;
}

export const AchievementsSection: React.FC<AchievementsSectionProps> = ({ 
  achievements, 
  loading = false 
}) => {
  const { t } = useTranslation();
  
  if (loading) {
    return (
      <div className="space-y-4 py-4">
        <div className="flex items-center justify-between">
          <div className="h-8 w-48 bg-navy/70 rounded-md animate-pulse"></div>
          <div className="h-8 w-24 bg-navy/70 rounded-md animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-navy/70 rounded-md animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }
  
  if (achievements.length === 0) {
    return (
      <div className="text-center py-8 bg-navy/30 rounded-lg border border-emerald/10">
        <Award size={48} className="mx-auto text-gray-400 mb-3" />
        <h3 className="text-xl font-medium text-gray-200 mb-2">
          {t('profile.noAchievements')}
        </h3>
        <p className="text-gray-400 max-w-md mx-auto">
          {t('profile.playToUnlock')}
        </p>
      </div>
    );
  }

  // Group achievements by category
  const groupedAchievements = achievements.reduce((acc, achievement) => {
    const category = achievement.achievement?.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(achievement);
    return acc;
  }, {} as Record<string, PlayerAchievement[]>);
  
  return (
    <div className="space-y-6">
      {Object.entries(groupedAchievements).map(([category, items]) => (
        <div key={category} className="space-y-3">
          <h3 className="text-lg font-medium text-emerald">{category}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map((item) => (
              <div 
                key={item.id}
                className={`relative p-4 rounded-lg border ${
                  item.completed 
                    ? 'bg-emerald/10 border-emerald/30' 
                    : 'bg-navy/30 border-navy/50'
                }`}
              >
                <div className="flex items-start">
                  <div className="h-12 w-12 rounded-md bg-navy/70 flex items-center justify-center mr-3 flex-shrink-0">
                    {item.completed ? (
                      <Award className="h-6 w-6 text-emerald" />
                    ) : (
                      <Lock className="h-6 w-6 text-gray-500" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-white">
                      {item.achievement?.name || 'Unknown Achievement'}
                    </h4>
                    <p className="text-sm text-gray-400 mt-1">
                      {item.achievement?.description || 'No description available'}
                    </p>
                    {!item.completed && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                          <span>Progress</span>
                          <span>
                            {Math.round(item.progress * 100)}%
                          </span>
                        </div>
                        <Progress
                          value={item.progress * 100}
                          className="h-1.5 bg-navy/70"
                        />
                      </div>
                    )}
                  </div>
                </div>
                {item.completed && item.completed_at && (
                  <div className="absolute bottom-2 right-3 text-xs text-emerald/70">
                    {t('profile.unlockedOn', {
                      date: new Date(item.completed_at).toLocaleDateString()
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
