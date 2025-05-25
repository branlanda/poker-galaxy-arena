
import React, { useState, useRef, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Users, Settings } from 'lucide-react';
import { useChatSystem } from '@/hooks/useChatSystem';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { TypingIndicator } from './TypingIndicator';
import { ChatSettings } from './ChatSettings';
import { useAuth } from '@/stores/auth';

interface EnhancedChatProps {
  channelId: string;
  title: string;
  tableId?: string;
  onPlayerJoin?: (playerName: string) => void;
  onPlayerLeave?: (playerName: string) => void;
  className?: string;
}

export function EnhancedChat({ 
  channelId, 
  title, 
  tableId, 
  onPlayerJoin, 
  onPlayerLeave,
  className = ''
}: EnhancedChatProps) {
  const { user } = useAuth();
  const [showSettings, setShowSettings] = useState(false);
  const [replyingTo, setReplyingTo] = useState<{ id: string; playerName: string; message: string } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    typingUsers,
    preferences,
    loading,
    sendMessage,
    sendSystemMessage,
    handleTyping,
    stopTyping,
    updatePreferences,
    reportMessage
  } = useChatSystem(channelId, tableId);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Send system messages for player join/leave
  useEffect(() => {
    if (onPlayerJoin) {
      // This would be called when a player joins the table
    }
    if (onPlayerLeave) {
      // This would be called when a player leaves the table
    }
  }, [onPlayerJoin, onPlayerLeave]);

  const handleSendMessage = (content: string, replyToId?: string) => {
    sendMessage(content, replyToId);
    setReplyingTo(null);
  };

  const handleReply = (messageId: string, playerName: string) => {
    const message = messages.find(m => m.id === messageId);
    if (message) {
      setReplyingTo({
        id: messageId,
        playerName,
        message: message.message
      });
    }
  };

  const onlineUsers = typingUsers.length + (user ? 1 : 0);

  if (!user) {
    return (
      <Card className={`bg-navy/20 border-emerald/10 ${className}`}>
        <CardContent className="p-4">
          <div className="text-center text-gray-400">
            <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Inicia sesión para participar en el chat</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className={`bg-navy/20 border-emerald/10 flex flex-col ${className}`}>
        <CardHeader className="py-3 px-4 border-b border-emerald/10">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white text-sm font-medium flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              {title}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                <Users className="h-3 w-3 mr-1" />
                {onlineUsers}
              </Badge>
              <Settings 
                className="h-4 w-4 text-gray-400 hover:text-emerald cursor-pointer"
                onClick={() => setShowSettings(true)}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 p-0 flex flex-col min-h-0">
          {/* Messages area */}
          <ScrollArea className="flex-1" ref={scrollAreaRef}>
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin h-6 w-6 border-2 border-emerald border-t-transparent rounded-full"></div>
              </div>
            ) : messages.length > 0 ? (
              <div className="space-y-1">
                {messages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    message={message}
                    onReply={handleReply}
                    onReport={reportMessage}
                  />
                ))}
                <TypingIndicator typingUsers={typingUsers} />
                <div ref={messagesEndRef} />
              </div>
            ) : (
              <div className="flex items-center justify-center h-32 text-center text-gray-400">
                <div>
                  <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No hay mensajes aún</p>
                  <p className="text-sm">¡Sé el primero en escribir!</p>
                </div>
              </div>
            )}
          </ScrollArea>

          {/* Chat input */}
          <ChatInput
            onSendMessage={handleSendMessage}
            onTyping={handleTyping}
            onStopTyping={stopTyping}
            replyingTo={replyingTo}
            onCancelReply={() => setReplyingTo(null)}
            preferences={preferences}
            onOpenSettings={() => setShowSettings(true)}
          />
        </CardContent>
      </Card>

      {/* Settings dialog */}
      <ChatSettings
        open={showSettings}
        onClose={() => setShowSettings(false)}
        preferences={preferences}
        onUpdatePreferences={updatePreferences}
      />
    </>
  );
}
