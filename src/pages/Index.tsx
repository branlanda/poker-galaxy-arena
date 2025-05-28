import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/stores/auth';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import StarfallEffect from '@/components/effects/StarfallEffect';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Play, Trophy, Users, TrendingUp, Target, Settings, User, ArrowRight, Star, Clock, Twitter, Facebook, MessageCircle } from 'lucide-react';
export default function Index() {
  const {
    user
  } = useAuth();
  const {
    t
  } = useTranslation();
  const navigate = useNavigate();

  // Si no hay usuario, mostrar la página de bienvenida pública
  if (!user) {
    return <div className="min-h-screen bg-navy flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center relative">
          <StarfallEffect />
          <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
            <div className="mb-12">
              <h1 className="text-6xl font-bold text-emerald mb-6">Poker Galaxy </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">Welcome to the ultimate online poker experience. Join thousands of players in exciting games and tournaments. </p>
              
              {/* Social Media Icons */}
              <div className="flex justify-center space-x-4 mb-8">
                <a href="#" className="text-emerald hover:text-emerald/80 transition-colors">
                  <span className="sr-only">Twitter</span>
                  <Twitter className="h-6 w-6" />
                </a>
                <a href="#" className="text-emerald hover:text-emerald/80 transition-colors">
                  <span className="sr-only">Facebook</span>
                  <Facebook className="h-6 w-6" />
                </a>
                <a href="#" className="text-emerald hover:text-emerald/80 transition-colors">
                  <span className="sr-only">Discord</span>
                  <MessageCircle className="h-6 w-6" />
                </a>
              </div>
              
              <div className="flex gap-4 justify-center">
                <Button size="lg" className="px-8 py-4" onClick={() => navigate('/login')}>
                  <ArrowRight className="h-5 w-5 mr-2" />
                  🎮 {t('auth.signIn', 'Sign In')}
                </Button>
                <Button size="lg" variant="outline" className="px-8 py-4" onClick={() => navigate('/register')}>
                  ⭐ {t('auth.signUp', 'Sign Up')}
                </Button>
              </div>
            </div>
            
            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="bg-navy/50 border-emerald/20 hover:border-emerald/40 transition-colors">
                <CardHeader className="text-center">
                  <Play className="h-12 w-12 text-emerald mx-auto mb-4" />
                  <CardTitle className="text-white text-xl">🎲 Quick Games</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-300 text-center">
                    Jump into cash games instantly with players of all skill levels. Find your perfect table and start playing. 💰
                  </CardDescription>
                </CardContent>
              </Card>
              
              <Card className="bg-navy/50 border-emerald/20 hover:border-emerald/40 transition-colors">
                <CardHeader className="text-center">
                  <Trophy className="h-12 w-12 text-gold mx-auto mb-4" />
                  <CardTitle className="text-white text-xl">🏆 Tournaments</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-300 text-center">
                    Compete in exciting tournaments with guaranteed prize pools and climb the ranks.
                  </CardDescription>
                </CardContent>
              </Card>
              
              <Card className="bg-navy/50 border-emerald/20 hover:border-emerald/40 transition-colors">
                <CardHeader className="text-center">
                  <TrendingUp className="h-12 w-12 text-accent mx-auto mb-4" />
                  <CardTitle className="text-white text-xl">📊 Rankings</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-300 text-center">
                    Track your progress and compete on global leaderboards with players worldwide.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>

            {/* Call to Action */}
            <div className="mt-12 p-8 bg-gradient-to-r from-emerald/10 to-gold/10 rounded-lg border border-emerald/20">
              <h2 className="text-2xl font-bold text-white mb-4">🎯 Ready to Play?</h2>
              <p className="text-gray-300 mb-6">Join the action now and experience the thrill of professional poker. </p>
              <Button size="lg" className="px-8 py-4" onClick={() => navigate('/register')}>
                🚀 Get Started
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>;
  }

  // Dashboard para usuarios autenticados
  return <div className="min-h-screen bg-navy flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 relative">
        <StarfallEffect />
        {/* Welcome Section */}
        <div className="text-center mb-12 relative z-10">
          <h1 className="text-4xl font-bold text-emerald mb-4">
            🎉 {t('common.welcome', 'Welcome back')}, {user.alias || user.email}!
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            {t('dashboardSubtitle', 'Ready to play some poker?')} ♠️♥️♦️♣️
          </p>
          
          {/* Quick Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Button size="lg" className="px-6" onClick={() => navigate('/lobby')}>
              <Play className="h-5 w-5 mr-2" />
              🎮 {t('quickPlay', 'Quick Play')}
            </Button>
            <Button size="lg" variant="secondary" className="px-6" onClick={() => navigate('/tournaments')}>
              <Trophy className="h-5 w-5 mr-2" />
              🏆 {t('tournaments.lobby', 'Tournaments')}
            </Button>
            <Button size="lg" variant="outline" className="px-6" onClick={() => navigate('/leaderboards')}>
              <TrendingUp className="h-5 w-5 mr-2" />
              📊 {t('leaderboards.title', 'Leaderboards')}
            </Button>
          </div>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid lg:grid-cols-3 gap-8 relative z-10">
          {/* Primary Actions */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Lobby Card */}
              <Card className="bg-gradient-to-br from-emerald/20 to-emerald/5 border-emerald/30 hover:border-emerald/50 transition-all duration-300 group cursor-pointer" onClick={() => navigate('/lobby')}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-semibold text-white">🎰 Poker Lobby</CardTitle>
                  <Play className="h-6 w-6 text-emerald group-hover:scale-110 transition-transform" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-emerald mb-2">Join Now</div>
                  <p className="text-sm text-gray-300 mb-4">
                    Find and join poker tables instantly. Choose from cash games or sit & go tournaments. 💰
                  </p>
                  <Button className="w-full group-hover:bg-emerald/90">
                    {t('goToLobby', 'Go to Lobby')}
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>

              {/* Tournaments Card */}
              <Card className="bg-gradient-to-br from-gold/20 to-gold/5 border-gold/30 hover:border-gold/50 transition-all duration-300 group cursor-pointer" onClick={() => navigate('/tournaments')}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-semibold text-white">🏆 Tournaments</CardTitle>
                  <Trophy className="h-6 w-6 text-gold group-hover:scale-110 transition-transform" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gold mb-2">Compete</div>
                  <p className="text-sm text-gray-300 mb-4">
                    Join exciting tournaments with guaranteed prize pools and structured play.
                  </p>
                  <Button variant="secondary" className="w-full">
                    {t('viewTournaments', 'View Tournaments')}
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Secondary Actions */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-accent/20 to-accent/5 border-accent/30 hover:border-accent/50 transition-all duration-300 group cursor-pointer" onClick={() => navigate('/achievements')}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-semibold text-white">🎯 Achievements</CardTitle>
                  <Target className="h-6 w-6 text-accent group-hover:scale-110 transition-transform" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-accent mb-2">Unlock</div>
                  <p className="text-sm text-gray-300 mb-4">
                    Track your progress, complete challenges, and unlock rewards.
                  </p>
                  <Button variant="accent" className="w-full">
                    {t('viewAchievements', 'View Achievements')}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-500/20 to-blue-500/5 border-blue-500/30 hover:border-blue-500/50 transition-all duration-300 group cursor-pointer" onClick={() => navigate('/leaderboards')}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-semibold text-white">📊 Leaderboards</CardTitle>
                  <TrendingUp className="h-6 w-6 text-blue-400 group-hover:scale-110 transition-transform" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-400 mb-2">Rank Up</div>
                  <p className="text-sm text-gray-300 mb-4">
                    See how you rank against other players globally.
                  </p>
                  <Button variant="outline" className="w-full border-blue-400/30 text-blue-400 hover:bg-blue-400/10">
                    {t('viewLeaderboards', 'View Leaderboards')}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="bg-navy/50 border-emerald/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Star className="h-5 w-5 mr-2 text-emerald" />
                  ⚡ Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/profile')}>
                  <User className="h-4 w-4 mr-3" />
                  👤 {t('common.profile', 'View Profile')}
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/funds')}>
                  <Target className="h-4 w-4 mr-3" />
                  💰 {t('manageFunds', 'Manage Funds')}
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/settings')}>
                  <Settings className="h-4 w-4 mr-3" />
                  ⚙️ {t('common.settings', 'Settings')}
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-navy/50 border-emerald/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-emerald" />
                  ⏰ Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-gray-400">
                  <div className="flex items-center justify-between">
                    <span>Last session</span>
                    <span className="text-emerald">2 hours ago</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Tables played</span>
                    <span className="text-white">3</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Tournaments entered</span>
                    <span className="text-white">1</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-600">
                  <Button variant="ghost" size="sm" className="w-full text-emerald hover:bg-emerald/10" onClick={() => navigate('/profile')}>
                    📊 View Full History
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>;
}