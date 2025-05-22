
import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Card, CardContent } from '@/components/ui/card';

interface TournamentCountdownProps {
  startTime: string;
  onStart?: () => void;
}

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export function TournamentCountdown({ startTime, onStart }: TournamentCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const calculateTimeLeft = () => {
      try {
        const startDate = new Date(startTime).getTime();
        const now = new Date().getTime();
        const difference = startDate - now;
        
        if (difference <= 0) {
          setTimeLeft(null);
          if (onStart) onStart();
          return;
        }
        
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } catch (e) {
        console.error('Error calculating countdown:', e);
        setTimeLeft(null);
      }
    };
    
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    
    return () => clearInterval(timer);
  }, [startTime, onStart]);

  if (!timeLeft) {
    return (
      <Card className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10">
        <CardContent className="pt-6 text-center">
          <p className="text-lg font-bold">{t('tournaments.started', 'Tournament has started!')}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10">
      <CardContent className="pt-6">
        <p className="text-center text-sm mb-2">{t('tournaments.startingIn', 'Tournament starts in:')}</p>
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="flex flex-col">
            <div className="text-2xl font-bold">{timeLeft.days}</div>
            <div className="text-xs uppercase">{t('time.days', 'Days')}</div>
          </div>
          <div className="flex flex-col">
            <div className="text-2xl font-bold">{timeLeft.hours}</div>
            <div className="text-xs uppercase">{t('time.hours', 'Hours')}</div>
          </div>
          <div className="flex flex-col">
            <div className="text-2xl font-bold">{timeLeft.minutes}</div>
            <div className="text-xs uppercase">{t('time.minutes', 'Mins')}</div>
          </div>
          <div className="flex flex-col">
            <div className="text-2xl font-bold">{timeLeft.seconds}</div>
            <div className="text-xs uppercase">{t('time.seconds', 'Secs')}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
