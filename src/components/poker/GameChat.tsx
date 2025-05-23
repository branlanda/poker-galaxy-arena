
import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { RoomMessage } from '@/types/lobby';
import { useAuth } from '@/stores/auth';

interface GameChatProps {
  tableId: string;
  userId?: string;
}

export function GameChat({ tableId, userId }: GameChatProps) {
  const [messages, setMessages] = useState<RoomMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  
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
          table: 'table_chat_messages',
          filter: `table_id=eq.${tableId}`
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as RoomMessage]);
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
  
  // Fetch messages from the server
  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .rpc('get_table_chat_messages', { p_table_id: tableId });
      
      if (error) {
        console.error('Error fetching messages:', error);
        return;
      }
      
      setMessages(data as RoomMessage[]);
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
      const { error } = await supabase
        .rpc('insert_chat_message', { 
          p_table_id: tableId, 
          p_player_id: user.id, 
          p_player_name: user?.user_metadata?.name || user.email || 'Player',
          p_message: newMessage.trim() 
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
            placeholder="Type your message..."
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
            You must be logged in to send messages
          </p>
        )}
      </form>
    </div>
  );
}
