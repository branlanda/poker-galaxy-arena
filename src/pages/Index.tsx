import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/stores/auth';

export default function DashboardPage() {
  const isLoggedIn = useAuth((s) => !!s.user);

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-emerald mb-4">
          Play Poker with Friends
        </h1>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          The world's first truly peer-to-peer poker platform. No house edge, just pure poker.
        </p>
        <div className="mt-8 flex gap-4 justify-center">
          <Link to="/lobby">
            <Button size="lg" variant="primary">
              Enter The Lobby
            </Button>
          </Link>
          {!isLoggedIn && (
            <Link to="/signup">
              <Button size="lg" variant="outline">
                Sign Up
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
