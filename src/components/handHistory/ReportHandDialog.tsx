
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DetailedHandHistory } from '@/types/handHistory';
import { useHandHistory } from '@/hooks/useHandHistory';
import { Flag, AlertTriangle } from 'lucide-react';

interface ReportHandDialogProps {
  hand: DetailedHandHistory;
  open: boolean;
  onClose: () => void;
}

export const ReportHandDialog: React.FC<ReportHandDialogProps> = ({
  hand,
  open,
  onClose
}) => {
  const { reportHand } = useHandHistory();
  const [reportType, setReportType] = useState<'COLLUSION' | 'BOT_PLAY' | 'SUSPICIOUS_BETTING' | ''>('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const reportTypes = [
    { value: 'COLLUSION', label: 'Colusión entre jugadores' },
    { value: 'BOT_PLAY', label: 'Juego automatizado (bot)' },
    { value: 'SUSPICIOUS_BETTING', label: 'Patrones de apuesta sospechosos' }
  ];

  const handleSubmit = async () => {
    if (!reportType || !description.trim()) return;

    setSubmitting(true);
    try {
      const success = await reportHand(
        hand.id,
        reportType as any,
        description
      );
      if (success) {
        handleClose();
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setReportType('');
    setDescription('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-navy border-red-400/20 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center">
            <Flag className="h-5 w-5 mr-2 text-red-400" />
            Reportar Mano Sospechosa
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-red-400/10 border border-red-400/20 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5" />
              <div className="text-sm text-red-400">
                <p className="font-semibold">Uso responsable</p>
                <p>Solo reporta si realmente sospechas de actividad fraudulenta. Los reportes falsos pueden resultar en sanciones.</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-white">Tipo de reporte</Label>
            <Select value={reportType} onValueChange={(value: any) => setReportType(value)}>
              <SelectTrigger className="bg-navy/50 border-emerald/20 text-white">
                <SelectValue placeholder="Selecciona el tipo de problema" />
              </SelectTrigger>
              <SelectContent>
                {reportTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-white">Descripción detallada</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe específicamente qué comportamiento te parece sospechoso..."
              className="bg-navy/50 border-emerald/20 text-white min-h-[100px]"
            />
          </div>

          <div className="flex space-x-2">
            <Button
              onClick={handleSubmit}
              disabled={submitting || !reportType || !description.trim()}
              className="flex-1 bg-red-500 text-white hover:bg-red-600"
            >
              {submitting ? 'Enviando...' : 'Enviar Reporte'}
            </Button>
            <Button
              onClick={handleClose}
              variant="outline"
              className="border-emerald/20 text-white hover:bg-emerald/10"
            >
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
