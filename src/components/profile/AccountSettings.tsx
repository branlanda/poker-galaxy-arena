
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/stores/auth';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useTranslation } from '@/hooks/useTranslation';
import { useToast } from '@/hooks/use-toast';
import { Settings, Globe, Shield, Bell } from 'lucide-react';

export const AccountSettings: React.FC = () => {
  const { user } = useAuth();
  const { profile, updateProfile, loading } = useUserProfile();
  const { t } = useTranslation();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    alias: profile?.alias || '',
    showPublicStats: profile?.show_public_stats || false,
    language: 'en',
    emailNotifications: true,
    tournamentNotifications: true
  });

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    try {
      setSaving(true);
      
      await updateProfile({
        alias: formData.alias,
        show_public_stats: formData.showPublicStats
      });

      toast({
        title: 'Settings Saved',
        description: 'Your account settings have been updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save settings',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <Card className="bg-transparent border-emerald/20 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Settings className="h-5 w-5 mr-2 text-emerald" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                type="email"
                value={user?.email || ''}
                disabled
                className="bg-transparent border-emerald/20 text-white placeholder-gray-300"
              />
              <p className="text-xs text-gray-300 mt-1">Email cannot be changed</p>
            </div>
            
            <div>
              <Label htmlFor="alias" className="text-white">Display Name</Label>
              <Input
                id="alias"
                type="text"
                value={formData.alias}
                onChange={(e) => setFormData(prev => ({ ...prev, alias: e.target.value }))}
                placeholder="Enter your display name"
                className="bg-transparent border-emerald/20 text-white placeholder-gray-300"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="language" className="text-white">Language</Label>
            <Select value={formData.language} onValueChange={(value) => setFormData(prev => ({ ...prev, language: value }))}>
              <SelectTrigger className="bg-transparent border-emerald/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-emerald/20">
                <SelectItem value="en" className="text-white hover:bg-slate-700">English</SelectItem>
                <SelectItem value="es" className="text-white hover:bg-slate-700">Español</SelectItem>
                <SelectItem value="fr" className="text-white hover:bg-slate-700">Français</SelectItem>
                <SelectItem value="de" className="text-white hover:bg-slate-700">Deutsch</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card className="bg-transparent border-emerald/20 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Shield className="h-5 w-5 mr-2 text-emerald" />
            Privacy Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white">Show Public Statistics</Label>
              <p className="text-sm text-gray-300">Allow your statistics to be visible on leaderboards</p>
            </div>
            <Switch
              checked={formData.showPublicStats}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, showPublicStats: checked }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="bg-transparent border-emerald/20 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Bell className="h-5 w-5 mr-2 text-emerald" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white">Email Notifications</Label>
              <p className="text-sm text-gray-300">Receive important updates via email</p>
            </div>
            <Switch
              checked={formData.emailNotifications}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, emailNotifications: checked }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white">Tournament Notifications</Label>
              <p className="text-sm text-gray-300">Get notified about upcoming tournaments</p>
            </div>
            <Switch
              checked={formData.tournamentNotifications}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, tournamentNotifications: checked }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button 
          onClick={handleSave} 
          disabled={saving || loading}
          className="px-8 bg-emerald hover:bg-emerald/90 text-white"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
};
