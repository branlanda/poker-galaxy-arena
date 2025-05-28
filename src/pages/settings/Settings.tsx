
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/stores/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { useLanguage, languages } from '@/stores/language';
import { useTranslation } from '@/hooks/useTranslation';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Globe, Shield, Bell } from 'lucide-react';

const SettingsPage = () => {
  const { user, setUser } = useAuth();
  const { currentLanguage, setLanguage } = useLanguage();
  const { t } = useTranslation();
  const [alias, setAlias] = useState(user?.alias || '');
  const [showInLeaderboard, setShowInLeaderboard] = useState(user?.showInLeaderboard ?? true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Update local state when user data changes
    if (user) {
      setAlias(user.alias || '');
      setShowInLeaderboard(user.showInLeaderboard ?? true);
    }
  }, [user]);

  const handleLanguageChange = (languageCode: string) => {
    const selectedLanguage = languages.find(lang => lang.code === languageCode);
    if (selectedLanguage) {
      setLanguage(selectedLanguage);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    
    if (alias.length < 3 || alias.length > 24) {
      toast.error(t('errors.aliasLength', "Alias must be between 3 and 24 characters"));
      return;
    }
    
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('players')
        .update({
          alias,
          show_in_leaderboard: showInLeaderboard
        })
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      // Update local state
      setUser({
        ...user,
        alias,
        showInLeaderboard
      });
      
      toast.success(t('settings.saved', "Settings saved successfully"));
    } catch (error: any) {
      toast.error(error.message || t('errors.updateFailed', "Failed to update settings"));
      console.error("Settings update error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
        <AppLayout>
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center text-white">{t('loading', 'Loading...')}</div>
          </div>
        </AppLayout>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <AppLayout>
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">{t('settings.title', 'Account Settings')}</h1>
            <p className="text-gray-400">Manage your account preferences and privacy settings</p>
          </div>
          
          {/* Personal Information */}
          <Card className="bg-slate-800/90 border-emerald/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <User className="h-5 w-5 mr-2 text-emerald" />
                {t('settings.profile', 'Profile Settings')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300">{t('email', 'Email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user.email || ''}
                    disabled
                    className="bg-slate-700/60 border-emerald/20 text-gray-400"
                  />
                  <p className="text-xs text-gray-500">{t('settings.emailHelp', 'Contact support to change your email')}</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="alias" className="text-gray-300">
                    {t('settings.pokerAlias', 'Poker Alias')}
                    <span className="text-xs text-gray-400 ml-2">({t('settings.aliasLength', '3-24 characters')})</span>
                  </Label>
                  <Input
                    id="alias"
                    type="text"
                    value={alias}
                    onChange={(e) => setAlias(e.target.value)}
                    minLength={3}
                    maxLength={24}
                    className="bg-slate-700/60 border-emerald/20 text-white placeholder-gray-400"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="show-in-leaderboard"
                  checked={showInLeaderboard}
                  onCheckedChange={(checked) => setShowInLeaderboard(!!checked)}
                  className="border-emerald/20 data-[state=checked]:bg-emerald data-[state=checked]:border-emerald"
                />
                <Label 
                  htmlFor="show-in-leaderboard" 
                  className="text-gray-300 cursor-pointer"
                >
                  {t('settings.showInLeaderboard', 'Show me in public leaderboards')}
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card className="bg-slate-800/90 border-emerald/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Shield className="h-5 w-5 mr-2 text-emerald" />
                {t('settings.privacy', 'Privacy Settings')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-300">Show Public Statistics</Label>
                  <p className="text-sm text-gray-400">Allow your statistics to be visible on leaderboards</p>
                </div>
                <Checkbox
                  checked={showInLeaderboard}
                  onCheckedChange={(checked) => setShowInLeaderboard(!!checked)}
                  className="border-emerald/20 data-[state=checked]:bg-emerald data-[state=checked]:border-emerald"
                />
              </div>
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card className="bg-slate-800/90 border-emerald/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Globe className="h-5 w-5 mr-2 text-emerald" />
                {t('settings.preferences', 'Preferences')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="language" className="text-gray-300">{t('settings.language', 'Language')}</Label>
                <Select value={currentLanguage.code} onValueChange={handleLanguageChange}>
                  <SelectTrigger className="bg-slate-700/60 border-emerald/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-emerald/20">
                    {languages.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code} className="text-white hover:bg-slate-700">
                        {lang.flag} {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="bg-slate-800/90 border-emerald/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Bell className="h-5 w-5 mr-2 text-emerald" />
                Notification Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-300">Email Notifications</Label>
                  <p className="text-sm text-gray-400">Receive important updates via email</p>
                </div>
                <Checkbox
                  defaultChecked={true}
                  className="border-emerald/20 data-[state=checked]:bg-emerald data-[state=checked]:border-emerald"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-300">Tournament Notifications</Label>
                  <p className="text-sm text-gray-400">Get notified about upcoming tournaments</p>
                </div>
                <Checkbox
                  defaultChecked={true}
                  className="border-emerald/20 data-[state=checked]:bg-emerald data-[state=checked]:border-emerald"
                />
              </div>
            </CardContent>
          </Card>
          
          {/* Save Button */}
          <div className="flex justify-end pt-6">
            <Button 
              onClick={handleSave} 
              disabled={loading}
              className="px-8 bg-emerald hover:bg-emerald/90 text-white"
            >
              {loading ? 'Saving...' : t('settings.saveChanges', 'Save Changes')}
            </Button>
          </div>
        </div>
      </AppLayout>
    </div>
  );
};

export default SettingsPage;
