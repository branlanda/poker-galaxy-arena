
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from '@/hooks/useTranslation';
import { usePlayerStatistics } from '@/hooks/usePlayerStatistics';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { StatisticsSection } from '@/components/profile/StatisticsSection';
import { GameHistoryTable } from '@/components/profile/GameHistoryTable';
import { AccountSettings } from '@/components/profile/AccountSettings';
import { AvatarSelector } from '@/components/profile/AvatarSelector';
import StarfallEffect from '@/components/effects/StarfallEffect';

export default function ProfilePage() {
  const { t } = useTranslation();
  const { statistics, gameHistory, loading } = usePlayerStatistics();
  const [activeTab, setActiveTab] = useState('overview');
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);

  return (
    <div className="min-h-screen bg-navy relative">
      <StarfallEffect />
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Navigation Header */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
            <Link to="/" className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('common.backToHome', 'Back to Home')}
            </Link>
          </Button>
        </div>

        {/* Profile Header */}
        <div className="mb-8">
          <ProfileHeader
            statistics={statistics}
            onEditAvatar={() => setShowAvatarSelector(true)}
            loading={loading}
          />
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="overview" className="text-white">
              {t('profile.overview', 'Overview')}
            </TabsTrigger>
            <TabsTrigger value="history" className="text-white">
              {t('profile.gameHistory', 'Game History')}
            </TabsTrigger>
            <TabsTrigger value="settings" className="text-white">
              {t('profile.settings', 'Settings')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <StatisticsSection stats={statistics} loading={loading} />
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <GameHistoryTable gameHistory={gameHistory} loading={loading} />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <AccountSettings />
          </TabsContent>
        </Tabs>

        {/* Avatar Selector Modal */}
        <AvatarSelector
          open={showAvatarSelector}
          onClose={() => setShowAvatarSelector(false)}
        />
      </div>
    </div>
  );
}
