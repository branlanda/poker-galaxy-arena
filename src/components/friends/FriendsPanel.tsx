
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Users, UserPlus, Mail, MessageCircle } from 'lucide-react';
import { useFriends } from '@/hooks/useFriends';
import { useGameInvitations } from '@/hooks/useGameInvitations';
import { FriendsList } from './FriendsList';
import { FriendRequests } from './FriendRequests';
import { FriendSearch } from './FriendSearch';
import { GameInvitations } from './GameInvitations';
import { useTranslation } from '@/hooks/useTranslation';

export const FriendsPanel = () => {
  const { t } = useTranslation();
  const { friends, friendRequests, loading } = useFriends();
  const { receivedInvitations } = useGameInvitations();
  const [activeTab, setActiveTab] = useState('friends');

  const onlineFriends = friends.filter(friend => friend.is_online);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          {t('friends.title', 'Amigos')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="friends" className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {t('friends.friends', 'Amigos')}
              {onlineFriends.length > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 px-1">
                  {onlineFriends.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="requests" className="flex items-center gap-1">
              <UserPlus className="h-4 w-4" />
              {t('friends.requests', 'Solicitudes')}
              {friendRequests.length > 0 && (
                <Badge variant="destructive" className="ml-1 h-5 px-1">
                  {friendRequests.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="search" className="flex items-center gap-1">
              <UserPlus className="h-4 w-4" />
              {t('friends.search', 'Buscar')}
            </TabsTrigger>
            <TabsTrigger value="invitations" className="flex items-center gap-1">
              <Mail className="h-4 w-4" />
              {t('friends.invitations', 'Invitaciones')}
              {receivedInvitations.length > 0 && (
                <Badge variant="destructive" className="ml-1 h-5 px-1">
                  {receivedInvitations.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="friends" className="mt-4">
            <FriendsList friends={friends} loading={loading} />
          </TabsContent>

          <TabsContent value="requests" className="mt-4">
            <FriendRequests requests={friendRequests} loading={loading} />
          </TabsContent>

          <TabsContent value="search" className="mt-4">
            <FriendSearch />
          </TabsContent>

          <TabsContent value="invitations" className="mt-4">
            <GameInvitations />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
