
import React, { useState } from 'react';
import { Users, UserPlus, MessageCircle, Gamepad2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useFriends } from '@/hooks/useFriends';
import { useAuth } from '@/stores/auth';

export const FriendsDropdown: React.FC = () => {
  const { user } = useAuth();
  const { friends } = useFriends();
  const [showAddFriend, setShowAddFriend] = useState(false);
  
  if (!user) return null;

  // Create onlineFriends array from friends data
  const onlineFriends = friends.filter(friend => friend.is_online);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative hover:bg-slate-700/50">
          <Users className="h-5 w-5 text-gray-300" />
          
          {onlineFriends.length > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-emerald text-xs font-medium flex items-center justify-center text-black p-0">
              {onlineFriends.length > 9 ? '9+' : onlineFriends.length}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-72 bg-slate-800/95 backdrop-blur-sm border-emerald/20" 
        align="end" 
        forceMount
      >
        <DropdownMenuLabel className="text-white font-medium">
          Friends ({friends.length})
        </DropdownMenuLabel>
        
        <DropdownMenuItem 
          className="text-gray-300 hover:text-emerald hover:bg-emerald/10 cursor-pointer"
          onClick={() => setShowAddFriend(true)}
        >
          <UserPlus className="mr-2 h-4 w-4" />
          <span>Add Friend</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator className="bg-emerald/20" />
        
        {onlineFriends.length > 0 && (
          <>
            <DropdownMenuLabel className="text-emerald text-sm">
              Online ({onlineFriends.length})
            </DropdownMenuLabel>
            {onlineFriends.map((friend) => (
              <DropdownMenuItem 
                key={friend.friend_id} 
                className="text-gray-300 hover:text-white hover:bg-slate-700/50 cursor-pointer"
              >
                <div className="flex items-center space-x-3 w-full">
                  <div className="relative">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={friend.friend_avatar_url} alt={friend.friend_alias} />
                      <AvatarFallback className="bg-emerald/20 text-emerald text-xs">
                        {friend.friend_alias?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-emerald rounded-full border-2 border-slate-800"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{friend.friend_alias}</p>
                    <p className="text-xs text-gray-400">
                      {friend.current_table_id ? `Playing ${friend.current_game_type}` : 'Online'}
                    </p>
                  </div>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-emerald/10">
                      <MessageCircle className="h-3 w-3" />
                    </Button>
                    {friend.current_table_id && (
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-emerald/10">
                        <Gamepad2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator className="bg-emerald/20" />
          </>
        )}
        
        {friends.filter(f => !f.is_online).length > 0 && (
          <>
            <DropdownMenuLabel className="text-gray-400 text-sm">
              Offline ({friends.filter(f => !f.is_online).length})
            </DropdownMenuLabel>
            {friends.filter(f => !f.is_online).slice(0, 5).map((friend) => (
              <DropdownMenuItem 
                key={friend.friend_id} 
                className="text-gray-400 hover:text-gray-300 hover:bg-slate-700/30 cursor-pointer"
              >
                <div className="flex items-center space-x-3 w-full">
                  <Avatar className="h-8 w-8 opacity-60">
                    <AvatarImage src={friend.friend_avatar_url} alt={friend.friend_alias} />
                    <AvatarFallback className="bg-slate-700 text-gray-400 text-xs">
                      {friend.friend_alias?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{friend.friend_alias}</p>
                    <p className="text-xs text-gray-500">
                      Last seen {friend.last_seen}
                    </p>
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
          </>
        )}
        
        {friends.length === 0 && (
          <div className="p-4 text-center text-gray-400">
            <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No friends yet</p>
            <p className="text-xs">Add friends to see them here</p>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
