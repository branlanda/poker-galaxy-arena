
import { useState, useEffect } from 'react';
import { useAuth } from '@/stores/auth';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export interface GameInvitation {
  id: string;
  sender_id: string;
  recipient_id: string;
  table_id?: string;
  tournament_id?: string;
  invitation_type: 'TABLE' | 'TOURNAMENT';
  message?: string;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'EXPIRED';
  expires_at: string;
  created_at: string;
  responded_at?: string;
  sender?: {
    alias: string;
    avatar_url?: string;
  };
  table?: {
    name: string;
  };
  tournament?: {
    name: string;
  };
}

export const useGameInvitations = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [receivedInvitations, setReceivedInvitations] = useState<GameInvitation[]>([]);
  const [sentInvitations, setSentInvitations] = useState<GameInvitation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInvitations = async () => {
    if (!user?.id) return;

    try {
      // Invitaciones recibidas
      const { data: received, error: receivedError } = await supabase
        .from('game_invitations')
        .select(`
          *,
          sender:profiles!game_invitations_sender_id_fkey(alias, avatar_url),
          table:lobby_tables(name),
          tournament:tournaments_new(name)
        `)
        .eq('recipient_id', user.id)
        .eq('status', 'PENDING')
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false });

      if (receivedError) throw receivedError;

      // Invitaciones enviadas
      const { data: sent, error: sentError } = await supabase
        .from('game_invitations')
        .select(`
          *,
          recipient:profiles!game_invitations_recipient_id_fkey(alias, avatar_url),
          table:lobby_tables(name),
          tournament:tournaments_new(name)
        `)
        .eq('sender_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (sentError) throw sentError;

      setReceivedInvitations(received || []);
      setSentInvitations(sent || []);
    } catch (error: any) {
      console.error('Error fetching invitations:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendInvitation = async (
    recipientId: string,
    type: 'TABLE' | 'TOURNAMENT',
    resourceId: string,
    message?: string
  ) => {
    if (!user?.id) return false;

    try {
      const invitationData = {
        sender_id: user.id,
        recipient_id: recipientId,
        invitation_type: type,
        message: message || null,
        ...(type === 'TABLE' ? { table_id: resourceId } : { tournament_id: resourceId })
      };

      const { error } = await supabase
        .from('game_invitations')
        .insert(invitationData);

      if (error) throw error;

      toast({
        title: 'Invitación enviada',
        description: `La invitación ${type === 'TABLE' ? 'a la mesa' : 'al torneo'} ha sido enviada.`,
      });

      fetchInvitations();
      return true;
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    }
  };

  const respondToInvitation = async (invitationId: string, accept: boolean) => {
    try {
      const { error } = await supabase
        .from('game_invitations')
        .update({
          status: accept ? 'ACCEPTED' : 'DECLINED',
          responded_at: new Date().toISOString()
        })
        .eq('id', invitationId);

      if (error) throw error;

      toast({
        title: accept ? 'Invitación aceptada' : 'Invitación rechazada',
        description: accept 
          ? 'Has aceptado la invitación al juego.'
          : 'Has rechazado la invitación.',
      });

      fetchInvitations();
      return true;
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchInvitations();
    }
  }, [user?.id]);

  // Suscribirse a nuevas invitaciones
  useEffect(() => {
    if (!user?.id) return;

    const subscription = supabase
      .channel('game-invitations')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'game_invitations',
          filter: `recipient_id=eq.${user.id}`
        },
        () => {
          fetchInvitations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [user?.id]);

  return {
    receivedInvitations,
    sentInvitations,
    loading,
    sendInvitation,
    respondToInvitation,
    refetch: fetchInvitations
  };
};
