import React, { useState, useEffect } from 'react';
import { useAuth } from '@/stores/auth';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';
import { supabase } from '@/lib/supabase';
import { ReportUserDialog } from '@/components/profile/ReportUserDialog';
import { FriendsSection } from '@/components/profile/FriendsSection';
import { NotificationsPanel } from '@/components/profile/NotificationsPanel';
import { Bell } from 'lucide-react';

const ProfilePage = () => {
  const { user, updateUserProfile, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [alias, setAlias] = useState(user?.alias || '');
  const [showInLeaderboard, setShowInLeaderboard] = useState(user?.showInLeaderboard || false);
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [loading, setLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [friends, setFriends] = useState<any[]>([]);
  const [friendsLoading, setFriendsLoading] = useState(false);
  
  const reportedUserId = user?.id || '';
  const reportedUserAlias = user?.alias || '';

  useEffect(() => {
    if (user) {
      setAlias(user.alias || '');
      setShowInLeaderboard(user.showInLeaderboard || false);
      setAvatarUrl(user.avatarUrl || '');
    }
  }, [user]);

  useEffect(() => {
    setIsDirty(
      alias !== user?.alias ||
      showInLeaderboard !== user?.showInLeaderboard ||
      avatarUrl !== user?.avatarUrl
    );
  }, [alias, showInLeaderboard, avatarUrl, user]);
  
  useEffect(() => {
    fetchFriends();
  }, [user]);

  const fetchFriends = async () => {
    if (!user) return;
    
    try {
      setFriendsLoading(true);
      const { data, error } = await supabase
        .from('friends')
        .select(`
          id,
          status,
          friend:friend_id (
            user_id,
            alias,
            avatar_url
          )
        `)
        .eq('user_id', user.id)
        .eq('status', 'ACCEPTED');
      
      if (error) throw error;
      
      setFriends(data || []);
    } catch (error: any) {
      toast({
        title: t('errors.failedToLoad'),
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setFriendsLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      await updateUserProfile({
        alias,
        showInLeaderboard,
        avatarUrl
      });
      toast({
        title: t('profile.profileUpdated'),
        description: t('profile.profileUpdatedSuccess'),
      });
    } catch (error: any) {
      toast({
        title: t('errors.updateFailed'),
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };
  
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${user?.id}.${fileExt}`;
    const filePath = `${fileName}`;
    
    uploadAvatar(file, filePath);
  };
  
  const uploadAvatar = async (file: File, filePath: string) => {
    try {
      setLoading(true);
      
      // Upload the image to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (uploadError) {
        throw uploadError;
      }
      
      // Get public URL of the image
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
      
      if (!urlData?.publicUrl) {
        throw new Error('Could not retrieve public URL for avatar.');
      }
      
      // Update the user profile with the new avatar URL
      await updateUserProfile({ avatarUrl: urlData.publicUrl });
      setAvatarUrl(urlData.publicUrl);
      
      toast({
        title: t('profile.avatarUpdated'),
        description: t('profile.avatarUpdatedSuccess'),
      });
    } catch (error: any) {
      toast({
        title: t('errors.uploadFailed'),
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const getInitials = (name: string) => {
    return name?.substring(0, 2).toUpperCase() || 'U';
  };

  return (
    <div className="container mx-auto p-8 flex flex-col md:flex-row gap-8">
      {/* Profile Section */}
      <div className="md:w-1/3 space-y-6">
        <div className="text-center">
          <Avatar className="h-32 w-32 mx-auto">
            {avatarUrl ? (
              <AvatarImage src={avatarUrl} alt={alias} />
            ) : (
              <AvatarFallback className="bg-navy/50 text-emerald">
                {getInitials(alias)}
              </AvatarFallback>
            )}
          </Avatar>
          
          <Label htmlFor="avatar-input" className="mt-4 block text-sm font-medium text-gray-200 cursor-pointer hover:text-emerald">
            {t('profile.changeAvatar')}
          </Label>
          <Input
            type="file"
            id="avatar-input"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
          
          <h2 className="text-2xl font-bold text-emerald mt-4">{alias}</h2>
          <p className="text-gray-400">{user?.email}</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="alias" className="block text-sm font-medium text-gray-200">
              {t('profile.alias')}
            </Label>
            <Input
              type="text"
              id="alias"
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
              className="mt-1 w-full"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="showInLeaderboard" className="text-sm font-medium text-gray-200">
              {t('profile.showInLeaderboard')}
            </Label>
            <Switch
              id="showInLeaderboard"
              checked={showInLeaderboard}
              onCheckedChange={(checked) => setShowInLeaderboard(checked)}
            />
          </div>
          
          <Button 
            variant="primary" 
            onClick={handleUpdateProfile} 
            disabled={!isDirty || loading}
            loading={loading}
            className="w-full"
          >
            {t('profile.updateProfile')}
          </Button>
          
          <Button 
            variant="destructive" 
            onClick={() => setReportDialogOpen(true)}
            className="w-full"
          >
            {t('profile.reportUser')}
          </Button>
          
          <Button 
            variant="secondary" 
            onClick={handleLogout} 
            className="w-full"
          >
            {t('logout')}
          </Button>
        </div>
      </div>
      
      {/* Community Section */}
      <div className="md:w-2/3 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-emerald">{t('community.title')}</h2>
          <Button variant="outline" size="icon" onClick={() => setNotificationsOpen(true)}>
            <Bell className="h-5 w-5" />
          </Button>
        </div>
        
        <FriendsSection 
          friends={friends}
          loading={friendsLoading}
          onRefresh={fetchFriends}
        />
      </div>
      
      <ReportUserDialog
        isOpen={reportDialogOpen}
        onClose={() => setReportDialogOpen(false)}
        reportedUserId={reportedUserId}
        reportedUserAlias={reportedUserAlias}
      />
      
      <NotificationsPanel
        open={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />
    </div>
  );
};

export default ProfilePage;
