
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';
import { RoomMessage } from '@/types/lobby';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/stores/auth';
import { format } from 'date-fns';

interface GameChatProps {
  tableId: string;
}

export function GameChat({ tableId }: GameChatProps) {
  const [messages, setMessages] = useState<RoomMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  
  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load initial messages
  useEffect(() => {
    const loadMessages = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .rpc('get_table_chat_messages', { p_table_id: tableId });
          
        if (error) {
          console.error('Error loading chat messages:', error);
          return;
        }
        
        // Cast the data to RoomMessage[] type
        setMessages(data as unknown as RoomMessage[]);
      } catch (err) {
        console.error('Failed to load chat messages:', err);
      } finally {
        setLoading(false);
      }
    };
    
    if (tableId) {
      loadMessages();
    }
    
    // Set up realtime subscription for new messages
    const channel = supabase
      .channel(`table-chat-${tableId}`)
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'table_chat_messages',
          filter: `table_id=eq.${tableId}`
        }, 
        (payload) => {
          const newMessage = payload.new as RoomMessage;
          setMessages(current => [...current, newMessage]);
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [tableId]);

  // Send a new message
  const sendMessage = async () => {
    if (!user || !newMessage.trim() || !tableId) return;
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .rpc('insert_chat_message', {
          p_table_id: tableId,
          p_player_id: user.id,
          p_player_name: user.alias || user.email || 'Anonymous',
          p_message: newMessage.trim()
        });
      
      if (error) {
        console.error('Error sending message:', error);
        return;
      }
      
      setNewMessage('');
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle enter key to send message
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[400px] bg-navy/50 border border-emerald/10 rounded-lg">
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {loading && messages.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-pulse text-gray-500">Loading messages...</div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <div className="text-gray-500">No messages yet. Start the conversation!</div>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`max-w-[80%] ${
                msg.player_id === user?.id
                  ? 'ml-auto bg-emerald-900/30 rounded-tl-lg rounded-bl-lg rounded-tr-lg'
                  : 'mr-auto bg-navy-700/50 rounded-tr-lg rounded-br-lg rounded-tl-lg'
              } p-2 text-sm`}
            >
              <div className={`font-medium text-xs ${msg.player_id === user?.id ? 'text-emerald-300' : 'text-amber-300'}`}>
                {msg.player_name}
                <span className="ml-2 text-gray-400 text-xs">
                  {format(new Date(msg.created_at), 'HH:mm')}
                </span>
              </div>
              <div className="mt-1 break-words">{msg.message}</div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="border-t border-emerald/10 p-2">
        <div className="flex items-center gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            disabled={loading || !user}
            className="flex-1"
          />
          <Button
            size="icon"
            onClick={sendMessage}
            disabled={loading || !newMessage.trim() || !user}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
