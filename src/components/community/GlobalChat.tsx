
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/stores/auth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';
import { Send, X, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';

interface ChatMessage {
  id: string;
  player_id: string;
  message: string;
  created_at: string;
  player_name?: string;
  player_avatar?: string;
}

export interface GlobalChatProps {
  collapsed?: boolean;
  onToggle?: () => void;
  defaultOpen?: boolean;
  channelId?: string;
}

export function GlobalChat({ 
  collapsed = false, 
  onToggle,
  defaultOpen = false,
  channelId = 'global'
}: GlobalChatProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t, language } = useTranslation();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Scroll to bottom of chat when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Fetch initial messages
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('chat_messages')
          .select(`
            *,
            profiles:player_id (
              alias,
              avatar_url
            )
          `)
          .eq('channel_id', channelId)
          .order('created_at', { ascending: false })
          .limit(50);
          
        if (error) throw error;
        
        // Format and reverse to show newest at the bottom
        const formattedMessages = data
          .map(msg => ({
            ...msg,
            player_name: msg.profiles?.alias,
            player_avatar: msg.profiles?.avatar_url
          }))
          .reverse();
          
        setMessages(formattedMessages);
      } catch (err) {
        console.error('Error fetching messages:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMessages();
    
    // Subscribe to new messages
    const subscription = supabase
      .channel(`chat-${channelId}`)
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `channel_id=eq.${channelId}` },
        async (payload) => {
          const newMessage = payload.new as ChatMessage;
          
          // Fetch player details
          if (newMessage.player_id) {
            const { data } = await supabase
              .from('profiles')
              .select('alias, avatar_url')
              .eq('id', newMessage.player_id)
              .single();
              
            if (data) {
              newMessage.player_name = data.alias;
              newMessage.player_avatar = data.avatar_url;
            }
          }
          
          setMessages(prev => [...prev, newMessage]);
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [channelId]);
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: t('errors.notLoggedIn'),
        description: t('chat.loginToSend'),
        variant: 'destructive',
      });
      return;
    }
    
    if (!message.trim()) return;
    
    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          player_id: user.id,
          message: message.trim(),
          channel_id: channelId
        });
        
      if (error) throw error;
      
      setMessage('');
      inputRef.current?.focus();
    } catch (err) {
      console.error('Error sending message:', err);
      toast({
        title: t('errors.messageFailed'),
        description: t('chat.messageNotSent'),
        variant: 'destructive',
      });
    }
  };
  
  const formatMessageTime = (timestamp: string) => {
    return format(new Date(timestamp), 'HH:mm');
  };
  
  const toggleChat = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    if (onToggle) onToggle();
  };
  
  if (collapsed) {
    return (
      <Button 
        onClick={toggleChat}
        size="sm" 
        className="fixed bottom-4 right-4 z-50 rounded-full h-12 w-12 p-0 shadow-lg"
      >
        <MessageCircle className="h-5 w-5" />
      </Button>
    );
  }
  
  return (
    <Card className={`
      fixed right-4 bottom-4 z-50 shadow-lg 
      ${isOpen ? 'h-[500px] w-80 flex flex-col' : 'w-auto h-auto'}
    `}>
      {isOpen ? (
        <>
          <CardHeader className="py-3 px-4 flex flex-row items-center justify-between space-y-0 border-b">
            <CardTitle className="text-sm font-medium">
              {t('chat.globalChat')}
            </CardTitle>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={toggleChat}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          
          <CardContent className="flex-1 p-0 overflow-hidden">
            <ScrollArea className="h-full">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin h-6 w-6 border-2 border-emerald border-t-transparent rounded-full"></div>
                </div>
              ) : messages.length > 0 ? (
                <div className="p-4 space-y-4">
                  {messages.map((msg) => (
                    <div 
                      key={msg.id} 
                      className={`flex gap-2 ${msg.player_id === user?.id ? 'justify-end' : 'justify-start'}`}
                    >
                      {msg.player_id !== user?.id && (
                        <Avatar className="h-8 w-8">
                          {msg.player_avatar ? (
                            <AvatarImage src={msg.player_avatar} />
                          ) : null}
                          <AvatarFallback>
                            {msg.player_name?.substring(0, 2) || '??'}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      
                      <div className={`
                        max-w-[75%] rounded-lg px-3 py-2 text-sm
                        ${msg.player_id === user?.id 
                          ? 'bg-emerald text-primary-foreground ml-auto' 
                          : 'bg-muted text-muted-foreground mr-auto'
                        }
                      `}>
                        {msg.player_id !== user?.id && (
                          <p className="font-medium text-xs mb-1">
                            {msg.player_name || t('chat.unknownUser')}
                          </p>
                        )}
                        <div className="break-words">
                          {msg.message}
                        </div>
                        <div className="text-xs opacity-70 mt-1 text-right">
                          {formatMessageTime(msg.created_at)}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              ) : (
                <div className="flex items-center justify-center h-full p-4 text-center text-muted-foreground">
                  <div>
                    <MessageCircle className="h-10 w-10 mx-auto mb-2 opacity-20" />
                    <p>{t('chat.noMessages')}</p>
                    <p className="text-sm">{t('chat.beTheFirstToSend')}</p>
                  </div>
                </div>
              )}
            </ScrollArea>
          </CardContent>
          
          <CardFooter className="p-2 border-t">
            <form 
              onSubmit={handleSendMessage} 
              className="flex w-full items-center gap-2"
            >
              <Input
                ref={inputRef}
                type="text"
                placeholder={t('chat.typeMessage')}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1"
                disabled={!user}
              />
              <Button 
                type="submit" 
                size="sm" 
                disabled={!user || !message.trim()}
                className="px-3"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardFooter>
        </>
      ) : (
        <Button 
          onClick={toggleChat}
          variant="ghost" 
          className="p-2 h-auto"
        >
          <MessageCircle className="h-5 w-5 mr-2" />
          {t('chat.openChat')}
        </Button>
      )}
    </Card>
  );
}
