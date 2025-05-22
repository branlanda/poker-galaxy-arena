
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RoomMessage } from '@/types/lobby';
import { useAuth } from '@/stores/auth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Loader2, Send } from 'lucide-react';
import { RoomMessageType } from '@/types/supabase';

interface ChatRoomProps {
  tableId: string;
}

export function ChatRoom({ tableId }: ChatRoomProps) {
  const [messages, setMessages] = useState<RoomMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch initial messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        // Cast result to any to bypass TypeScript errors with room_messages table
        // This is a temporary workaround until Supabase types are regenerated
        const { data, error } = await supabase
          .from('room_messages')
          .select('*')
          .eq('table_id', tableId)
          .order('created_at', { ascending: true })
          .limit(50) as { data: RoomMessageType[] | null, error: any };

        if (error) throw error;
        setMessages(data as unknown as RoomMessage[]);
      } catch (error: any) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel('room_messages_changes')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'room_messages',
          filter: `table_id=eq.${tableId}`
        },
        (payload) => {
          setMessages(current => [...current, payload.new as unknown as RoomMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [tableId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !newMessage.trim()) return;

    try {
      // Cast to any to bypass TypeScript errors with room_messages table
      const { error } = await supabase
        .from('room_messages')
        .insert({
          table_id: tableId,
          player_id: user.id,
          player_name: user.alias || user.email || 'Player',
          message: newMessage.trim()
        }) as { error: any };

      if (error) throw error;
      
      // Clear input field
      setNewMessage('');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Failed to send message: ${error.message}`,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="text-sm font-medium mb-2 bg-navy/50 p-2 rounded-t">
        Table Chat
      </div>
      
      <div className="flex-grow overflow-y-auto bg-navy/30 p-2 rounded-t space-y-2 mb-2 max-h-[300px]">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
          </div>
        ) : messages.length > 0 ? (
          messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`p-2 rounded text-sm ${
                user && msg.player_id === user.id
                  ? 'bg-emerald/10 ml-6'
                  : 'bg-navy/50 mr-6'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium text-emerald">
                  {user && msg.player_id === user.id ? 'You' : msg.player_name}
                </span>
                <span className="text-gray-400 text-xs">
                  {new Date(msg.created_at).toLocaleTimeString()}
                </span>
              </div>
              <p className="break-words">{msg.message}</p>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-400 py-4">
            No messages yet. Start the conversation!
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSendMessage} className="flex space-x-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          disabled={!user}
          className="bg-navy/30 border-emerald/20 focus:border-emerald/40"
        />
        <Button 
          type="submit" 
          size="icon" 
          disabled={!user || !newMessage.trim()}
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
