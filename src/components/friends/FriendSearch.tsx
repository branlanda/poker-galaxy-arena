
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, UserPlus } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/stores/auth';
import { useFriends } from '@/hooks/useFriends';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';

interface SearchResult {
  id: string;
  alias: string;
  avatar_url?: string;
}

export const FriendSearch = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { sendFriendRequest } = useFriends();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm.trim() || searchTerm.length < 3) {
      toast({
        title: t('errors.invalidSearch', 'Búsqueda inválida'),
        description: t('errors.minSearchLength', 'Ingresa al menos 3 caracteres'),
        variant: 'destructive',
      });
      return;
    }

    setSearching(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, alias, avatar_url')
        .ilike('alias', `%${searchTerm}%`)
        .neq('id', user?.id)
        .limit(10);

      if (error) throw error;

      // Filtrar usuarios que ya son amigos o tienen solicitudes pendientes
      const { data: existingRelations } = await supabase
        .from('friends')
        .select('friend_id, user_id')
        .or(`user_id.eq.${user?.id},friend_id.eq.${user?.id}`);

      const relatedUserIds = new Set(
        existingRelations?.flatMap(rel => [rel.friend_id, rel.user_id]) || []
      );

      const filteredResults = data?.filter(result => !relatedUserIds.has(result.id)) || [];
      setSearchResults(filteredResults);
    } catch (error: any) {
      toast({
        title: t('errors.searchFailed', 'Error en la búsqueda'),
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setSearching(false);
    }
  };

  const handleSendRequest = async (userId: string) => {
    const success = await sendFriendRequest(userId);
    if (success) {
      // Remover de los resultados de búsqueda
      setSearchResults(prev => prev.filter(result => result.id !== userId));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder={t('friends.searchPlaceholder', 'Buscar por nickname...')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          className="flex-1"
        />
        <Button 
          onClick={handleSearch}
          disabled={searching}
          className="px-3"
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>

      {searchResults.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-600">
            {t('friends.searchResults', 'Resultados de búsqueda')}
          </h3>
          {searchResults.map((result) => (
            <div 
              key={result.id} 
              className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50/50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  {result.avatar_url ? (
                    <AvatarImage src={result.avatar_url} alt={result.alias} />
                  ) : (
                    <AvatarFallback>
                      {result.alias?.slice(0, 2).toUpperCase() || 'U'}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <h4 className="font-medium">{result.alias}</h4>
                </div>
              </div>

              <Button
                size="sm"
                variant="outline"
                onClick={() => handleSendRequest(result.id)}
                className="flex items-center gap-2"
              >
                <UserPlus className="h-4 w-4" />
                {t('friends.sendRequest', 'Enviar solicitud')}
              </Button>
            </div>
          ))}
        </div>
      )}

      {searching && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald mx-auto"></div>
          <p className="text-sm text-gray-500 mt-2">
            {t('friends.searching', 'Buscando...')}
          </p>
        </div>
      )}
    </div>
  );
};
