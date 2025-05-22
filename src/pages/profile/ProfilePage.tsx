
import React, { useState } from 'react';
import { useAuth } from '@/stores/auth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';

const ProfilePage = () => {
  const { user, updateUserProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [alias, setAlias] = useState(user?.alias || '');
  const [showInLeaderboard, setShowInLeaderboard] = useState(user?.showInLeaderboard ?? false);

  if (!user) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  const handleSave = async () => {
    if (!user) return;
    
    if (alias && (alias.length < 3 || alias.length > 24)) {
      toast.error("Alias must be between 3 and 24 characters");
      return;
    }
    
    setLoading(true);
    
    try {
      await updateUserProfile({
        alias,
        showInLeaderboard
      });
      
      toast.success("Profile updated successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size should be less than 2MB");
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

      if (!publicUrlData?.publicUrl) throw new Error("Failed to get public URL");

      // Update profile with new avatar URL
      await updateUserProfile({
        avatarUrl: publicUrlData.publicUrl
      });

      toast.success("Avatar updated successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to upload avatar");
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
      <h1 className="text-2xl font-bold text-white mb-8">My Profile</h1>
      
      <div className="bg-navy/50 rounded-xl p-6 shadow-md backdrop-blur-md border border-emerald/20">
        <div className="space-y-6">
          {/* Avatar Section */}
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-24 w-24 border-2 border-emerald/20">
              {user.avatarUrl ? (
                <AvatarImage src={user.avatarUrl} alt={user.alias || 'User'} />
              ) : (
                <AvatarFallback className="bg-navy/50 text-emerald text-xl">
                  {getInitials(user.alias || user.email || '')}
                </AvatarFallback>
              )}
            </Avatar>
            
            <div>
              <label className="inline-block bg-emerald/20 hover:bg-emerald/30 text-emerald rounded-md px-4 py-2 text-sm font-medium cursor-pointer transition-colors">
                {uploadingAvatar ? 'Uploading...' : 'Change Avatar'}
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
          
          <div className="pt-4 border-t border-emerald/10">
            <h2 className="text-lg font-medium text-emerald mb-4">Profile Settings</h2>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-200">Email</label>
                <Input
                  id="email"
                  type="email"
                  value={user.email || ''}
                  disabled
                  className="w-full bg-gray-800 text-gray-400"
                />
                <p className="text-xs text-gray-500">Contact support to change your email</p>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="alias" className="block text-sm font-medium text-gray-200">
                  Poker Alias
                  <span className="text-xs text-gray-400 ml-2">(3-24 characters)</span>
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
                  Show me in public leaderboards
                </label>
              </div>
            </div>
          </div>
          
          {/* Stats Placeholders */}
          <div className="pt-4 border-t border-emerald/10">
            <h2 className="text-lg font-medium text-emerald mb-4">Player Statistics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-navy/70 p-4 rounded-lg border border-emerald/10">
                <div className="text-gray-400 text-sm">Win Rate</div>
                <div className="text-lg font-bold text-white">53%</div>
              </div>
              
              <div className="bg-navy/70 p-4 rounded-lg border border-emerald/10">
                <div className="text-gray-400 text-sm">Hands Played</div>
                <div className="text-lg font-bold text-white">583</div>
              </div>
              
              <div className="bg-navy/70 p-4 rounded-lg border border-emerald/10">
                <div className="text-gray-400 text-sm">Total Winnings</div>
                <div className="text-lg font-bold text-emerald">Ξ 2.45</div>
              </div>
            </div>
          </div>
          
          <div className="pt-6 flex justify-end">
            <Button
              type="button"
              variant="primary"
              onClick={handleSave}
              loading={loading}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
