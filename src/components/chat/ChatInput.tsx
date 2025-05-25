
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, X, Settings } from 'lucide-react';
import { EmojiPicker } from './EmojiPicker';
import { ChatPreferences } from '@/hooks/useChatSystem';

interface ChatInputProps {
  onSendMessage: (message: string, replyToId?: string) => void;
  onTyping: () => void;
  onStopTyping: () => void;
  disabled?: boolean;
  replyingTo?: { id: string; playerName: string; message: string } | null;
  onCancelReply?: () => void;
  preferences?: ChatPreferences | null;
  onOpenSettings?: () => void;
  maxLength?: number;
}

export function ChatInput({ 
  onSendMessage, 
  onTyping, 
  onStopTyping, 
  disabled, 
  replyingTo, 
  onCancelReply,
  preferences,
  onOpenSettings,
  maxLength = 500
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || disabled) return;
    
    onSendMessage(message.trim(), replyingTo?.id);
    setMessage('');
    onStopTyping();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= maxLength) {
      setMessage(value);
      if (value.trim()) {
        onTyping();
      } else {
        onStopTyping();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && replyingTo && onCancelReply) {
      onCancelReply();
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    if (!preferences?.emoji_enabled) return;
    
    const newMessage = message + emoji;
    if (newMessage.length <= maxLength) {
      setMessage(newMessage);
      inputRef.current?.focus();
    }
  };

  useEffect(() => {
    // Stop typing when component unmounts or message is empty
    return () => {
      if (message.trim()) {
        onStopTyping();
      }
    };
  }, [message, onStopTyping]);

  if (preferences?.is_muted) {
    return (
      <div className="p-4 border-t border-emerald/20 bg-navy/30">
        <div className="flex items-center justify-center gap-2 text-gray-400">
          <span>Chat silenciado</span>
          {onOpenSettings && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onOpenSettings}
              className="text-emerald hover:text-emerald"
            >
              <Settings className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="border-t border-emerald/20 bg-navy/30">
      {/* Reply indicator */}
      {replyingTo && (
        <div className="px-4 py-2 bg-emerald/10 border-b border-emerald/20">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <div className="text-xs text-emerald font-medium">
                Respondiendo a {replyingTo.playerName}
              </div>
              <div className="text-xs text-gray-400 truncate">
                {replyingTo.message}
              </div>
            </div>
            {onCancelReply && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onCancelReply}
                className="h-6 w-6 p-0 text-gray-400 hover:text-white"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Input form */}
      <form onSubmit={handleSubmit} className="p-3">
        <div className="flex items-end gap-2">
          {/* Settings button */}
          {onOpenSettings && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onOpenSettings}
              className="flex-shrink-0"
            >
              <Settings className="h-4 w-4" />
            </Button>
          )}

          {/* Message input */}
          <div className="flex-1">
            <Input
              ref={inputRef}
              value={message}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Escribe un mensaje..."
              disabled={disabled}
              className="bg-gray-800 border-gray-700 focus:border-emerald"
              maxLength={maxLength}
            />
            <div className="text-xs text-gray-500 mt-1 text-right">
              {message.length}/{maxLength}
            </div>
          </div>

          {/* Emoji picker */}
          {preferences?.emoji_enabled && (
            <EmojiPicker 
              onEmojiSelect={handleEmojiSelect}
              disabled={disabled}
            />
          )}

          {/* Send button */}
          <Button
            type="submit"
            size="sm"
            disabled={disabled || !message.trim()}
            className="flex-shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}
