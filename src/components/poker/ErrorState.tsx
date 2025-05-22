
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';

interface ErrorStateProps {
  error: string | null;
}

export function ErrorState({ error }: ErrorStateProps) {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
      <div className="bg-red-900/20 border border-red-500/30 rounded-full p-6 mb-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
      </div>
      <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
      <p className="text-gray-400 mb-6 max-w-md">
        {error || "We couldn't load the game properly. Please try again later."}
      </p>
      <div className="flex gap-4">
        <Button onClick={() => window.location.reload()}>
          Try Again
        </Button>
        <Button variant="outline" onClick={() => navigate('/lobby')}>
          Back to Lobby
        </Button>
      </div>
    </div>
  );
}
