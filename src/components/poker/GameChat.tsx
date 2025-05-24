import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { supabase } from '@/lib/supabase';
import { RoomMessageType } from '@/types/supabase';
import { useAuth } from '@/stores/auth';
import { useTranslation } from '@/hooks/useTranslation';

interface GameChatProps {
  tableId: string;
  userId?: string;
}

export function GameChat({ tableId, userId }: GameChatProps) {
  const [messages, setMessages] = useState<RoomMessageType[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { t } = useTranslation('common');
  
  // Fetch chat messages on component mount
  useEffect(() => {
    fetchMessages();
    
    // Subscribe to new messages
    const channel = supabase
      .channel(`table_chat:${tableId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'room_messages',
          filter: `table_id=eq.${tableId}`
        },
        (payload) => {
          const newMessage = payload.new as RoomMessageType;
          setMessages((prev) => [...prev, newMessage]);
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [tableId]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Fetch messages from the database
  const fetchMessages = async () => {
    setIsLoading(true);
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
      
      setMessages(data as RoomMessageType[]);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Send a new message
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newMessage.trim() || isLoading) return;
    
    setIsLoading(true);
    try {
      const playerName = user.alias || user.email?.split('@')[0] || 'Player';
      
      const { error } = await supabase
        .from('room_messages')
        .insert({
          table_id: tableId,
          player_id: user.id,
          player_name: playerName,
          message: newMessage.trim()
        });
      
      if (error) {
        console.error('Error sending message:', error);
        return;
      }
      
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Format timestamp
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };
  
  return (
    <div className="flex flex-col h-[400px] bg-navy/20 rounded-md border border-emerald/10">
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {isLoading && messages.length === 0 ? (
          <div className="text-center py-4 text-gray-400">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="text-center py-4 text-gray-400">No messages yet. Be the first to chat!</div>
        ) : (
          messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex flex-col ${msg.player_id === userId ? 'items-end' : 'items-start'}`}
            >
              <div 
                className={`
                  rounded-lg px-3 py-2 max-w-[80%] break-words
                  ${msg.player_id === userId 
                    ? 'bg-emerald-500/20 text-emerald-100' 
                    : 'bg-navy/40 text-gray-100'}
                `}
              >
                <div className="flex items-center gap-1 text-xs opacity-70 mb-1">
                  <span className="font-medium">{msg.player_name}</span>
                  <span>•</span>
                  <span>{formatTime(msg.created_at)}</span>
                </div>
                <p>{msg.message}</p>
              </div>
            </div>
          ))
        )}
        <div ref={chatEndRef} />
      </div>
      
      {/* Message input */}
      <form 
        onSubmit={sendMessage}
        className="p-3 border-t border-emerald/10 bg-navy/30 rounded-b-md"
      >
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={t('chat.typeMessage')}
            disabled={isLoading || !user}
            className="flex-1"
          />
          <Button
            type="submit"
            size="icon"
            disabled={isLoading || !newMessage.trim() || !user}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        {!user && (
          <p className="text-xs text-amber-500 mt-1">
            {t('chat.loginToSend')}
          </p>
        )}
      </form>
    </div>
  );
}
