
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/stores/auth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

const SettingsPage = () => {
  const { user, setUser } = useAuth();
  const [alias, setAlias] = useState(user?.alias || '');
  const [showInLeaderboard, setShowInLeaderboard] = useState(user?.showInLeaderboard ?? true);
  const [language, setLanguage] = useState('en');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Update local state when user data changes
    if (user) {
      setAlias(user.alias || '');
      setShowInLeaderboard(user.showInLeaderboard ?? true);
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    
    if (alias.length < 3 || alias.length > 24) {
      toast.error("Alias must be between 3 and 24 characters");
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
      
      toast.success("Settings saved successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to update settings");
      console.error("Settings update error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-8">Account Settings</h1>
      
      <div className="bg-navy/50 rounded-xl p-6 shadow-md backdrop-blur-md border border-emerald/20">
        <div className="space-y-6">
          <div>
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
          
          <div className="pt-4 border-t border-emerald/10">
            <h2 className="text-lg font-medium text-emerald mb-4">Preferences</h2>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="language" className="block text-sm font-medium text-gray-200">Language</label>
                <select
                  id="language"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                </select>
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

export default SettingsPage;
