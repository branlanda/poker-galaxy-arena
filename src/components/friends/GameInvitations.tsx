
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, Clock, GamepadIcon, Trophy } from 'lucide-react';
import { useGameInvitations } from '@/hooks/useGameInvitations';
import { useTranslation } from '@/hooks/useTranslation';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

export const GameInvitations = () => {
  const { t } = useTranslation();
  const { receivedInvitations, loading, respondToInvitation } = useGameInvitations();

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="p-4 rounded-lg border animate-pulse">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-gray-300 rounded-full" />
              <div className="flex-1">
                <div className="h-4 bg-gray-300 rounded mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
            <div className="flex gap-2">
              <div className="h-8 w-16 bg-gray-300 rounded" />
              <div className="h-8 w-16 bg-gray-300 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (receivedInvitations.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 mb-2">
          {t('friends.noInvitations', 'No hay invitaciones pendientes')}
        </div>
        <p className="text-sm text-gray-500">
          {t('friends.noInvitationsDesc', 'Las invitaciones a juegos aparecerán aquí')}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {receivedInvitations.map((invitation) => (
        <div 
          key={invitation.id} 
          className="p-4 rounded-lg border hover:bg-gray-50/50 transition-colors"
        >
          <div className="flex items-start space-x-3 mb-3">
            <Avatar className="h-10 w-10">
              {invitation.sender?.avatar_url ? (
                <AvatarImage src={invitation.sender.avatar_url} alt={invitation.sender.alias} />
              ) : (
                <AvatarFallback>
                  {invitation.sender?.alias?.slice(0, 2).toUpperCase() || 'U'}
                </AvatarFallback>
              )}
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                {invitation.invitation_type === 'TABLE' ? (
                  <GamepadIcon className="h-4 w-4 text-blue-500" />
                ) : (
                  <Trophy className="h-4 w-4 text-yellow-500" />
                )}
                <Badge variant={invitation.invitation_type === 'TABLE' ? 'default' : 'secondary'}>
                  {invitation.invitation_type === 'TABLE' ? 'Mesa' : 'Torneo'}
                </Badge>
              </div>
              
              <h4 className="font-medium">
                {invitation.sender?.alias} te invitó a{' '}
                {invitation.invitation_type === 'TABLE' 
                  ? invitation.table?.name || 'una mesa'
                  : invitation.tournament?.name || 'un torneo'
                }
              </h4>
              
              {invitation.message && (
                <p className="text-sm text-gray-600 mt-1">
                  "{invitation.message}"
                </p>
              )}
              
              <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                <Clock className="h-3 w-3" />
                {formatDistanceToNow(new Date(invitation.created_at), { 
                  addSuffix: true, 
                  locale: es 
                })}
                <span>•</span>
                <span>
                  Expira {formatDistanceToNow(new Date(invitation.expires_at), { 
                    addSuffix: true, 
                    locale: es 
                  })}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              className="flex items-center gap-2"
              onClick={() => respondToInvitation(invitation.id, true)}
            >
              <Check className="h-4 w-4" />
              {t('friends.accept', 'Aceptar')}
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => respondToInvitation(invitation.id, false)}
            >
              <X className="h-4 w-4" />
              {t('friends.decline', 'Rechazar')}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};
