
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/stores/auth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/Button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface GameChatProps {
  tableId: string;
}

interface Message {
  id: string;
  player_id: string;
  player_name: string;
  message: string;
  created_at: string;
  table_id: string;
}

export function GameChat({ tableId }: GameChatProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  // Fetch existing messages when component mounts
  useEffect(() => {
    if (!tableId || !user) return;
    
    const fetchMessages = async () => {
      try {
        setLoading(true);
        
        // Create a custom channel for room messages
        const channel = supabase.channel(`chat:${tableId}`)
          .on('broadcast', { event: 'new_message' }, (payload) => {
            setMessages(current => [...current, payload.payload as Message]);
          })
          .subscribe();
        
        // Load initial messages from database
        const { data, error } = await supabase
          .from('table_chat_messages')
          .select('*')
          .eq('table_id', tableId)
          .order('created_at', { ascending: true })
          .limit(50);
          
        if (error) {
          console.error('Error fetching chat messages:', error);
          return;
        }
        
        if (data) {
          setMessages(data as Message[]);
        }
        
      } catch (err) {
        console.error('Error setting up message channel:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMessages();
    
    return () => {
      // Cleanup channel subscription
      supabase.removeChannel(supabase.channel(`chat:${tableId}`));
    };
  }, [tableId, user]);
  
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
    
    if (!user || !newMessage.trim() || !tableId) return;
    
    try {
      setLoading(true);
      
      const messageData = {
        id: crypto.randomUUID(),
        table_id: tableId,
        player_id: user.id,
        player_name: user.alias || user.email || 'Anonymous',
        message: newMessage.trim(),
        created_at: new Date().toISOString()
      };
      
      // Store message in database for persistence
      const { error } = await supabase
        .from('table_chat_messages')
        .insert([messageData]);
        
      if (error) {
        throw error;
      }
      
      // Broadcast message to all connected clients
      await supabase.channel(`chat:${tableId}`).send({
        type: 'broadcast',
        event: 'new_message',
        payload: messageData,
      });
      
      setNewMessage('');
    } catch (err: any) {
      console.error('Error sending message:', err);
      toast({
        title: "Failed to send message",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-grow h-[280px]" ref={scrollAreaRef}>
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
                  <p className="break-words">{msg.message}</p>
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
