
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/stores/auth';
import { useToast } from '@/hooks/use-toast';

export interface Avatar {
  id: string;
  name: string;
  imageUrl: string;
  rarity: string;
  isNft: boolean;
  nftContractAddress?: string;
  nftTokenId?: string;
  unlockRequirement?: string;
  isOwned?: boolean;
  acquiredAt?: string;
}

export function useAvatarCollection() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAvatars = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);

      // Fetch all available avatars with ownership status
      const { data: avatarData, error } = await supabase
        .from('avatar_collection')
        .select(`
          *,
          player_avatars!left(
            player_id,
            acquired_at
          )
        `);

      if (error) throw error;

      const formattedAvatars = avatarData?.map(avatar => ({
        id: avatar.id,
        name: avatar.name,
        imageUrl: avatar.image_url,
        rarity: avatar.rarity,
        isNft: avatar.is_nft,
        nftContractAddress: avatar.nft_contract_address,
        nftTokenId: avatar.nft_token_id,
        unlockRequirement: avatar.unlock_requirement,
        isOwned: avatar.player_avatars?.some((pa: any) => pa.player_id === user.id),
        acquiredAt: avatar.player_avatars?.find((pa: any) => pa.player_id === user.id)?.acquired_at
      })) || [];

      setAvatars(formattedAvatars);

    } catch (error: any) {
      console.error('Error fetching avatars:', error);
      toast({
        title: 'Error',
        description: 'Failed to load avatar collection',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const selectAvatar = async (avatarId: string) => {
    if (!user?.id) return;

    try {
      // Add avatar to player's collection if not owned
      const avatar = avatars.find(a => a.id === avatarId);
      if (avatar && !avatar.isOwned) {
        const { error: insertError } = await supabase
          .from('player_avatars')
          .insert({
            player_id: user.id,
            avatar_id: avatarId
          });

        if (insertError) throw insertError;
      }

      // Update profile with selected avatar
      const selectedAvatar = avatars.find(a => a.id === avatarId);
      if (selectedAvatar) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ avatar_url: selectedAvatar.imageUrl })
          .eq('id', user.id);

        if (updateError) throw updateError;

        toast({
          title: 'Avatar Updated',
          description: 'Your avatar has been updated successfully',
        });

        // Refresh avatars to update ownership status
        fetchAvatars();
      }

    } catch (error: any) {
      console.error('Error selecting avatar:', error);
      toast({
        title: 'Error',
        description: 'Failed to update avatar',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchAvatars();
  }, [user?.id]);

  return {
    avatars,
    loading,
    selectAvatar,
    refetch: fetchAvatars
  };
}
