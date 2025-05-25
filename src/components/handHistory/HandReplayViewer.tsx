
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { DetailedHandHistory, BettingRound } from '@/types/handHistory';
import { Play, Pause, SkipBack, SkipForward, RotateCcw } from 'lucide-react';

interface HandReplayViewerProps {
  hand: DetailedHandHistory;
}

export const HandReplayViewer: React.FC<HandReplayViewerProps> = ({ hand }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000); // milliseconds per step

  // Create a timeline of all actions across all rounds
  const timeline = React.useMemo(() => {
    const steps = [];
    
    // Initial state
    steps.push({
      type: 'DEAL',
      round: 'PREFLOP',
      description: 'Cartas repartidas',
      pot: 0,
      communityCards: []
    });

    // Add betting rounds
    hand.betting_rounds.forEach((round) => {
      // Add community cards for this round
      if (round.round !== 'PREFLOP') {
        const communityCards = hand.community_cards?.[round.round.toLowerCase() as keyof typeof hand.community_cards] || [];
        steps.push({
          type: 'COMMUNITY_CARDS',
          round: round.round,
          description: `${round.round}: Cartas comunitarias reveladas`,
          communityCards,
          pot: round.pot_after_round
        });
      }

      // Add each action in the round
      round.actions.forEach((action) => {
        steps.push({
          type: 'ACTION',
          round: round.round,
          action,
          description: `${action.player_name}: ${action.action}${action.amount ? ` Ξ${action.amount.toFixed(2)}` : ''}`,
          pot: round.pot_after_round
        });
      });
    });

    // Final result
    steps.push({
      type: 'RESULT',
      round: 'SHOWDOWN',
      description: `Resultado final: ${hand.player_result >= 0 ? 'Ganancia' : 'Pérdida'} de Ξ${Math.abs(hand.player_result).toFixed(2)}`,
      pot: hand.final_pot
    });

    return steps;
  }, [hand]);

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= timeline.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, speed);

    return () => clearInterval(interval);
  }, [isPlaying, speed, timeline.length]);

  const currentStepData = timeline[currentStep];
  const progress = timeline.length > 1 ? (currentStep / (timeline.length - 1)) * 100 : 0;

  const handlePlay = () => setIsPlaying(!isPlaying);
  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };
  const handlePrevious = () => {
    setCurrentStep(Math.max(0, currentStep - 1));
    setIsPlaying(false);
  };
  const handleNext = () => {
    setCurrentStep(Math.min(timeline.length - 1, currentStep + 1));
    setIsPlaying(false);
  };

  const renderCommunityCards = (cards: any[] = []) => {
    return (
      <div className="flex space-x-2 justify-center">
        {Array.from({ length: 5 }).map((_, index) => {
          const card = cards[index];
          return (
            <div
              key={index}
              className={`w-12 h-16 rounded border-2 flex items-center justify-center text-sm font-bold ${
                card
                  ? 'bg-white text-black border-gray-300'
                  : 'bg-gray-700 border-gray-600 text-gray-500'
              }`}
            >
              {card ? (
                <div className="text-center">
                  <div>{card.value}</div>
                  <div className={card.suit === 'hearts' || card.suit === 'diamonds' ? 'text-red-500' : 'text-black'}>
                    {card.suit === 'hearts' ? '♥' : card.suit === 'diamonds' ? '♦' : 
                     card.suit === 'clubs' ? '♣' : '♠'}
                  </div>
                </div>
              ) : (
                '?'
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Game Board */}
      <div className="bg-emerald-900 rounded-lg p-8 min-h-[300px]">
        <div className="text-center space-y-4">
          <h3 className="text-white text-xl font-semibold">
            {currentStepData?.round || 'PREFLOP'}
          </h3>
          
          {/* Community Cards */}
          <div className="mb-6">
            {renderCommunityCards(currentStepData?.communityCards)}
          </div>

          {/* Pot */}
          <div className="text-center">
            <div className="bg-yellow-600 text-white px-4 py-2 rounded-full inline-block">
              Bote: Ξ{(currentStepData?.pot || 0).toFixed(2)}
            </div>
          </div>

          {/* Current Action Description */}
          <div className="text-white text-lg font-medium min-h-[2rem]">
            {currentStepData?.description || ''}
          </div>

          {/* Player's Hole Cards */}
          {hand.hole_cards && hand.hole_cards.length > 0 && (
            <div className="mt-6">
              <h4 className="text-white text-sm mb-2">Tus cartas:</h4>
              <div className="flex space-x-2 justify-center">
                {hand.hole_cards.map((card, index) => (
                  <div
                    key={index}
                    className="w-12 h-16 bg-white rounded border-2 border-gray-300 flex items-center justify-center text-sm font-bold text-black"
                  >
                    <div className="text-center">
                      <div>{card.value}</div>
                      <div className={card.suit === 'hearts' || card.suit === 'diamonds' ? 'text-red-500' : 'text-black'}>
                        {card.suit === 'hearts' ? '♥' : card.suit === 'diamonds' ? '♦' : 
                         card.suit === 'clubs' ? '♣' : '♠'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-400">
            <span>Paso {currentStep + 1} de {timeline.length}</span>
            <span>{progress.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-emerald h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-center space-x-4">
          <Button
            size="sm"
            variant="outline"
            onClick={handleReset}
            className="border-emerald/20 text-white hover:bg-emerald/10"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="border-emerald/20 text-white hover:bg-emerald/10"
          >
            <SkipBack className="h-4 w-4" />
          </Button>
          
          <Button
            size="sm"
            onClick={handlePlay}
            className="bg-emerald text-white hover:bg-emerald/80"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={handleNext}
            disabled={currentStep === timeline.length - 1}
            className="border-emerald/20 text-white hover:bg-emerald/10"
          >
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>

        {/* Speed Control */}
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-400 w-20">Velocidad:</span>
          <Slider
            value={[3000 - speed]}
            onValueChange={([value]) => setSpeed(3000 - value)}
            max={2500}
            min={200}
            step={100}
            className="flex-1"
          />
          <span className="text-sm text-gray-400 w-16">
            {speed === 200 ? 'Rápido' : speed === 1500 ? 'Normal' : 'Lento'}
          </span>
        </div>
      </div>
    </div>
  );
};
