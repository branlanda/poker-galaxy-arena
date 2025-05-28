
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/stores/auth';
import { useToast } from '@/hooks/use-toast';
import { useLobby } from '@/stores/lobby';
import { LobbyTable } from '@/types/lobby';
import { useTranslation } from '@/hooks/useTranslation';

export function useJoinTable() {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { setTables } = useLobby();
  const { t } = useTranslation();

  const joinTable = async (table: LobbyTable, passwordAttempt?: string, buyInAmount?: number) => {
    if (!user) {
      toast({
        title: "Acceso Requerido",
        description: "Necesitas iniciar sesión para jugar",
        variant: "destructive",
      });
      navigate('/login');
      return false;
    }

    // Validar contraseña si es mesa privada
    if (table.is_private && !passwordAttempt) {
      toast({
        title: "Contraseña Requerida",
        description: "Esta mesa requiere contraseña para entrar",
        variant: "destructive",
      });
      return false;
    }

    if (table.is_private && table.password !== passwordAttempt) {
       toast({
         title: "Contraseña Incorrecta",
         description: "La contraseña ingresada no es correcta",
         variant: "destructive",
       });
       return false;
    }

    try {
      setLoading(true);

      // Verificar si ya está en la mesa
      const { data: existingEntry, error: existingEntryError } = await supabase
        .from('players_at_table')
        .select('*')
        .eq('player_id', user.id)
        .eq('table_id', table.id)
        .single();

      if (existingEntryError && existingEntryError.code !== 'PGRST116') {
        throw existingEntryError;
      }

      if (existingEntry) {
        toast({
          title: "¡Ya estás en la mesa!",
          description: "Redirigiendo al juego...",
        });
        navigate(`/game/${table.id}`);
        return true;
      }

      // Verificar capacidad de la mesa
      if (table.current_players >= table.max_players && user.id !== table.creator_id) {
        toast({
          title: "Mesa Llena",
          description: "Esta mesa ha alcanzado su capacidad máxima",
          variant: "destructive",
        });
        return false;
      }

      // Unirse a la mesa
      const { error } = await supabase
        .from('players_at_table')
        .insert({
          player_id: user.id,
          table_id: table.id,
          stack: buyInAmount || table.min_buy_in,
        });

      if (error) throw error;

      // Actualizar la lista de mesas optimísticamente
      setTables((prevTables: LobbyTable[]) =>
        prevTables.map((t) =>
          t.id === table.id ? { ...t, current_players: (t.current_players || 0) + 1 } : t
        )
      );

      toast({
        title: "¡Bienvenido a la mesa!",
        description: `Te has unido a "${table.name}" exitosamente`,
      });
      
      // Navegar al juego
      navigate(`/game/${table.id}`);
      return true;
    } catch (error: any) {
      console.error('Error joining table:', error);
      toast({
        title: "Error al Unirse",
        description: error.message || "No se pudo unir a la mesa. Intenta de nuevo.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    joinTable,
    loading,
  };
}
