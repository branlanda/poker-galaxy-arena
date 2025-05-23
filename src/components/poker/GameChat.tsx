
import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/Button';
import { Send } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { RoomMessage } from '@/types/lobby';
import { motion, AnimatePresence } from 'framer-motion';

interface GameChatProps {
  tableId: string;
  userId?: string;
}

export function GameChat({ tableId, userId }: GameChatProps) {
  const { t } = useTranslation();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<RoomMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [playerName, setPlayerName] = useState<string>('');
  
  // Scroll to bottom of chat when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Fetch player name
  useEffect(() => {
    if (!userId) return;
    
    const fetchPlayerName = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('alias')
        .eq('id', userId)
        .single();
        
      if (!error && data) {
        setPlayerName(data.alias || 'Player');
      }
    };
    
    fetchPlayerName();
  }, [userId]);
  
  // Fetch initial messages
  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      try {
        // Replace this with a direct query since table_chat_messages isn't recognized
        const { data, error } = await supabase
          .rpc('get_table_chat_messages', { p_table_id: tableId })
          .limit(50);
          
        if (error) throw error;
        if (data) {
          setMessages(data as RoomMessage[]);
        } else {
          setMessages([]);
        }
      } catch (err) {
        console.error('Error fetching messages:', err);
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMessages();
  }, [tableId]);
  
  // Set up realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel('table-chat')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'table_chat_messages', filter: `table_id=eq.${tableId}` }, 
        payload => {
          // Cast the payload to our expected type
          const newMessage = payload.new as unknown as RoomMessage;
          setMessages(prev => [...prev, newMessage]);
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [tableId]);
  
  const handleSendMessage = async () => {
    if (!message.trim() || !userId || !playerName) return;
    
    try {
      // Replace this with an RPC function
      await supabase.rpc('insert_chat_message', {
        p_table_id: tableId,
        p_player_id: userId,
        p_player_name: playerName,
        p_message: message.trim()
      });
      
      setMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-500">{t('loadingMessages', 'Cargando mensajes...')}</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-500">{t('noMessages', 'No hay mensajes aún')}</p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                className={`flex items-start gap-3 ${msg.player_id === userId ? 'justify-end' : ''}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {msg.player_id !== userId && (
                  <Avatar className="h-6 w-6">
                    <AvatarFallback>{msg.player_name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                )}
                
                <div className={`max-w-[70%] ${msg.player_id === userId ? 'bg-emerald-950/30 border-emerald/30' : 'bg-navy-700/50 border-navy-600/50'} border p-3 rounded-lg`}>
                  <div className="flex justify-between items-center mb-1 gap-4">
                    <span className={`text-xs font-medium ${msg.player_id === userId ? 'text-emerald-400' : 'text-blue-400'}`}>
                      {msg.player_name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatTime(msg.created_at)}
                    </span>
                  </div>
                  <p className="text-sm break-words">{msg.message}</p>
                </div>
                
                {msg.player_id === userId && (
                  <Avatar className="h-6 w-6">
                    <AvatarFallback>{msg.player_name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-3 border-t border-emerald/10 bg-navy-900/30">
        <div className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('typeMessage', 'Escribe un mensaje...')}
            disabled={!userId}
            className="flex-1"
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={!message.trim() || !userId}
            size="icon"
            variant="ghost"
            className="bg-emerald/10"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
