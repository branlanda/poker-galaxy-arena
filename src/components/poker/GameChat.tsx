
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/stores/auth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/Button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send } from 'lucide-react';

interface GameChatProps {
  tableId: string;
}

interface Message {
  id: string;
  player_id: string;
  player_name: string;
  message: string;
  created_at: string;
}

export function GameChat({ tableId }: GameChatProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  // Fetch existing messages when component mounts
  useEffect(() => {
    if (!tableId) return;
    
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('room_messages')
          .select('*')
          .eq('table_id', tableId)
          .order('created_at', { ascending: true })
          .limit(50);
          
        if (error) throw error;
        setMessages(data || []);
      } catch (err) {
        console.error('Error fetching messages:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMessages();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('room_messages')
      .on(
        'postgres_changes',
        { 
          event: 'INSERT',
          schema: 'public', 
          table: 'room_messages', 
          filter: `table_id=eq.${tableId}`
        },
        (payload) => {
          setMessages(current => [...current, payload.new as Message]);
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [tableId]);
  
  // Auto-scroll to bottom when messages update
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollableNode = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollableNode) {
        scrollableNode.scrollTop = scrollableNode.scrollHeight;
      }
    }
  }, [messages]);
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !newMessage.trim()) return;
    
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('room_messages')
        .insert({
          table_id: tableId,
          player_id: user.id,
          player_name: user.alias || user.email || 'Anonymous',
          message: newMessage.trim()
        });
        
      if (error) throw error;
      
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-grow" ref={scrollAreaRef}>
        <div className="p-4 space-y-4">
          {messages.length === 0 ? (
            <p className="text-center text-gray-400 py-4">No messages yet</p>
          ) : (
            messages.map(msg => (
              <div 
                key={msg.id}
                className={`max-w-[80%] ${msg.player_id === user?.id ? 'ml-auto' : ''}`}
              >
                <div 
                  className={`rounded-lg p-3 ${
                    msg.player_id === user?.id 
                      ? 'bg-emerald/20 text-white' 
                      : 'bg-gray-700/50 text-gray-200'
                  }`}
                >
                  {msg.player_id !== user?.id && (
                    <p className="text-xs font-medium text-emerald">{msg.player_name}</p>
                  )}
                  <p>{msg.message}</p>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(msg.created_at).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
      
      <form 
        onSubmit={handleSendMessage}
        className="border-t border-gray-800 p-2 flex gap-2"
      >
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          disabled={!user || loading}
          className="bg-gray-800"
        />
        <Button 
          type="submit" 
          size="icon" 
          disabled={!user || loading || !newMessage.trim()}
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
