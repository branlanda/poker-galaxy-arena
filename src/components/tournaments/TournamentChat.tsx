
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/stores/auth';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { Send } from 'lucide-react';

interface ChatMessage {
  id: string;
  player_id: string;
  tournament_id: string;
  message: string;
  created_at: string;
  player_name?: string;
  player_avatar?: string;
}

interface TournamentChatProps {
  tournamentId: string;
  tournamentName: string;
}

export function TournamentChat({ tournamentId, tournamentName }: TournamentChatProps) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Fetch initial messages
  const fetchMessages = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('tournament_chat_messages')
        .select(`
          *,
          profiles:player_id (alias, avatar_url)
        `)
        .eq('tournament_id', tournamentId)
        .order('created_at');
      
      if (error) throw error;
      
      // Format messages with player names and avatars
      const formattedMessages = data.map((message: any) => ({
        ...message,
        player_name: message.profiles?.alias || 'Unknown Player',
        player_avatar: message.profiles?.avatar_url
      }));
      
      setMessages(formattedMessages);
    } catch (err) {
      console.error('Error fetching tournament chat messages:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Setup subscription for new messages
  useEffect(() => {
    fetchMessages();
    
    const channel = supabase
      .channel(`tournament_chat_${tournamentId}`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'tournament_chat_messages', filter: `tournament_id=eq.${tournamentId}` },
        async (payload) => {
          if (payload.eventType === 'INSERT') {
            const newMessage = payload.new as ChatMessage;
            
            // Get player profile for the new message
            const { data: profileData } = await supabase
              .from('profiles')
              .select('alias, avatar_url')
              .eq('id', newMessage.player_id)
              .single();
              
            setMessages(current => [...current, {
              ...newMessage,
              player_name: profileData?.alias || 'Unknown Player',
              player_avatar: profileData?.avatar_url
            }]);
          }
        })
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [tournamentId]);
  
  // Auto scroll to bottom when new messages come in
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !newMessage.trim()) return;
    
    try {
      setSending(true);
      
      const { error } = await supabase
        .from('tournament_chat_messages')
        .insert({
          tournament_id: tournamentId,
          player_id: user.id,
          message: newMessage.trim()
        });
      
      if (error) throw error;
      
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setSending(false);
    }
  };
  
  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="px-4 py-2 border-b">
        <CardTitle className="text-lg">
          {t('tournaments.chatFor')} {tournamentName}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 p-0 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-8 h-8 border-2 border-emerald border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <ScrollArea className="h-full p-4">
            {messages.length > 0 ? (
              <div className="space-y-4">
                {messages.map((message) => {
                  const isSelf = message.player_id === user?.id;
                  
                  return (
                    <div 
                      key={message.id} 
                      className={`flex items-start gap-2 ${isSelf ? 'flex-row-reverse' : ''}`}
                    >
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarFallback>
                          {message.player_name?.substring(0, 2) || '??'}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className={`max-w-[80%] ${isSelf ? 'text-right' : ''}`}>
                        <div className={`px-3 py-2 rounded-lg ${
                          isSelf ? 'bg-emerald/20 text-white' : 'bg-navy/40'
                        }`}>
                          <p>{message.message}</p>
                        </div>
                        
                        <div className="flex items-center mt-1 text-xs text-muted-foreground gap-2">
                          {!isSelf && (
                            <span className="font-medium">{message.player_name}</span>
                          )}
                          <span>
                            {format(new Date(message.created_at), 'p')}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-center text-muted-foreground">
                <div>
                  <p className="mb-1">{t('tournaments.noChatMessages')}</p>
                  <p className="text-sm">{t('tournaments.beTheFirst')}</p>
                </div>
              </div>
            )}
          </ScrollArea>
        )}
      </CardContent>
      
      <CardFooter className="border-t p-4">
        <form onSubmit={handleSendMessage} className="flex w-full gap-2">
          <Input
            placeholder={t('tournaments.typeMessage')}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={!user || sending}
            className="flex-1"
          />
          <Button type="submit" disabled={!user || sending || !newMessage.trim()}>
            <Send className="h-4 w-4 mr-2" />
            {t('send')}
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
