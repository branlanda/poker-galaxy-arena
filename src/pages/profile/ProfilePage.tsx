
import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useAuth } from '@/stores/auth';
import { Loader2, Upload, Settings, BarChart3, Trophy, Users, MessageSquare } from 'lucide-react';
import { StatisticsSection } from '@/components/profile/StatisticsSection';
import { AchievementsSection } from '@/components/profile/AchievementsSection';
import { FriendsSection } from '@/components/profile/FriendsSection';
import { RecentGamesSection } from '@/components/profile/RecentGamesSection';
import { NotificationsPanel } from '@/components/profile/NotificationsPanel';

export default function ProfilePage() {
  const { user } = useAuth();
  const { profile, loading, updateProfile } = useUserProfile();
  const [editing, setEditing] = useState(false);
  const [alias, setAlias] = useState(profile?.alias || '');
  const [saving, setSaving] = useState(false);

  React.useEffect(() => {
    if (profile?.alias) {
      setAlias(profile.alias);
    }
  }, [profile]);

  const handleSave = async () => {
    if (!alias.trim()) return;
    
    try {
      setSaving(true);
      await updateProfile({ alias: alias.trim() });
      setEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setAlias(profile?.alias || '');
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                  {(profile?.alias || user?.alias || 'U').charAt(0).toUpperCase()}
                </div>
              </div>
              
              <div className="flex-grow">
                <div className="flex items-center gap-4 mb-4">
                  {editing ? (
                    <div className="flex items-center gap-2">
                      <Input
                        value={alias}
                        onChange={(e) => setAlias(e.target.value)}
                        className="text-xl font-bold max-w-xs"
                        placeholder="Enter alias"
                      />
                      <Button size="sm" onClick={handleSave} disabled={saving}>
                        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save'}
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleCancel}>
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <h1 className="text-3xl font-bold">{profile?.alias || user?.alias || 'Anonymous'}</h1>
                      <Button size="sm" variant="outline" onClick={() => setEditing(true)}>
                        <Settings className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary">Level 1</Badge>
                  <Badge variant="secondary">Rookie</Badge>
                  <Badge variant="secondary">0 XP</Badge>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  <p>Member since {new Date().toLocaleDateString()}</p>
                  {profile?.wallet_address && (
                    <p className="font-mono mt-1">
                      Wallet: {profile.wallet_address.substring(0, 6)}...{profile.wallet_address.substring(38)}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Avatar
                </Button>
                <Button variant="outline" size="sm">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Tabs */}
        <Tabs defaultValue="statistics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="statistics">
              <BarChart3 className="h-4 w-4 mr-2" />
              Statistics
            </TabsTrigger>
            <TabsTrigger value="achievements">
              <Trophy className="h-4 w-4 mr-2" />
              Achievements
            </TabsTrigger>
            <TabsTrigger value="friends">
              <Users className="h-4 w-4 mr-2" />
              Friends
            </TabsTrigger>
            <TabsTrigger value="recent">
              Recent Games
            </TabsTrigger>
            <TabsTrigger value="notifications">
              Notifications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="statistics">
            <StatisticsSection />
          </TabsContent>

          <TabsContent value="achievements">
            <AchievementsSection />
          </TabsContent>

          <TabsContent value="friends">
            <FriendsSection />
          </TabsContent>

          <TabsContent value="recent">
            <RecentGamesSection />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationsPanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
