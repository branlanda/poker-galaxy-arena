
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/stores/auth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send } from 'lucide-react';
import { RoomMessageType } from '@/types/supabase';
import { useTranslation } from '@/hooks/useTranslation';

interface ChatRoomProps {
  tableId: string;
}

export function ChatRoom({ tableId }: ChatRoomProps) {
  const { user } = useAuth();
  const { t } = useTranslation('common');
  const [messages, setMessages] = useState<RoomMessageType[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('room_messages')
          .select('*')
          .eq('table_id', tableId)
          .order('created_at', { ascending: true })
          .limit(50);
          
        if (error) {
          console.error('Error fetching messages:', error);
          return;
        }
        
        setMessages(data || []);
      } catch (err) {
        console.error('Error in fetchMessages:', err);
      }
    };
    
    fetchMessages();
    
    const channel = supabase
      .channel('table-chat')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'room_messages',
          filter: `table_id=eq.${tableId}`,
        },
        (payload: { new: RoomMessageType }) => {
          setMessages((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [tableId]);
  
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newMessage.trim()) return;
    
    setLoading(true);
    try {
      const playerName = user.alias || user.email || 'Anonymous';
      
      const { error } = await supabase
        .from('room_messages')
        .insert({
          table_id: tableId,
          player_id: user.id,
          player_name: playerName,
          message: newMessage.trim(),
        });
        
      if (error) {
        console.error('Error sending message:', error);
      } else {
        setNewMessage('');
      }
    } catch (err) {
      console.error('Error in handleSendMessage:', err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col h-full" role="region" aria-label="Chat room">
      <ScrollArea className="flex-grow" ref={scrollAreaRef}>
        <div className="p-4 space-y-4">
          {messages.length === 0 ? (
            <p className="text-center text-gray-400 py-4">{t('chat.noMessages')}</p>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className={`max-w-[80%] ${msg.player_id === user?.id ? 'ml-auto' : ''}`}>
                <div className={`rounded-lg p-3 ${
                  msg.player_id === user?.id 
                    ? 'bg-emerald/20 text-white' 
                    : 'bg-gray-700/50 text-gray-200'
                }`}>
                  {msg.player_id !== user?.id && (
                    <p className="text-xs font-medium text-emerald">{msg.player_name}</p>
                  )}
                  <p>{msg.message}</p>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  <time dateTime={msg.created_at}>
                    {new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </time>
                </p>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
      
      <form onSubmit={handleSendMessage} className="border-t border-gray-800 p-2 flex gap-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder={t('chat.placeholder')}
          disabled={!user || loading}
          className="bg-gray-800"
          aria-label={t('chat.placeholder')}
        />
        <Button 
          type="submit" 
          size="icon" 
          disabled={!user || loading || !newMessage.trim()} 
          aria-label={t('send')}
        >
          <Send className="h-4 w-4" aria-hidden="true" />
        </Button>
      </form>
    </div>
  );
}
