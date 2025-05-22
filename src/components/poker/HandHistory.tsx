
import { useState } from 'react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Clock, Award } from 'lucide-react';

// This component displays the hand history using Accordion instead of Collapsible
export function HandHistory() {
  const [hands] = useState<any[]>([]);

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium mb-2 text-gray-300">Hand History</h3>
      
      {hands.length === 0 ? (
        <p className="text-xs text-gray-400 italic">
          Recent hands will appear here as they are played
        </p>
      ) : (
        <Accordion type="single" collapsible className="space-y-2">
          {hands.map((hand, index) => (
            <AccordionItem key={index} value={`hand-${index}`} className="border border-gray-700 rounded-md overflow-hidden">
              <AccordionTrigger className="px-3 py-2 hover:bg-gray-700/50">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center">
                    <Award className="h-4 w-4 mr-2 text-amber-400" />
                    <span>Hand #{hand.id}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-400">
                    <Clock className="h-3 w-3 mr-1" />
                    <time>{new Date(hand.timestamp).toLocaleTimeString()}</time>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-3 py-2 bg-gray-800/50">
                <div className="space-y-2 text-sm">
                  <p>Pot: {hand.pot}</p>
                  <p>Winner: {hand.winner}</p>
                  <p>Winning hand: {hand.winningHand}</p>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
}
