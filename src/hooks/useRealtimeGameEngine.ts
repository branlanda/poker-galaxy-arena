
import { useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/stores/auth';
import { toast } from '@/hooks/use-toast';

interface GameUpdate {
  gameState: any;
  recentActions: any[];
  updateType: string;
}

interface UseRealtimeGameEngineProps {
  tableId: string;
  onGameUpdate: (update: GameUpdate) => void;
  onPlayerAction?: (action: any) => void;
  onConnectionChange?: (connected: boolean) => void;
}

export function useRealtimeGameEngine({
  tableId,
  onGameUpdate,
  onPlayerAction,
  onConnectionChange
}: UseRealtimeGameEngineProps) {
  const { user } = useAuth();
  const channelRef = useRef<any>(null);
  const connectionRef = useRef<boolean>(false);

  // Connect to realtime channel
  const connect = useCallback(() => {
    if (!tableId || channelRef.current) return;

    console.log(`Connecting to realtime channel for table ${tableId}`);

    const channel = supabase.channel(`table:${tableId}`, {
      config: {
        broadcast: { self: false },
        presence: { key: user?.id }
      }
    });

    // Listen for game updates
    channel.on('broadcast', { event: 'game_update' }, (payload) => {
      console.log('Received game update:', payload);
      onGameUpdate(payload.payload);
    });

    // Listen for player actions
    channel.on('broadcast', { event: 'player_action' }, (payload) => {
      console.log('Received player action:', payload);
      onPlayerAction?.(payload.payload);
    });

    // Handle presence events (player join/leave)
    channel.on('presence', { event: 'sync' }, () => {
      const state = channel.presenceState();
      console.log('Presence sync:', state);
    });

    channel.on('presence', { event: 'join' }, ({ key, newPresences }) => {
      console.log('Player joined:', key, newPresences);
      toast({
        title: 'Player Joined',
        description: 'A player has joined the table',
        duration: 3000,
      });
    });

    channel.on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
      console.log('Player left:', key, leftPresences);
      toast({
        title: 'Player Left',
        description: 'A player has left the table',
        duration: 3000,
      });
    });

    // Subscribe to channel
    channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        console.log('Successfully connected to realtime channel');
        connectionRef.current = true;
        onConnectionChange?.(true);

        // Track presence
        if (user?.id) {
          await channel.track({
            user_id: user.id,
            online_at: new Date().toISOString(),
          });
        }
      } else if (status === 'CHANNEL_ERROR') {
        console.error('Channel subscription error');
        connectionRef.current = false;
        onConnectionChange?.(false);
      } else if (status === 'TIMED_OUT') {
        console.error('Channel subscription timed out');
        connectionRef.current = false;
        onConnectionChange?.(false);
      } else if (status === 'CLOSED') {
        console.log('Channel closed');
        connectionRef.current = false;
        onConnectionChange?.(false);
      }
    });

    channelRef.current = channel;
  }, [tableId, user?.id, onGameUpdate, onPlayerAction, onConnectionChange]);

  // Disconnect from channel
  const disconnect = useCallback(() => {
    if (channelRef.current) {
      console.log('Disconnecting from realtime channel');
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
      connectionRef.current = false;
      onConnectionChange?.(false);
    }
  }, [onConnectionChange]);

  // Send action to poker engine
  const sendAction = useCallback(async (action: string, amount?: number) => {
    if (!user?.id || !tableId) {
      throw new Error('User not authenticated or table ID missing');
    }

    try {
      console.log(`Sending action ${action} to poker engine`);
      
      const { data, error } = await supabase.functions.invoke('poker-engine', {
        body: {
          tableId,
          playerId: user.id,
          action,
          amount
        }
      });

      if (error) {
        throw error;
      }

      if (!data.success) {
        throw new Error(data.error || 'Action failed');
      }

      return data;
    } catch (error: any) {
      console.error('Error sending action:', error);
      toast({
        title: 'Action Failed',
        description: error.message || 'Failed to process action',
        variant: 'destructive',
      });
      throw error;
    }
  }, [user?.id, tableId]);

  // Start new hand
  const startNewHand = useCallback(async () => {
    return sendAction('START_HAND');
  }, [sendAction]);

  // Auto-connect on mount
  useEffect(() => {
    connect();
    return disconnect;
  }, [connect, disconnect]);

  // Reconnect on connection loss
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && !connectionRef.current) {
        console.log('Page became visible, reconnecting...');
        setTimeout(connect, 1000);
      }
    };

    const handleOnline = () => {
      if (!connectionRef.current) {
        console.log('Network came online, reconnecting...');
        setTimeout(connect, 1000);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('online', handleOnline);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('online', handleOnline);
    };
  }, [connect]);

  return {
    connect,
    disconnect,
    sendAction,
    startNewHand,
    isConnected: connectionRef.current
  };
}
