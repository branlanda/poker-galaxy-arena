
import React, { useEffect, useState, useRef } from 'react';
import { PlayerAction } from '@/types/lobby';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

interface GameMessage {
  id: string;
  type: 'action' | 'notification' | 'winner' | 'join' | 'leave';
  message: string;
  timestamp: Date;
}

interface GameMessagesProps {
  playerName?: string;
  action?: {
    playerName: string;
    action: PlayerAction;
    amount?: number;
  };
  winner?: {
    playerName: string;
    amount: number;
  };
  newPlayer?: {
    playerName: string;
  };
  leavingPlayer?: {
    playerName: string;
  };
  gamePhase?: string;
}

export const GameMessages: React.FC<GameMessagesProps> = ({
  playerName,
  action,
  winner,
  newPlayer,
  leavingPlayer,
  gamePhase
}) => {
  const [messages, setMessages] = useState<GameMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Add messages when props change
  useEffect(() => {
    if (action) {
      let actionText = '';
      switch (action.action) {
        case 'FOLD':
          actionText = `${action.playerName} folded`;
          break;
        case 'CHECK':
          actionText = `${action.playerName} checked`;
          break;
        case 'CALL':
          actionText = `${action.playerName} called ${action.amount}`;
          break;
        case 'BET':
          actionText = `${action.playerName} bet ${action.amount}`;
          break;
        case 'RAISE':
          actionText = `${action.playerName} raised to ${action.amount}`;
          break;
        case 'ALL_IN':
          actionText = `${action.playerName} is ALL IN!`;
          break;
      }
      
      const newMessage: GameMessage = {
        id: Math.random().toString(),
        type: 'action',
        message: actionText,
        timestamp: new Date()
      };
      
      setMessages(prev => [newMessage, ...prev].slice(0, 20));
      
      // Show toast for significant actions
      if (action.action === 'ALL_IN') {
        toast({
          title: 'All In!',
          description: actionText,
          variant: 'default'
        });
      }
    }
  }, [action, toast]);
  
  useEffect(() => {
    if (winner) {
      const winMessage: GameMessage = {
        id: Math.random().toString(),
        type: 'winner',
        message: `${winner.playerName} won ${winner.amount}!`,
        timestamp: new Date()
      };
      
      setMessages(prev => [winMessage, ...prev].slice(0, 20));
      
      toast({
        title: 'Winner!', 
        description: winMessage.message,
        variant: 'default'
      });
    }
  }, [winner, toast]);
  
  useEffect(() => {
    if (newPlayer) {
      const joinMessage: GameMessage = {
        id: Math.random().toString(),
        type: 'join',
        message: `${newPlayer.playerName} joined the table`,
        timestamp: new Date()
      };
      
      setMessages(prev => [joinMessage, ...prev].slice(0, 20));
    }
  }, [newPlayer]);
  
  useEffect(() => {
    if (leavingPlayer) {
      const leaveMessage: GameMessage = {
        id: Math.random().toString(),
        type: 'leave',
        message: `${leavingPlayer.playerName} left the table`,
        timestamp: new Date()
      };
      
      setMessages(prev => [leaveMessage, ...prev].slice(0, 20));
    }
  }, [leavingPlayer]);
  
  useEffect(() => {
    if (gamePhase && gamePhase !== 'WAITING') {
      const phaseMessage: GameMessage = {
        id: Math.random().toString(),
        type: 'notification',
        message: `New phase: ${gamePhase}`,
        timestamp: new Date()
      };
      
      setMessages(prev => [phaseMessage, ...prev].slice(0, 20));
    }
  }, [gamePhase]);

  return (
    <div className="bg-navy/30 border border-emerald/10 rounded-md p-3 h-60 overflow-y-auto">
      <h3 className="text-sm font-medium mb-2 text-gray-300">Game Messages</h3>
      <div className="space-y-1">
        {messages.length === 0 ? (
          <p className="text-xs text-gray-400 italic">No messages yet</p>
        ) : (
          messages.map(msg => (
            <div key={msg.id} className="text-xs flex items-start">
              <span className="text-gray-400 shrink-0">{msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}: </span>
              <div className="flex items-center">
                <span className={`ml-1
                  ${msg.type === 'action' ? 'text-gray-300' : ''}
                  ${msg.type === 'notification' ? 'text-blue-300 font-medium' : ''}
                  ${msg.type === 'winner' ? 'text-yellow-300 font-bold' : ''}
                  ${msg.type === 'join' ? 'text-green-300' : ''}
                  ${msg.type === 'leave' ? 'text-red-300' : ''}
                `}>
                  {msg.message}
                </span>
                
                {msg.type === 'winner' && (
                  <Badge variant="success" className="ml-1 animate-pulse">Winner!</Badge>
                )}
                
                {msg.type === 'notification' && (
                  <Badge variant="secondary" className="ml-1">{gamePhase}</Badge>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
