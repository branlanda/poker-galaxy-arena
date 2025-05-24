
import { Link } from 'react-router-dom';
import { useAuth } from '@/stores/auth';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Play, 
  Trophy, 
  Users, 
  TrendingUp, 
  Target,
  Settings,
  User,
  ArrowRight
} from 'lucide-react';

export default function Index() {
  const { user } = useAuth();
  const { t } = useTranslation();

  if (!user) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-6xl font-bold text-emerald mb-6">
            Poker Galaxy
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            {t('welcomeMessage', 'Welcome to the ultimate online poker experience. Join thousands of players in exciting games and tournaments.')}
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/login">
                {t('signIn', 'Sign In')}
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/signup">
                {t('signUp', 'Sign Up')}
              </Link>
            </Button>
          </div>
          
          <div className="mt-12 grid md:grid-cols-3 gap-6 text-left">
            <Card className="bg-navy/50 border-emerald/20">
              <CardHeader>
                <Play className="h-8 w-8 text-emerald mb-2" />
                <CardTitle className="text-white">Quick Games</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Jump into cash games instantly with players of all skill levels
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="bg-navy/50 border-emerald/20">
              <CardHeader>
                <Trophy className="h-8 w-8 text-gold mb-2" />
                <CardTitle className="text-white">Tournaments</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Compete in exciting tournaments with guaranteed prize pools
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="bg-navy/50 border-emerald/20">
              <CardHeader>
                <TrendingUp className="h-8 w-8 text-accent mb-2" />
                <CardTitle className="text-white">Rankings</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Track your progress and compete on global leaderboards
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-emerald mb-2">
          {t('welcome', 'Welcome back')}, {user.alias || user.email}!
        </h1>
        <p className="text-gray-400">
          {t('dashboardSubtitle', 'Ready to play some poker?')}
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="bg-navy/50 border-emerald/20 hover:border-emerald/40 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Quick Play</CardTitle>
            <Play className="h-4 w-4 text-emerald" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald mb-1">Join Now</div>
            <p className="text-xs text-gray-400 mb-4">
              Find and join poker tables instantly
            </p>
            <Button asChild className="w-full">
              <Link to="/lobby">
                {t('goToLobby', 'Go to Lobby')}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-navy/50 border-emerald/20 hover:border-emerald/40 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Tournaments</CardTitle>
            <Trophy className="h-4 w-4 text-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gold mb-1">Compete</div>
            <p className="text-xs text-gray-400 mb-4">
              Join exciting tournaments
            </p>
            <Button asChild variant="secondary" className="w-full">
              <Link to="/tournaments">
                {t('viewTournaments', 'View Tournaments')}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-navy/50 border-emerald/20 hover:border-emerald/40 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Achievements</CardTitle>
            <Target className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent mb-1">Unlock</div>
            <p className="text-xs text-gray-400 mb-4">
              Track your progress and goals
            </p>
            <Button asChild variant="accent" className="w-full">
              <Link to="/achievements">
                {t('viewAchievements', 'View Achievements')}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-navy/50 border-emerald/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Users className="h-5 w-5 mr-2 text-emerald" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild variant="outline" className="w-full justify-start">
              <Link to="/profile">
                <User className="h-4 w-4 mr-2" />
                {t('viewProfile', 'View Profile')}
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link to="/funds">
                <Target className="h-4 w-4 mr-2" />
                {t('manageFunds', 'Manage Funds')}
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link to="/settings">
                <Settings className="h-4 w-4 mr-2" />
                {t('settings', 'Settings')}
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-navy/50 border-emerald/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-emerald" />
              Leaderboards
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400 mb-4">
              See how you rank against other players
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link to="/leaderboards">
                {t('viewLeaderboards', 'View Leaderboards')}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
