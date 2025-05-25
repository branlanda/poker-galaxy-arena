
import { useState, useEffect } from 'react';
import { useAuth } from '@/stores/auth';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export interface Friend {
  friend_id: string;
  friend_alias: string;
  friend_avatar_url?: string;
  is_online: boolean;
  current_table_id?: string;
  current_game_type?: string;
  last_seen: string;
  friendship_status: string;
  became_friends_at: string;
}

export interface FriendRequest {
  id: string;
  user_id: string;
  friend_id: string;
  status: string;
  created_at: string;
  updated_at: string;
  friend: {
    user_id: string;
    alias: string;
    avatar_url?: string;
  };
}

export const useFriends = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [sentRequests, setSentRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFriends = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase.rpc('get_friends_with_status', {
        p_user_id: user.id
      });

      if (error) throw error;
      setFriends(data || []);
    } catch (error: any) {
      console.error('Error fetching friends:', error);
    }
  };

  const fetchFriendRequests = async () => {
    if (!user?.id) return;

    try {
      // Solicitudes recibidas
      const { data: received, error: receivedError } = await supabase
        .from('friends')
        .select(`
          *,
          friend:profiles!friends_user_id_fkey(user_id, alias, avatar_url)
        `)
        .eq('friend_id', user.id)
        .eq('status', 'PENDING');

      if (receivedError) throw receivedError;

      // Solicitudes enviadas
      const { data: sent, error: sentError } = await supabase
        .from('friends')
        .select(`
          *,
          friend:profiles!friends_friend_id_fkey(user_id, alias, avatar_url)
        `)
        .eq('user_id', user.id)
        .eq('status', 'PENDING');

      if (sentError) throw sentError;

      setFriendRequests(received || []);
      setSentRequests(sent || []);
    } catch (error: any) {
      console.error('Error fetching friend requests:', error);
    }
  };

  const sendFriendRequest = async (friendId: string) => {
    if (!user?.id) return false;

    try {
      const { error } = await supabase
        .from('friends')
        .insert({
          user_id: user.id,
          friend_id: friendId,
          status: 'PENDING'
        });

      if (error) throw error;

      toast({
        title: 'Solicitud enviada',
        description: 'La solicitud de amistad ha sido enviada correctamente.',
      });

      fetchFriendRequests();
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

  const acceptFriendRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('friends')
        .update({ 
          status: 'ACCEPTED',
          updated_at: new Date().toISOString()
        })
        .eq('id', requestId);

      if (error) throw error;

      toast({
        title: 'Amistad aceptada',
        description: 'Has aceptado la solicitud de amistad.',
      });

      fetchFriends();
      fetchFriendRequests();
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

  const rejectFriendRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('friends')
        .update({ 
          status: 'REJECTED',
          updated_at: new Date().toISOString()
        })
        .eq('id', requestId);

      if (error) throw error;

      toast({
        title: 'Solicitud rechazada',
        description: 'Has rechazado la solicitud de amistad.',
      });

      fetchFriendRequests();
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

  const removeFriend = async (friendId: string) => {
    if (!user?.id) return false;

    try {
      const { error } = await supabase
        .from('friends')
        .delete()
        .or(`and(user_id.eq.${user.id},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${user.id})`);

      if (error) throw error;

      toast({
        title: 'Amigo eliminado',
        description: 'El amigo ha sido eliminado de tu lista.',
      });

      fetchFriends();
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
      Promise.all([fetchFriends(), fetchFriendRequests()]).finally(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [user?.id]);

  // Suscribirse a cambios en tiempo real
  useEffect(() => {
    if (!user?.id) return;

    const friendsSubscription = supabase
      .channel('friends-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'friends',
          filter: `user_id=eq.${user.id},friend_id=eq.${user.id}`
        },
        () => {
          fetchFriends();
          fetchFriendRequests();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_presence'
        },
        () => {
          fetchFriends();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(friendsSubscription);
    };
  }, [user?.id]);

  return {
    friends,
    friendRequests,
    sentRequests,
    loading,
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    removeFriend,
    refetch: () => {
      fetchFriends();
      fetchFriendRequests();
    }
  };
};
