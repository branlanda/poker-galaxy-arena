
import React, { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserPlus, Search, User } from 'lucide-react';
import { useAuth } from '@/stores/auth';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface FriendData {
  id: string;
  friend: {
    user_id: string;
    alias: string;
    avatar_url?: string;
  };
  status: string;
}

interface FriendsSectionProps {
  friends: FriendData[];
  loading?: boolean;
  onRefresh: () => void;
}

export const FriendsSection: React.FC<FriendsSectionProps> = ({
  friends,
  loading = false,
  onRefresh,
}) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  const searchUsers = async () => {
    if (searchTerm.length < 3) {
      toast({
        title: t('errors.invalidSearch'),
        description: t('errors.searchMinLength'),
        variant: 'destructive',
      });
      return;
    }

    try {
      setSearching(true);
      const { data, error } = await supabase
        .from('players')
        .select('user_id, alias, avatar_url')
        .ilike('alias', `%${searchTerm}%`)
        .neq('user_id', user?.id)
        .limit(5);

      if (error) throw error;
      setSearchResults(data || []);
    } catch (error: any) {
      toast({
        title: t('errors.searchFailed'),
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setSearching(false);
    }
  };

  const sendFriendRequest = async (friendId: string) => {
    if (!user) return;
    
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
        title: t('profile.friendRequestSent'),
        description: t('profile.checkNotifications'),
      });

      setSearchResults([]);
      setSearchTerm("");
      onRefresh();
    } catch (error: any) {
      toast({
        title: t('errors.requestFailed'),
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-10 w-full bg-navy/70 rounded-md animate-pulse"></div>
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-navy/70 rounded-md animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name?.substring(0, 2).toUpperCase() || 'U';
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder={t('profile.searchPlayers')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow"
        />
        <Button 
          onClick={searchUsers}
          variant="outline" 
          loading={searching}
        >
          <Search className="h-4 w-4 mr-2" />
          {t('search')}
        </Button>
      </div>
      
      {searchResults.length > 0 && (
        <div className="border border-emerald/10 rounded-md overflow-hidden">
          <div className="bg-navy/30 px-4 py-2 text-sm text-emerald">
            {t('profile.searchResults')}
          </div>
          <div className="divide-y divide-emerald/10">
            {searchResults.map((player) => (
              <div 
                key={player.user_id}
                className="flex items-center justify-between p-3"
              >
                <div className="flex items-center">
                  <Avatar className="h-9 w-9 mr-2">
                    {player.avatar_url ? (
                      <AvatarImage src={player.avatar_url} alt={player.alias} />
                    ) : (
                      <AvatarFallback className="bg-navy/50 text-emerald">
                        {getInitials(player.alias)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <span className="font-medium">{player.alias}</span>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => sendFriendRequest(player.user_id)}
                >
                  <UserPlus className="h-4 w-4 mr-1" />
                  {t('profile.addFriend')}
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="border border-emerald/10 rounded-md overflow-hidden">
        <div className="bg-navy/30 px-4 py-2 flex justify-between items-center">
          <span className="text-sm text-emerald">{t('profile.friendsList')}</span>
          <span className="text-xs text-gray-400">{friends.length} {t('profile.friends')}</span>
        </div>
        
        {friends.length === 0 ? (
          <div className="p-8 text-center">
            <User size={40} className="mx-auto text-gray-500 mb-3" />
            <p className="text-gray-400">{t('profile.noFriends')}</p>
            <p className="text-xs text-gray-500 mt-2">{t('profile.searchToAdd')}</p>
          </div>
        ) : (
          <div className="divide-y divide-emerald/10">
            {friends.map((friend) => (
              <div 
                key={friend.id}
                className="flex items-center p-3"
              >
                <Avatar className="h-10 w-10 mr-3">
                  {friend.friend.avatar_url ? (
                    <AvatarImage src={friend.friend.avatar_url} alt={friend.friend.alias} />
                  ) : (
                    <AvatarFallback className="bg-navy/50 text-emerald">
                      {getInitials(friend.friend.alias)}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <div className="font-medium">{friend.friend.alias}</div>
                  <div className="text-xs text-gray-400">
                    {t('profile.friendSince', {
                      date: new Date().toLocaleDateString()
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
