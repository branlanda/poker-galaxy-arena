
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import { FriendRequest, useFriends } from '@/hooks/useFriends';
import { useTranslation } from '@/hooks/useTranslation';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface FriendRequestsProps {
  requests: FriendRequest[];
  loading: boolean;
}

export const FriendRequests: React.FC<FriendRequestsProps> = ({ requests, loading }) => {
  const { t } = useTranslation();
  const { acceptFriendRequest, rejectFriendRequest } = useFriends();

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-300 rounded-full animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded animate-pulse w-24" />
                <div className="h-3 bg-gray-200 rounded animate-pulse w-16" />
              </div>
            </div>
            <div className="flex gap-2">
              <div className="h-8 w-8 bg-gray-300 rounded animate-pulse" />
              <div className="h-8 w-8 bg-gray-300 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 mb-2">
          {t('friends.noRequests', 'No hay solicitudes pendientes')}
        </div>
        <p className="text-sm text-gray-500">
          {t('friends.noRequestsDesc', 'Las nuevas solicitudes aparecerán aquí')}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {requests.map((request) => (
        <div 
          key={request.id} 
          className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50/50 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              {request.friend.avatar_url ? (
                <AvatarImage src={request.friend.avatar_url} alt={request.friend.alias} />
              ) : (
                <AvatarFallback>
                  {request.friend.alias?.slice(0, 2).toUpperCase() || 'U'}
                </AvatarFallback>
              )}
            </Avatar>
            
            <div>
              <h4 className="font-medium">{request.friend.alias}</h4>
              <p className="text-sm text-gray-500">
                {formatDistanceToNow(new Date(request.created_at), { 
                  addSuffix: true, 
                  locale: es 
                })}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="h-8 w-8 p-0 text-green-600 hover:bg-green-50 hover:text-green-700"
              onClick={() => acceptFriendRequest(request.id)}
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={() => rejectFriendRequest(request.id)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};
