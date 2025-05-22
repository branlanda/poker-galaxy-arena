
import React, { useEffect, useState } from 'react';
import { PlayerAction } from '@/types/lobby';
import { useToast } from '@/hooks/use-toast';

interface GameMessage {
  id: string;
  type: 'action' | 'notification' | 'winner' | 'join';
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
  gamePhase?: string;
}

export const GameMessages: React.FC<GameMessagesProps> = ({
  playerName,
  action,
  winner,
  newPlayer,
  gamePhase
}) => {
  const [messages, setMessages] = useState<GameMessage[]>([]);
  const { toast } = useToast();
  
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
      
      const newMessage = {
        id: Math.random().toString(),
        type: 'action',
        message: actionText,
        timestamp: new Date()
      };
      
      setMessages(prev => [newMessage, ...prev].slice(0, 10));
      
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
      const winMessage = {
        id: Math.random().toString(),
        type: 'winner',
        message: `${winner.playerName} won ${winner.amount}!`,
        timestamp: new Date()
      };
      
      setMessages(prev => [winMessage, ...prev].slice(0, 10));
      
      toast({
        title: 'Winner!', 
        description: winMessage.message,
        variant: 'default'
      });
    }
  }, [winner, toast]);
  
  useEffect(() => {
    if (newPlayer) {
      const joinMessage = {
        id: Math.random().toString(),
        type: 'join',
        message: `${newPlayer.playerName} joined the table`,
        timestamp: new Date()
      };
      
      setMessages(prev => [joinMessage, ...prev].slice(0, 10));
    }
  }, [newPlayer]);
  
  useEffect(() => {
    if (gamePhase && gamePhase !== 'WAITING') {
      const phaseMessage = {
        id: Math.random().toString(),
        type: 'notification',
        message: `--- ${gamePhase} ---`,
        timestamp: new Date()
      };
      
      setMessages(prev => [phaseMessage, ...prev].slice(0, 10));
    }
  }, [gamePhase]);

  return (
    <div className="bg-navy/30 border border-emerald/10 rounded-md p-3 max-h-40 overflow-y-auto">
      <h3 className="text-sm font-medium mb-2 text-gray-300">Game Messages</h3>
      <div className="space-y-1">
        {messages.length === 0 ? (
          <p className="text-xs text-gray-400 italic">No messages yet</p>
        ) : (
          messages.map(msg => (
            <div key={msg.id} className="text-xs">
              <span className="text-gray-400">{msg.timestamp.toLocaleTimeString()}: </span>
              <span className={`
                ${msg.type === 'action' ? 'text-gray-300' : ''}
                ${msg.type === 'notification' ? 'text-blue-300 font-medium' : ''}
                ${msg.type === 'winner' ? 'text-yellow-300 font-bold' : ''}
                ${msg.type === 'join' ? 'text-green-300' : ''}
              `}>
                {msg.message}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
