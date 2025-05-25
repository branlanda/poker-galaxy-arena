
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  MoreVertical, 
  MessageCircle, 
  UserMinus, 
  GamepadIcon,
  Eye,
  Clock
} from 'lucide-react';
import { Friend, useFriends } from '@/hooks/useFriends';
import { useTranslation } from '@/hooks/useTranslation';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface FriendsListProps {
  friends: Friend[];
  loading: boolean;
}

export const FriendsList: React.FC<FriendsListProps> = ({ friends, loading }) => {
  const { t } = useTranslation();
  const { removeFriend } = useFriends();

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-3 p-3 rounded-lg border">
            <div className="w-10 h-10 bg-gray-300 rounded-full animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-300 rounded animate-pulse" />
              <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (friends.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 mb-2">
          {t('friends.noFriends', 'No tienes amigos aún')}
        </div>
        <p className="text-sm text-gray-500">
          {t('friends.noFriendsDesc', 'Busca jugadores y envíales solicitudes de amistad')}
        </p>
      </div>
    );
  }

  const onlineFriends = friends.filter(f => f.is_online);
  const offlineFriends = friends.filter(f => !f.is_online);

  const renderFriend = (friend: Friend) => (
    <div 
      key={friend.friend_id} 
      className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50/50 transition-colors"
    >
      <div className="flex items-center space-x-3">
        <div className="relative">
          <Avatar className="h-10 w-10">
            {friend.friend_avatar_url ? (
              <AvatarImage src={friend.friend_avatar_url} alt={friend.friend_alias} />
            ) : (
              <AvatarFallback>
                {friend.friend_alias?.slice(0, 2).toUpperCase() || 'U'}
              </AvatarFallback>
            )}
          </Avatar>
          <div 
            className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
              friend.is_online ? 'bg-green-500' : 'bg-gray-400'
            }`}
          />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-medium">{friend.friend_alias}</h4>
            {friend.is_online && (
              <Badge variant="secondary" className="text-xs">
                {t('friends.online', 'En línea')}
              </Badge>
            )}
          </div>
          
          <div className="text-sm text-gray-500">
            {friend.is_online ? (
              friend.current_game_type ? (
                <div className="flex items-center gap-1">
                  <GamepadIcon className="h-3 w-3" />
                  {t('friends.playing', 'Jugando')} {friend.current_game_type}
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  {t('friends.browsing', 'Navegando')}
                </div>
              )
            ) : (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatDistanceToNow(new Date(friend.last_seen), { 
                  addSuffix: true, 
                  locale: es 
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            {t('friends.message', 'Enviar mensaje')}
          </DropdownMenuItem>
          {friend.current_table_id && (
            <DropdownMenuItem className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              {t('friends.spectate', 'Espectador')}
            </DropdownMenuItem>
          )}
          <DropdownMenuItem 
            className="flex items-center gap-2 text-destructive"
            onClick={() => removeFriend(friend.friend_id)}
          >
            <UserMinus className="h-4 w-4" />
            {t('friends.remove', 'Eliminar amigo')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );

  return (
    <div className="space-y-4">
      {onlineFriends.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-green-600 mb-2 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            {t('friends.onlineNow', 'En línea ahora')} ({onlineFriends.length})
          </h3>
          <div className="space-y-2">
            {onlineFriends.map(renderFriend)}
          </div>
        </div>
      )}

      {offlineFriends.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
            <div className="w-2 h-2 bg-gray-400 rounded-full" />
            {t('friends.offline', 'Desconectados')} ({offlineFriends.length})
          </h3>
          <div className="space-y-2">
            {offlineFriends.map(renderFriend)}
          </div>
        </div>
      )}
    </div>
  );
};
