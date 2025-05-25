
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, X } from 'lucide-react';
import { EnhancedChat } from '@/components/chat/EnhancedChat';

export interface GlobalChatProps {
  collapsed?: boolean;
  onToggle?: () => void;
  defaultOpen?: boolean;
}

export function GlobalChat({ 
  collapsed = false, 
  onToggle,
  defaultOpen = false
}: GlobalChatProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
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
    <div className={`
      fixed right-4 bottom-4 z-50 shadow-lg 
      ${isOpen ? 'h-[500px] w-80' : 'w-auto h-auto'}
    `}>
      {isOpen ? (
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between p-3 bg-navy border border-emerald/20 rounded-t-lg">
            <h3 className="text-white font-medium">Chat Global</h3>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={toggleChat}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <EnhancedChat
            channelId="global"
            title="Chat Global"
            className="flex-1 rounded-t-none border-t-0"
          />
        </div>
      ) : (
        <Button 
          onClick={toggleChat}
          variant="ghost" 
          className="p-2 h-auto bg-navy border border-emerald/20 rounded-lg"
        >
          <MessageCircle className="h-5 w-5 mr-2" />
          Abrir Chat
        </Button>
      )}
    </div>
  );
}
