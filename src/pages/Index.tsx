
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { GalacticBackground } from '@/components/layout/GalacticBackground';
import { FeatureCard } from '@/components/layout/FeatureCard';
import { useAuth } from '@/stores/auth';
import { Button } from '@/components/ui/button';

export default function Index() {
  const { user } = useAuth();

  return (
    <AppLayout showBreadcrumbs={false}>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <GalacticBackground />
        
        <div className="relative z-10">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center mb-16">
              <motion.h1 
                className="text-6xl md:text-8xl font-bold mb-6"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <span className="bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-400 bg-clip-text text-transparent">
                  Poker Galaxy
                </span>
              </motion.h1>
              
              <motion.p 
                className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Experience the ultimate poker adventure in the cosmos. Join tables, compete in tournaments, and become a galactic poker legend.
              </motion.p>

              {user ? (
                <motion.div 
                  className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  <p className="text-emerald-400 text-lg">
                    Welcome back, {user.alias || user.email}! 🎰
                  </p>
                  <div className="flex gap-4">
                    <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700" asChild>
                      <Link to="/lobby">
                        🚀 Play Now
                      </Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild>
                      <Link to="/profile">
                        👤 View Profile
                      </Link>
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  className="flex flex-col sm:flex-row gap-4 justify-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700" asChild>
                    <Link to="/register">
                      🚀 Start Playing
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link to="/login">
                      🔑 Sign In
                    </Link>
                  </Button>
                </motion.div>
              )}
            </div>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, staggerChildren: 0.2 }}
            >
              <FeatureCard
                title="Join Tables"
                description="Explore a variety of poker tables and join the action. Find the perfect game for your skill level."
                icon="🃏"
              />
              <FeatureCard
                title="Tournaments"
                description="Compete in thrilling tournaments and prove your poker skills. Win big and climb the leaderboards."
                icon="🏆"
              />
              <FeatureCard
                title="Leaderboards"
                description="Track your progress and compete with other players. See who's on top of the galactic poker scene."
                icon="🏅"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
