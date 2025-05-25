
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DetailedHandHistory } from '@/types/handHistory';
import { 
  Play, 
  Share, 
  Flag, 
  BarChart3, 
  Users, 
  Coins, 
  Clock,
  Copy,
  MessageSquare
} from 'lucide-react';
import { HandReplayViewer } from './HandReplayViewer';
import { HandAnalysisPanel } from './HandAnalysisPanel';
import { ShareHandDialog } from './ShareHandDialog';
import { ReportHandDialog } from './ReportHandDialog';

interface HandDetailDialogProps {
  hand: DetailedHandHistory;
  open: boolean;
  onClose: () => void;
}

export const HandDetailDialog: React.FC<HandDetailDialogProps> = ({
  hand,
  open,
  onClose
}) => {
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const formatResult = (result: number) => {
    if (result > 0) {
      return { text: `+Ξ${result.toFixed(2)}`, color: 'text-green-400' };
    } else if (result < 0) {
      return { text: `Ξ${result.toFixed(2)}`, color: 'text-red-400' };
    }
    return { text: 'Ξ0.00', color: 'text-gray-400' };
  };

  const result = formatResult(hand.player_result);

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-auto bg-navy border-emerald/20">
          <DialogHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-2xl text-white">
                  {hand.table_name} - Mano #{hand.hand_number}
                </DialogTitle>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge variant="outline" className="text-emerald border-emerald/30">
                    {hand.game_type.replace('_', ' ')}
                  </Badge>
                  <Badge variant="outline" className="text-blue-400 border-blue-400/30">
                    {hand.table_type}
                  </Badge>
                  <span className={`font-bold ${result.color}`}>{result.text}</span>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowShareDialog(true)}
                  className="border-emerald/20 text-white hover:bg-emerald/10"
                >
                  <Share className="h-4 w-4 mr-1" />
                  Compartir
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowReportDialog(true)}
                  className="border-red-400/20 text-red-400 hover:bg-red-400/10"
                >
                  <Flag className="h-4 w-4 mr-1" />
                  Reportar
                </Button>
              </div>
            </div>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-navy/50">
              <TabsTrigger value="overview" className="text-white">
                <BarChart3 className="h-4 w-4 mr-2" />
                Resumen
              </TabsTrigger>
              <TabsTrigger value="replay" className="text-white">
                <Play className="h-4 w-4 mr-2" />
                Replay
              </TabsTrigger>
              <TabsTrigger value="analysis" className="text-white">
                <MessageSquare className="h-4 w-4 mr-2" />
                Análisis
              </TabsTrigger>
              <TabsTrigger value="details" className="text-white">
                <Users className="h-4 w-4 mr-2" />
                Detalles
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-navy/50 p-4 rounded-lg">
                  <h3 className="text-white font-semibold mb-2">Información General</h3>
                  <div className="space-y-2 text-sm text-gray-400">
                    <div className="flex justify-between">
                      <span>Fecha:</span>
                      <span className="text-white">
                        {new Date(hand.played_at).toLocaleDateString('es-ES')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Hora:</span>
                      <span className="text-white">
                        {new Date(hand.played_at).toLocaleTimeString('es-ES')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Blinds:</span>
                      <span className="text-white">{hand.blinds}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Posición:</span>
                      <span className="text-white">{hand.player_position || 'N/A'}</span>
                    </div>
                    {hand.duration_seconds && (
                      <div className="flex justify-between">
                        <span>Duración:</span>
                        <span className="text-white">
                          {Math.floor(hand.duration_seconds / 60)}:
                          {(hand.duration_seconds % 60).toString().padStart(2, '0')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-navy/50 p-4 rounded-lg">
                  <h3 className="text-white font-semibold mb-2">Resultado</h3>
                  <div className="space-y-2 text-sm text-gray-400">
                    <div className="flex justify-between">
                      <span>Bote Final:</span>
                      <span className="text-white">Ξ{hand.final_pot.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tu Resultado:</span>
                      <span className={result.color}>{result.text}</span>
                    </div>
                    {hand.hand_strength && (
                      <div className="flex justify-between">
                        <span>Jugada:</span>
                        <span className="text-white">
                          {hand.hand_strength.replace('_', ' ')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-navy/50 p-4 rounded-lg">
                  <h3 className="text-white font-semibold mb-2">Cartas</h3>
                  <div className="space-y-3">
                    {hand.hole_cards && hand.hole_cards.length > 0 && (
                      <div>
                        <span className="text-sm text-gray-400">Tus cartas:</span>
                        <div className="flex space-x-1 mt-1">
                          {hand.hole_cards.map((card, index) => (
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
              </div>
            </TabsContent>

            <TabsContent value="replay" className="mt-6">
              <HandReplayViewer hand={hand} />
            </TabsContent>

            <TabsContent value="analysis" className="mt-6">
              <HandAnalysisPanel handId={hand.id} />
            </TabsContent>

            <TabsContent value="details" className="mt-6">
              <div className="space-y-4">
                <h3 className="text-white font-semibold">Acciones por Ronda</h3>
                {hand.betting_rounds.map((round, index) => (
                  <div key={index} className="bg-navy/50 p-4 rounded-lg">
                    <h4 className="text-emerald font-semibold mb-2">{round.round}</h4>
                    <div className="space-y-2">
                      {round.actions.map((action, actionIndex) => (
                        <div key={actionIndex} className="flex justify-between text-sm">
                          <span className="text-white">
                            {action.player_name} ({action.position})
                          </span>
                          <span className="text-gray-400">
                            {action.action}
                            {action.amount && ` Ξ${action.amount.toFixed(2)}`}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 pt-2 border-t border-emerald/20">
                      <span className="text-sm text-gray-400">
                        Bote después de la ronda: Ξ{round.pot_after_round.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <ShareHandDialog
        hand={hand}
        open={showShareDialog}
        onClose={() => setShowShareDialog(false)}
      />

      <ReportHandDialog
        hand={hand}
        open={showReportDialog}
        onClose={() => setShowReportDialog(false)}
      />
    </>
  );
};
