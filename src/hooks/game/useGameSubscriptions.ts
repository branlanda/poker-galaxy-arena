
import { useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { PlayerAtTable } from '@/types/lobby';

interface GameSubscriptionsProps {
  tableId?: string;
  userId?: string;
  isPlayerTurn: boolean;
  turnStartTime: number | null;
  setTurnStartTime: (time: number | null) => void;
  setTurnTimeRemaining: (time: number) => void;
  TURN_TIMEOUT_MS: number;
}

export function useGameSubscriptions({
  tableId,
  userId,
  isPlayerTurn,
  turnStartTime,
  setTurnStartTime,
  setTurnTimeRemaining,
  TURN_TIMEOUT_MS
}: GameSubscriptionsProps) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Set up real-time subscriptions for table data and players
  useEffect(() => {
    if (!tableId || !userId) return;
    
    // Set up real-time subscriptions
    const tableChannel = supabase
      .channel(`table:${tableId}`)
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'lobby_tables',
          filter: `id=eq.${tableId}`
        }, 
        (payload) => {
          // Check if table was closed
          if (payload.new.status === 'CLOSED') {
            toast({
              title: 'Table Closed',
              description: 'This table has been closed',
              variant: 'destructive',
            });
          }
        }
      )
      .subscribe();
      
    const playersChannel = supabase
      .channel(`players:${tableId}`)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'players_at_table',
          filter: `table_id=eq.${tableId}`
        }, 
        (payload) => {
          if (payload.eventType === 'INSERT') {
            // Notify that a new player joined
            if (payload.new.player_id !== userId) {
              toast({
                title: 'Player Joined',
                description: `A new player has joined the table`,
                variant: 'default',
              });
            }
          } 
          else if (payload.eventType === 'DELETE') {  
            // Notify that a player left
            if (payload.old.player_id !== userId) {
              toast({
                title: 'Player Left',
                description: `A player has left the table`,
                variant: 'default',
              });
            }
          }
        }
      )
      .subscribe();
      
    // Setup presence channel for player actions
    const gamePresenceChannel = supabase.channel(`presence:${tableId}`, {
      config: {
        presence: {
          key: userId,
        },
      },
    });

    // Track online users
    gamePresenceChannel
      .on('presence', { event: 'sync' }, () => {
        const state = gamePresenceChannel.presenceState();
        console.log('Online users:', state);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        if (key !== userId) {
          toast({
            title: 'Player joined',
            description: `Player ${newPresences[0]?.user_alias || key} joined the table`,
          });
        }
      })
      .on('presence', { event: 'leave' }, ({ key }) => {
        if (key !== userId) {
          toast({
            title: 'Player disconnected',
            description: `A player disconnected from the table`,
          });
        }
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await gamePresenceChannel.track({
            user_id: userId,
            user_alias: 'Player',
            online_at: new Date().toISOString(),
          });
        }
      });
      
    return () => {
      supabase.removeChannel(tableChannel);
      supabase.removeChannel(playersChannel);
      supabase.removeChannel(gamePresenceChannel);
    };
  }, [tableId, userId]);

  // Handle player turn timer
  useEffect(() => {
    if (isPlayerTurn) {
      setTurnStartTime(Date.now());
      setTurnTimeRemaining(TURN_TIMEOUT_MS);
      
      // Clear any existing timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      // Start the countdown timer
      timerRef.current = setInterval(() => {
        const elapsed = Date.now() - (turnStartTime || Date.now());
        const remaining = Math.max(0, TURN_TIMEOUT_MS - elapsed);
        setTurnTimeRemaining(remaining);
        
        if (remaining <= 0 && timerRef.current) {
          clearInterval(timerRef.current);
        }
      }, 100);
    } else {
      // Not player's turn, clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlayerTurn, turnStartTime, setTurnStartTime, setTurnTimeRemaining, TURN_TIMEOUT_MS]);
}
