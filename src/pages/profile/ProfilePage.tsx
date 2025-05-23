
import React, { useState } from 'react';
import { useAuth } from '@/stores/auth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { useUserProfile } from '@/hooks/useUserProfile';
import { AchievementsSection } from '@/components/profile/AchievementsSection';
import { StatisticsSection } from '@/components/profile/StatisticsSection';
import { FriendsSection } from '@/components/profile/FriendsSection';
import { RecentGamesSection } from '@/components/profile/RecentGamesSection';
import { useTranslation } from '@/hooks/useTranslation';
import { Trophy, User, Calendar, Shield } from 'lucide-react';

const ProfilePage = () => {
  const { user, updateUserProfile } = useAuth();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [alias, setAlias] = useState(user?.alias || '');
  const [showInLeaderboard, setShowInLeaderboard] = useState(user?.showInLeaderboard ?? false);
  
  const { 
    profile,
    loading: profileLoading,
    refreshProfile
  } = useUserProfile();

  if (!user) {
    return <div className="p-8 text-center">{t('loading')}...</div>;
  }

  const handleSave = async () => {
    if (!user) return;
    
    if (alias && (alias.length < 3 || alias.length > 24)) {
      toast.error(t('errors.aliasLength', { min: 3, max: 24 }));
      return;
    }
    
    setLoading(true);
    
    try {
      await updateUserProfile({
        alias,
        showInLeaderboard
      });
      
      toast.success(t('profile.updateSuccess'));
    } catch (error: any) {
      toast.error(error.message || t('errors.updateFailed'));
    } finally {
      setLoading(false);
    }
  };

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error(t('errors.fileTooLarge', { size: '2MB' }));
      return;
    }

    setUploadingAvatar(true);

    try {
      // Upload image to supabase storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Check if storage bucket exists, create it if it doesn't
      const { data: bucketData } = await supabase.storage.getBucket('avatars');
      if (!bucketData) {
        await supabase.storage.createBucket('avatars', { public: true });
      }

      // Upload the file
      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      if (!publicUrlData?.publicUrl) throw new Error(t('errors.failedToGetUrl'));

      // Update profile with new avatar URL
      await updateUserProfile({
        avatarUrl: publicUrlData.publicUrl
      });

      toast.success(t('profile.avatarUpdateSuccess'));
    } catch (error: any) {
      toast.error(error.message || t('errors.avatarUpdateFailed'));
      console.error("Avatar upload error:", error);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const getInitials = (name: string) => {
    return name?.substring(0, 2).toUpperCase() || 'P2';
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-8">{t('profile.title')}</h1>
      
      <div className="bg-navy/50 rounded-xl p-6 shadow-md backdrop-blur-md border border-emerald/20">
        <div className="space-y-6">
          {/* Avatar and Basic Info Section */}
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6">
            <div className="flex flex-col items-center">
              <Avatar className="h-24 w-24 border-2 border-emerald/20">
                {user.avatarUrl ? (
                  <AvatarImage src={user.avatarUrl} alt={user.alias || 'User'} />
                ) : (
                  <AvatarFallback className="bg-navy/50 text-emerald text-xl">
                    {getInitials(user.alias || user.email || '')}
                  </AvatarFallback>
                )}
              </Avatar>
              
              <div className="mt-3">
                <label className="inline-block bg-emerald/20 hover:bg-emerald/30 text-emerald rounded-md px-4 py-2 text-sm font-medium cursor-pointer transition-colors">
                  {uploadingAvatar ? t('loading') : t('profile.changeAvatar')}
                  <input 
                    type="file"
                    accept="image/*"
                    onChange={uploadAvatar}
                    disabled={uploadingAvatar}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
            
            <div className="flex-grow">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-200">
                    {t('email')}
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={user.email || ''}
                    disabled
                    className="w-full bg-gray-800 text-gray-400"
                  />
                  <p className="text-xs text-gray-500">{t('profile.emailChangeHelp')}</p>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="alias" className="block text-sm font-medium text-gray-200">
                    {t('profile.pokerAlias')}
                    <span className="text-xs text-gray-400 ml-2">({t('profile.aliasLength')})</span>
                  </label>
                  <Input
                    id="alias"
                    type="text"
                    value={alias}
                    onChange={(e) => setAlias(e.target.value)}
                    minLength={3}
                    maxLength={24}
                    className="w-full"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="show-in-leaderboard"
                    checked={showInLeaderboard}
                    onCheckedChange={(checked) => setShowInLeaderboard(!!checked)}
                  />
                  <label 
                    htmlFor="show-in-leaderboard" 
                    className="text-sm font-medium text-gray-200 cursor-pointer"
                  >
                    {t('profile.showInLeaderboard')}
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-emerald/10">
            <Tabs defaultValue="statistics" className="w-full">
              <TabsList className="grid grid-cols-4 mb-6">
                <TabsTrigger value="statistics">
                  <Trophy className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">{t('profile.statistics')}</span>
                </TabsTrigger>
                <TabsTrigger value="achievements">
                  <Shield className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">{t('profile.achievements')}</span>
                </TabsTrigger>
                <TabsTrigger value="friends">
                  <User className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">{t('profile.friends')}</span>
                </TabsTrigger>
                <TabsTrigger value="history">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">{t('profile.history')}</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="statistics" className="pt-2">
                <h2 className="text-lg font-medium text-emerald mb-4">{t('profile.statistics')}</h2>
                <StatisticsSection
                  stats={profile?.stats || {
                    totalHands: 0,
                    winRate: 0,
                    totalWinnings: 0,
                    bestHand: "-",
                    tournamentWins: 0,
                    rankPosition: 0,
                    longestStreak: 0
                  }}
                  loading={profileLoading}
                />
              </TabsContent>
              
              <TabsContent value="achievements" className="pt-2">
                <h2 className="text-lg font-medium text-emerald mb-4">{t('profile.achievements')}</h2>
                <AchievementsSection 
                  achievements={profile?.achievements || []}
                  loading={profileLoading}
                />
              </TabsContent>
              
              <TabsContent value="friends" className="pt-2">
                <h2 className="text-lg font-medium text-emerald mb-4">{t('profile.friends')}</h2>
                <FriendsSection
                  friends={profile?.friends || []}
                  loading={profileLoading}
                  onRefresh={refreshProfile}
                />
              </TabsContent>
              
              <TabsContent value="history" className="pt-2">
                <h2 className="text-lg font-medium text-emerald mb-4">{t('profile.recentGames')}</h2>
                <RecentGamesSection
                  games={profile?.recentGames || []}
                  loading={profileLoading}
                />
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="pt-6 flex justify-end border-t border-emerald/10">
            <Button
              type="button"
              variant="primary"
              onClick={handleSave}
              loading={loading}
            >
              {t('profile.saveChanges')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
