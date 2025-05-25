
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/stores/auth';
import { useToast } from '@/hooks/use-toast';

export interface ChatMessage {
  id: string;
  player_id: string;
  channel_id: string;
  message: string;
  created_at: string;
  is_system_message: boolean;
  mentions: string[];
  reply_to_message_id?: string;
  edited_at?: string;
  is_deleted: boolean;
  player_name?: string;
  player_avatar?: string;
}

export interface TypingIndicator {
  id: string;
  channel_id: string;
  player_id: string;
  player_name?: string;
  is_typing: boolean;
  updated_at: string;
}

export interface ChatPreferences {
  id: string;
  player_id: string;
  channel_id: string;
  is_muted: boolean;
  notification_enabled: boolean;
  emoji_enabled: boolean;
}

export function useChatSystem(channelId: string, tableId?: string) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typingUsers, setTypingUsers] = useState<TypingIndicator[]>([]);
  const [preferences, setPreferences] = useState<ChatPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  // Load chat preferences
  const loadPreferences = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('chat_user_preferences')
        .select('*')
        .eq('player_id', user.id)
        .eq('channel_id', channelId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading preferences:', error);
        return;
      }

      if (!data) {
        // Create default preferences
        const { data: newPrefs, error: createError } = await supabase
          .from('chat_user_preferences')
          .insert({
            player_id: user.id,
            channel_id: channelId,
            is_muted: false,
            notification_enabled: true,
            emoji_enabled: true
          })
          .select()
          .single();

        if (createError) {
          console.error('Error creating preferences:', createError);
          return;
        }

        setPreferences(newPrefs);
      } else {
        setPreferences(data);
      }
    } catch (err) {
      console.error('Error in loadPreferences:', err);
    }
  }, [user, channelId]);

  // Load messages
  const loadMessages = useCallback(async () => {
    try {
      setLoading(true);
      
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
        .eq('is_deleted', false)
        .order('created_at', { ascending: true })
        .limit(50);

      if (error) {
        console.error('Error loading messages:', error);
        return;
      }

      const formattedMessages = data.map((msg: any) => ({
        ...msg,
        player_name: msg.profiles?.alias || 'Unknown Player',
        player_avatar: msg.profiles?.avatar_url
      }));

      setMessages(formattedMessages);
    } catch (err) {
      console.error('Error in loadMessages:', err);
    } finally {
      setLoading(false);
    }
  }, [channelId]);

  // Send message
  const sendMessage = useCallback(async (content: string, replyToId?: string) => {
    if (!user || !content.trim()) return;

    try {
      // Extract mentions (@username)
      const mentionRegex = /@(\w+)/g;
      const mentions: string[] = [];
      let match;
      while ((match = mentionRegex.exec(content)) !== null) {
        mentions.push(match[1]);
      }

      const { error } = await supabase
        .from('chat_messages')
        .insert({
          player_id: user.id,
          channel_id: channelId,
          message: content.trim(),
          mentions: mentions,
          reply_to_message_id: replyToId,
          is_system_message: false
        });

      if (error) {
        console.error('Error sending message:', error);
        toast({
          title: 'Error',
          description: 'No se pudo enviar el mensaje',
          variant: 'destructive'
        });
      }
    } catch (err) {
      console.error('Error in sendMessage:', err);
    }
  }, [user, channelId, toast]);

  // Send system message
  const sendSystemMessage = useCallback(async (content: string) => {
    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          player_id: user?.id || '00000000-0000-0000-0000-000000000000',
          channel_id: channelId,
          message: content,
          is_system_message: true
        });

      if (error) {
        console.error('Error sending system message:', error);
      }
    } catch (err) {
      console.error('Error in sendSystemMessage:', err);
    }
  }, [user, channelId]);

  // Update typing indicator
  const updateTypingIndicator = useCallback(async (typing: boolean) => {
    if (!user) return;

    try {
      const { error } = await supabase.rpc('update_typing_indicator', {
        p_channel_id: channelId,
        p_player_id: user.id,
        p_is_typing: typing
      });

      if (error) {
        console.error('Error updating typing indicator:', error);
      }
    } catch (err) {
      console.error('Error in updateTypingIndicator:', err);
    }
  }, [user, channelId]);

  // Handle typing
  const handleTyping = useCallback(() => {
    if (!isTyping) {
      setIsTyping(true);
      updateTypingIndicator(true);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing after 2 seconds
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      updateTypingIndicator(false);
    }, 2000);
  }, [isTyping, updateTypingIndicator]);

  // Stop typing
  const stopTyping = useCallback(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    if (isTyping) {
      setIsTyping(false);
      updateTypingIndicator(false);
    }
  }, [isTyping, updateTypingIndicator]);

  // Update preferences
  const updatePreferences = useCallback(async (updates: Partial<ChatPreferences>) => {
    if (!user || !preferences) return;

    try {
      const { error } = await supabase
        .from('chat_user_preferences')
        .update(updates)
        .eq('id', preferences.id);

      if (error) {
        console.error('Error updating preferences:', error);
        return;
      }

      setPreferences(prev => prev ? { ...prev, ...updates } : null);
    } catch (err) {
      console.error('Error in updatePreferences:', err);
    }
  }, [user, preferences]);

  // Report message
  const reportMessage = useCallback(async (messageId: string, reason: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('chat_moderation')
        .insert({
          message_id: messageId,
          reporter_id: user.id,
          reason: reason
        });

      if (error) {
        console.error('Error reporting message:', error);
        return;
      }

      toast({
        title: 'Mensaje reportado',
        description: 'Gracias por reportar este mensaje. Lo revisaremos pronto.'
      });
    } catch (err) {
      console.error('Error in reportMessage:', err);
    }
  }, [user, toast]);

  // Set up subscriptions
  useEffect(() => {
    if (!user) return;

    loadPreferences();
    loadMessages();

    // Subscribe to new messages
    const messagesChannel = supabase
      .channel(`chat_messages_${channelId}`)
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'chat_messages',
          filter: `channel_id=eq.${channelId}`
        },
        async (payload) => {
          const newMessage = payload.new as ChatMessage;
          
          // Get player profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('alias, avatar_url')
            .eq('id', newMessage.player_id)
            .single();

          const formattedMessage = {
            ...newMessage,
            player_name: profile?.alias || 'Unknown Player',
            player_avatar: profile?.avatar_url
          };

          setMessages(prev => [...prev, formattedMessage]);

          // Show notification if not muted and not from current user
          if (preferences?.notification_enabled && 
              newMessage.player_id !== user.id && 
              !preferences?.is_muted &&
              newMessage.mentions.includes(user.alias || '')) {
            toast({
              title: 'Mención en chat',
              description: `${formattedMessage.player_name} te mencionó`
            });
          }
        }
      )
      .subscribe();

    // Subscribe to typing indicators
    const typingChannel = supabase
      .channel(`chat_typing_${channelId}`)
      .on('postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_typing_indicators',
          filter: `channel_id=eq.${channelId}`
        },
        async (payload) => {
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            const indicator = payload.new as TypingIndicator;
            
            // Skip own typing indicator
            if (indicator.player_id === user.id) return;

            // Get player name
            const { data: profile } = await supabase
              .from('profiles')
              .select('alias')
              .eq('id', indicator.player_id)
              .single();

            const formattedIndicator = {
              ...indicator,
              player_name: profile?.alias || 'Unknown Player'
            };

            setTypingUsers(prev => {
              const filtered = prev.filter(t => t.player_id !== indicator.player_id);
              return indicator.is_typing ? [...filtered, formattedIndicator] : filtered;
            });
          } else if (payload.eventType === 'DELETE') {
            const indicator = payload.old as TypingIndicator;
            setTypingUsers(prev => prev.filter(t => t.player_id !== indicator.player_id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messagesChannel);
      supabase.removeChannel(typingChannel);
      stopTyping();
    };
  }, [user, channelId, preferences?.notification_enabled, preferences?.is_muted, loadPreferences, loadMessages, toast, stopTyping]);

  return {
    messages,
    typingUsers,
    preferences,
    loading,
    sendMessage,
    sendSystemMessage,
    handleTyping,
    stopTyping,
    updatePreferences,
    reportMessage,
    isTyping
  };
}
