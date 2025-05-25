
import { EnhancedChat } from '@/components/chat/EnhancedChat';

interface ChatRoomProps {
  tableId: string;
}

export function ChatRoom({ tableId }: ChatRoomProps) {
  return (
    <EnhancedChat
      channelId={`table_${tableId}`}
      title={`Mesa ${tableId.slice(-8)}`}
      tableId={tableId}
      className="h-full"
    />
  );
}
