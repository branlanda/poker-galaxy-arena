
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Eye, Share, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { DetailedHandHistory, SharedHand } from '@/types/handHistory';
import { HandReplayViewer } from '@/components/handHistory/HandReplayViewer';
import StarfallEffect from '@/components/effects/StarfallEffect';

export const SharedHandPage: React.FC = () => {
  const { shareCode } = useParams<{ shareCode: string }>();
  const [sharedHand, setSharedHand] = useState<SharedHand | null>(null);
  const [handData, setHandData] = useState<DetailedHandHistory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSharedHand = async () => {
      if (!shareCode) {
        setError('Código de compartir no válido');
        setLoading(false);
        return;
      }

      try {
        // Fetch shared hand info
        const { data: sharedHandData, error: sharedError } = await supabase
          .from('shared_hands')
          .select('*')
          .eq('share_code', shareCode)
          .single();

        if (sharedError) throw sharedError;

        // Check if expired
        if (sharedHandData.expires_at && new Date(sharedHandData.expires_at) < new Date()) {
          setError('Este enlace ha expirado');
          setLoading(false);
          return;
        }

        setSharedHand(sharedHandData);

        // Fetch actual hand data
        const { data: handHistoryData, error: handError } = await supabase
          .from('detailed_hand_history')
          .select('*')
          .eq('id', sharedHandData.hand_id)
          .single();

        if (handError) throw handError;

        setHandData(handHistoryData);

        // Increment view count
        await supabase
          .from('shared_hands')
          .update({ view_count: sharedHandData.view_count + 1 })
          .eq('id', sharedHandData.id);

      } catch (err: any) {
        console.error('Error fetching shared hand:', err);
        setError('No se pudo cargar la mano compartida');
      } finally {
        setLoading(false);
      }
    };

    fetchSharedHand();
  }, [shareCode]);

  if (loading) {
    return (
      <div className="min-h-screen bg-navy relative flex items-center justify-center">
        <StarfallEffect />
        <div className="text-white">Cargando mano compartida...</div>
      </div>
    );
  }

  if (error || !sharedHand || !handData) {
    return (
      <div className="min-h-screen bg-navy relative">
        <StarfallEffect />
        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="flex items-center justify-between mb-8">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <Link to="/" className="flex items-center">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al inicio
              </Link>
            </Button>
          </div>

          <Card className="bg-navy/70 border-red-400/20 max-w-md mx-auto">
            <CardContent className="p-8 text-center">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-400" />
              <h3 className="text-lg font-semibold text-white mb-2">Error</h3>
              <p className="text-gray-400">{error}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const formatResult = (result: number) => {
    if (result > 0) {
      return { text: `+Ξ${result.toFixed(2)}`, color: 'text-green-400' };
    } else if (result < 0) {
      return { text: `Ξ${result.toFixed(2)}`, color: 'text-red-400' };
    }
    return { text: 'Ξ0.00', color: 'text-gray-400' };
  };

  const result = formatResult(handData.player_result);

  return (
    <div className="min-h-screen bg-navy relative">
      <StarfallEffect />
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
            <Link to="/" className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al inicio
            </Link>
          </Button>
        </div>

        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <Card className="bg-navy/70 border-emerald/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl text-white">
                    {sharedHand.title || `${handData.table_name} - Mano #${handData.hand_number}`}
                  </CardTitle>
                  {sharedHand.description && (
                    <p className="text-gray-400 mt-2">{sharedHand.description}</p>
                  )}
                  <div className="flex items-center space-x-2 mt-3">
                    <Badge variant="outline" className="text-emerald border-emerald/30">
                      {handData.game_type.replace('_', ' ')}
                    </Badge>
                    <Badge variant="outline" className="text-blue-400 border-blue-400/30">
                      {handData.table_type}
                    </Badge>
                    <span className={`font-bold ${result.color}`}>{result.text}</span>
                  </div>
                </div>
                <div className="text-right text-sm text-gray-400">
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 mr-1" />
                    {sharedHand.view_count} visualizaciones
                  </div>
                  <div className="mt-1">
                    Compartido el {new Date(sharedHand.created_at).toLocaleDateString('es-ES')}
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Hand Replay */}
          <Card className="bg-navy/70 border-emerald/20">
            <CardHeader>
              <CardTitle className="text-white">Replay de la Mano</CardTitle>
            </CardHeader>
            <CardContent>
              <HandReplayViewer hand={handData} />
            </CardContent>
          </Card>

          {/* Hand Details */}
          <Card className="bg-navy/70 border-emerald/20">
            <CardHeader>
              <CardTitle className="text-white">Detalles de la Mano</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Fecha:</span>
                    <span className="text-white">
                      {new Date(handData.played_at).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Blinds:</span>
                    <span className="text-white">{handData.blinds}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Posición:</span>
                    <span className="text-white">{handData.player_position || 'N/A'}</span>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Bote Final:</span>
                    <span className="text-white">Ξ{handData.final_pot.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Resultado:</span>
                    <span className={result.color}>{result.text}</span>
                  </div>
                  {handData.hand_strength && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Jugada:</span>
                      <span className="text-white">
                        {handData.hand_strength.replace('_', ' ')}
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  {handData.hole_cards && handData.hole_cards.length > 0 && (
                    <div>
                      <span className="text-sm text-gray-400">Cartas del jugador:</span>
                      <div className="flex space-x-1 mt-1">
                        {handData.hole_cards.map((card: any, index: number) => (
                          <div
                            key={index}
                            className="w-8 h-10 bg-white rounded text-black text-xs flex items-center justify-center font-bold"
                          >
                            {card.value}
                            <span className={card.suit === 'hearts' || card.suit === 'diamonds' ? 'text-red-500' : 'text-black'}>
                              {card.suit === 'hearts' ? '♥' : card.suit === 'diamonds' ? '♦' : 
                               card.suit === 'clubs' ? '♣' : '♠'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
