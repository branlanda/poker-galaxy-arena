
import { Button } from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';

interface ErrorStateProps {
  error: string | null;
}

export function ErrorState({ error }: ErrorStateProps) {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto px-4 py-6 grid place-items-center h-[80vh]">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-4">
          {error ? `Error: ${error}` : 'Table not found'}
        </h2>
        <Button onClick={() => navigate('/lobby')}>Return to Lobby</Button>
      </div>
    </div>
  );
}
