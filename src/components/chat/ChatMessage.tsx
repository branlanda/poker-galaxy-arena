
import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Reply, Flag } from 'lucide-react';
import { ChatMessage as ChatMessageType } from '@/hooks/useChatSystem';
import { useAuth } from '@/stores/auth';

interface ChatMessageProps {
  message: ChatMessageType;
  onReply?: (messageId: string, playerName: string) => void;
  onReport?: (messageId: string, reason: string) => void;
  showAvatar?: boolean;
}

export function ChatMessage({ message, onReply, onReport, showAvatar = true }: ChatMessageProps) {
  const { user } = useAuth();
  const [showReportDialog, setShowReportDialog] = useState(false);
  const isOwnMessage = message.player_id === user?.id;
  const isSystemMessage = message.is_system_message;

  const formatTime = (timestamp: string) => {
    return formatDistanceToNow(new Date(timestamp), { 
      addSuffix: true, 
      locale: es 
    });
  };

  const renderMessageContent = (content: string) => {
    // Replace mentions with highlighted spans
    const mentionRegex = /@(\w+)/g;
    const parts = content.split(mentionRegex);
    
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        // This is a mention
        const isSelfMention = part === user?.alias;
        return (
          <span 
            key={index} 
            className={`font-medium ${isSelfMention ? 'text-emerald bg-emerald/20 px-1 rounded' : 'text-blue-400'}`}
          >
            @{part}
          </span>
        );
      }
      return part;
    });
  };

  const handleReport = (reason: string) => {
    if (onReport) {
      onReport(message.id, reason);
    }
    setShowReportDialog(false);
  };

  if (isSystemMessage) {
    return (
      <div className="flex justify-center my-2">
        <div className="bg-navy/50 text-gray-400 text-sm px-3 py-1 rounded-full">
          {message.message}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex gap-3 p-3 hover:bg-navy/30 transition-colors ${isOwnMessage ? 'flex-row-reverse' : ''}`}>
      {showAvatar && (
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage src={message.player_avatar} />
          <AvatarFallback className="text-xs">
            {message.player_name?.substring(0, 2) || '??'}
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className={`flex-1 min-w-0 ${isOwnMessage ? 'text-right' : ''}`}>
        <div className="flex items-center gap-2 mb-1">
          {!isOwnMessage && (
            <span className="font-medium text-emerald text-sm">
              {message.player_name}
            </span>
          )}
          <span className="text-xs text-gray-500">
            {formatTime(message.created_at)}
          </span>
          {message.edited_at && (
            <span className="text-xs text-gray-500 italic">
              (editado)
            </span>
          )}
        </div>
        
        <div className={`inline-block rounded-lg px-3 py-2 max-w-sm break-words ${
          isOwnMessage 
            ? 'bg-emerald/20 text-white ml-auto' 
            : 'bg-navy/60 text-gray-100'
        }`}>
          {message.reply_to_message_id && (
            <div className="text-xs text-gray-400 italic mb-1 border-l-2 border-emerald/50 pl-2">
              Respondiendo a mensaje...
            </div>
          )}
          <div className="text-sm">
            {renderMessageContent(message.message)}
          </div>
        </div>
        
        <div className={`flex items-center gap-1 mt-1 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
          {!isOwnMessage && onReply && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onReply(message.id, message.player_name || '')}
              className="h-6 px-2 text-xs text-gray-500 hover:text-emerald"
            >
              <Reply className="h-3 w-3 mr-1" />
              Responder
            </Button>
          )}
          
          {!isOwnMessage && onReport && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-gray-500 hover:text-red-400"
                >
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleReport('spam')}>
                  <Flag className="h-3 w-3 mr-2" />
                  Reportar spam
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleReport('abusive_language')}>
                  <Flag className="h-3 w-3 mr-2" />
                  Lenguaje ofensivo
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleReport('inappropriate')}>
                  <Flag className="h-3 w-3 mr-2" />
                  Contenido inapropiado
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </div>
  );
}
