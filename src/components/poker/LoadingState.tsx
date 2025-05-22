
import { Loader2 } from 'lucide-react';

export function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
      <div className="mb-4">
        <Loader2 className="h-12 w-12 animate-spin text-emerald" />
      </div>
      <h2 className="text-xl font-bold mb-2">Loading Game</h2>
      <p className="text-gray-400 max-w-md text-center">
        Shuffling the cards and preparing the table...
      </p>
      
      {/* Loading animation for chips */}
      <div className="mt-8 flex gap-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div 
            key={i}
            className="w-6 h-6 rounded-full bg-emerald animate-bounce"
            style={{ 
              animationDelay: `${i * 0.1}s`,
              animationDuration: '0.8s'
            }}
          />
        ))}
      </div>
    </div>
  );
}
