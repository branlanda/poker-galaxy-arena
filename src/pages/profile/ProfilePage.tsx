
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BarChart3, Shield } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from '@/hooks/useTranslation';
import { usePlayerStatistics } from '@/hooks/usePlayerStatistics';
import { useUserPresence } from '@/hooks/useUserPresence';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { StatisticsSection } from '@/components/profile/StatisticsSection';
import { GameHistoryTable } from '@/components/profile/GameHistoryTable';
import { AccountSettings } from '@/components/profile/AccountSettings';
import { FriendsSection } from '@/components/profile/FriendsSection';
import { AvatarSelector } from '@/components/profile/AvatarSelector';
import SecuritySettings from '@/components/auth/SecuritySettings';
import StarfallEffect from '@/components/effects/StarfallEffect';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ProfilePage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const { statistics, gameHistory, loading } = usePlayerStatistics();
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  
  // Usar el hook de presencia para marcar al usuario como online
  useUserPresence();
  
  // Obtener la pestaña inicial de los parámetros URL
  const initialTab = searchParams.get('tab') || 'overview';
  const [activeTab, setActiveTab] = useState(initialTab);

  return (
    <div className="min-h-screen bg-navy relative">
      <StarfallEffect />
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Navigation Header */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
            <Link to="/" className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('common.backToHome', 'Volver al inicio')}
            </Link>
          </Button>
          
          {/* Quick access to hand history */}
          <Button 
            variant="outline" 
            size="sm" 
            className="border-emerald/20 text-white hover:bg-emerald/10"
          >
            <Link to="/hand-history" className="flex items-center">
              <BarChart3 className="h-4 w-4 mr-2" />
              Historial Detallado
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
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="overview" className="text-white">
              {t('profile.overview', 'Resumen')}
            </TabsTrigger>
            <TabsTrigger value="history" className="text-white">
              {t('profile.gameHistory', 'Historial')}
            </TabsTrigger>
            <TabsTrigger value="friends" className="text-white">
              {t('profile.friends', 'Amigos')}
            </TabsTrigger>
            <TabsTrigger value="settings" className="text-white">
              {t('profile.settings', 'Configuración')}
            </TabsTrigger>
            <TabsTrigger value="security" className="text-white">
              <Shield className="h-4 w-4 mr-2" />
              Seguridad
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <StatisticsSection stats={statistics} loading={loading} />
            
            {/* Quick access card */}
            <Card className="bg-navy/70 border-emerald/20">
              <CardHeader>
                <CardTitle className="text-white">Acceso Rápido</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4">
                  <Button 
                    variant="outline" 
                    className="border-emerald/20 text-white hover:bg-emerald/10"
                  >
                    <Link to="/hand-history" className="flex items-center">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Ver Historial Completo
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <GameHistoryTable gameHistory={gameHistory} loading={loading} />
          </TabsContent>

          <TabsContent value="friends" className="space-y-6">
            <FriendsSection />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <AccountSettings />
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <SecuritySettings />
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
