
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { DetailedHandHistory } from '@/types/handHistory';
import { useHandHistory } from '@/hooks/useHandHistory';
import { Share, Copy, Check } from 'lucide-react';

interface ShareHandDialogProps {
  hand: DetailedHandHistory;
  open: boolean;
  onClose: () => void;
}

export const ShareHandDialog: React.FC<ShareHandDialogProps> = ({
  hand,
  open,
  onClose
}) => {
  const { shareHand } = useHandHistory();
  const [title, setTitle] = useState(`Mano #${hand.hand_number} - ${hand.table_name}`);
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [expiresAt, setExpiresAt] = useState('');
  const [shareCode, setShareCode] = useState<string | null>(null);
  const [copying, setCopying] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleShare = async () => {
    setSubmitting(true);
    try {
      const code = await shareHand(
        hand.id,
        title,
        description,
        isPublic,
        expiresAt || undefined
      );
      if (code) {
        setShareCode(code);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyLink = async () => {
    if (!shareCode) return;
    
    setCopying(true);
    try {
      const link = `${window.location.origin}/shared-hand/${shareCode}`;
      await navigator.clipboard.writeText(link);
      setTimeout(() => setCopying(false), 2000);
    } catch (err) {
      setCopying(false);
    }
  };

  const handleClose = () => {
    setTitle(`Mano #${hand.hand_number} - ${hand.table_name}`);
    setDescription('');
    setIsPublic(false);
    setExpiresAt('');
    setShareCode(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-navy border-emerald/20 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center">
            <Share className="h-5 w-5 mr-2" />
            Compartir Mano
          </DialogTitle>
        </DialogHeader>

        {!shareCode ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-white">Título</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-navy/50 border-emerald/20 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white">Descripción (opcional)</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Añade una descripción de la mano..."
                className="bg-navy/50 border-emerald/20 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white">Fecha de expiración (opcional)</Label>
              <Input
                type="datetime-local"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="bg-navy/50 border-emerald/20 text-white"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="public-share"
                checked={isPublic}
                onCheckedChange={setIsPublic}
              />
              <Label htmlFor="public-share" className="text-white">
                Hacer público (aparecerá en la galería de manos)
              </Label>
            </div>

            <div className="flex space-x-2">
              <Button
                onClick={handleShare}
                disabled={submitting || !title.trim()}
                className="flex-1 bg-emerald text-white hover:bg-emerald/80"
              >
                {submitting ? 'Creando...' : 'Crear Enlace'}
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
        ) : (
          <div className="space-y-4">
            <div className="text-center">
              <div className="bg-emerald/20 p-4 rounded-lg mb-4">
                <h3 className="text-emerald font-semibold mb-2">¡Enlace creado!</h3>
                <p className="text-sm text-gray-400">
                  Tu mano ha sido compartida exitosamente.
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-white">Código de compartir:</Label>
                <div className="flex space-x-2">
                  <Input
                    value={shareCode}
                    readOnly
                    className="bg-navy/50 border-emerald/20 text-white font-mono"
                  />
                  <Button
                    onClick={handleCopyLink}
                    size="sm"
                    className="bg-emerald text-white hover:bg-emerald/80"
                  >
                    {copying ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-xs text-gray-400">
                  Los demás pueden usar este código para ver la mano.
                </p>
              </div>
            </div>

            <Button
              onClick={handleClose}
              className="w-full bg-emerald text-white hover:bg-emerald/80"
            >
              Cerrar
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
