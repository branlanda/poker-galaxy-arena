
import { EnhancedChat } from '@/components/chat/EnhancedChat';

interface TournamentChatProps {
  tournamentId: string;
  tournamentName: string;
}

export function TournamentChat({ tournamentId, tournamentName }: TournamentChatProps) {
  return (
    <EnhancedChat
      channelId={`tournament_${tournamentId}`}
      title={`Chat: ${tournamentName}`}
      className="h-[600px]"
    />
  );
}
