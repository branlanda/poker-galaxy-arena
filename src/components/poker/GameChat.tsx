
import { EnhancedChat } from '@/components/chat/EnhancedChat';

interface GameChatProps {
  tableId: string;
  userId?: string;
}

export function GameChat({ tableId, userId }: GameChatProps) {
  return (
    <EnhancedChat
      channelId={`table_${tableId}`}
      title="Chat de Mesa"
      tableId={tableId}
      className="h-[400px]"
    />
  );
}
