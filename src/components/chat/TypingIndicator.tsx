
import React from 'react';
import { TypingIndicator as TypingIndicatorType } from '@/hooks/useChatSystem';

interface TypingIndicatorProps {
  typingUsers: TypingIndicatorType[];
}

export function TypingIndicator({ typingUsers }: TypingIndicatorProps) {
  if (typingUsers.length === 0) return null;

  const getTypingText = () => {
    const names = typingUsers.map(user => user.player_name).filter(Boolean);
    
    if (names.length === 1) {
      return `${names[0]} está escribiendo...`;
    } else if (names.length === 2) {
      return `${names[0]} y ${names[1]} están escribiendo...`;
    } else if (names.length > 2) {
      return `${names[0]}, ${names[1]} y ${names.length - 2} más están escribiendo...`;
    }
    
    return 'Alguien está escribiendo...';
  };

  return (
    <div className="px-4 py-2 text-sm text-gray-400 italic">
      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-emerald rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-emerald rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-emerald rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
        <span>{getTypingText()}</span>
      </div>
    </div>
  );
}
