
import React from 'react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, 
  UserPlus, 
  MessageCircle, 
  GamepadIcon,
  Eye,
  Settings
} from 'lucide-react';
import { useFriends } from '@/hooks/useFriends';
import { useGameInvitations } from '@/hooks/useGameInvitations';
import { useTranslation } from '@/hooks/useTranslation';
import { Link } from 'react-router-dom';

export const FriendsDropdown = () => {
  const { t } = useTranslation();
  const { friends, friendRequests } = useFriends();
  const { receivedInvitations } = useGameInvitations();
  
  const onlineFriends = friends.filter(friend => friend.is_online);
  const totalNotifications = friendRequests.length + receivedInvitations.length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Users className="h-4 w-4" />
          {totalNotifications > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {totalNotifications > 9 ? '9+' : totalNotifications}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="p-3 border-b">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">{t('friends.title', 'Amigos')}</h3>
            <Link to="/profile?tab=friends">
              <Button variant="ghost" size="sm" className="h-6 px-2">
                <Settings className="h-3 w-3" />
              </Button>
            </Link>
          </div>
          {onlineFriends.length > 0 && (
            <p className="text-xs text-gray-500 mt-1">
              {onlineFriends.length} {t('friends.online', 'en línea')}
            </p>
          )}
        </div>

        {/* Notificaciones */}
        {totalNotifications > 0 && (
          <>
            {friendRequests.length > 0 && (
              <div className="p-2">
                <div className="text-xs font-medium text-gray-600 mb-2">
                  {t('friends.pendingRequests', 'Solicitudes pendientes')}
                </div>
                {friendRequests.slice(0, 3).map((request) => (
                  <div key={request.id} className="flex items-center gap-2 p-2 rounded hover:bg-gray-50">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={request.friend.avatar_url} />
                      <AvatarFallback className="text-xs">
                        {request.friend.alias?.slice(0, 1).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm flex-1">{request.friend.alias}</span>
                    <UserPlus className="h-3 w-3 text-emerald" />
                  </div>
                ))}
              </div>
            )}

            {receivedInvitations.length > 0 && (
              <div className="p-2">
                <div className="text-xs font-medium text-gray-600 mb-2">
                  {t('friends.gameInvitations', 'Invitaciones de juego')}
                </div>
                {receivedInvitations.slice(0, 3).map((invitation) => (
                  <div key={invitation.id} className="flex items-center gap-2 p-2 rounded hover:bg-gray-50">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={invitation.sender?.avatar_url} />
                      <AvatarFallback className="text-xs">
                        {invitation.sender?.alias?.slice(0, 1).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm flex-1">{invitation.sender?.alias}</span>
                    {invitation.invitation_type === 'TABLE' ? (
                      <GamepadIcon className="h-3 w-3 text-blue-500" />
                    ) : (
                      <GamepadIcon className="h-3 w-3 text-yellow-500" />
                    )}
                  </div>
                ))}
              </div>
            )}
            <DropdownMenuSeparator />
          </>
        )}

        {/* Amigos online */}
        {onlineFriends.length > 0 ? (
          <div className="max-h-48 overflow-y-auto">
            {onlineFriends.slice(0, 8).map((friend) => (
              <DropdownMenuItem key={friend.friend_id} className="p-3">
                <div className="flex items-center space-x-2 w-full">
                  <div className="relative">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={friend.friend_avatar_url} />
                      <AvatarFallback className="text-xs">
                        {friend.friend_alias?.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border border-white" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{friend.friend_alias}</p>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      {friend.current_game_type ? (
                        <>
                          <GamepadIcon className="h-3 w-3" />
                          <span className="truncate">{friend.current_game_type}</span>
                        </>
                      ) : (
                        <>
                          <Eye className="h-3 w-3" />
                          <span>{t('friends.browsing', 'Navegando')}</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <MessageCircle className="h-3 w-3" />
                  </Button>
                </div>
              </DropdownMenuItem>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500">
            <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">{t('friends.noOnlineFriends', 'No hay amigos en línea')}</p>
          </div>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/profile?tab=friends" className="w-full">
            <Users className="h-4 w-4 mr-2" />
            {t('friends.viewAll', 'Ver todos los amigos')}
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
