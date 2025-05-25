
import React from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ChatPreferences } from '@/hooks/useChatSystem';

interface ChatSettingsProps {
  open: boolean;
  onClose: () => void;
  preferences: ChatPreferences | null;
  onUpdatePreferences: (updates: Partial<ChatPreferences>) => void;
}

export function ChatSettings({ open, onClose, preferences, onUpdatePreferences }: ChatSettingsProps) {
  if (!preferences) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-navy border-emerald/20">
        <DialogHeader>
          <DialogTitle className="text-white">Configuración del Chat</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="muted" className="text-white">
                Silenciar chat
              </Label>
              <p className="text-sm text-gray-400">
                No podrás enviar mensajes ni recibir notificaciones
              </p>
            </div>
            <Switch
              id="muted"
              checked={preferences.is_muted}
              onCheckedChange={(checked) => 
                onUpdatePreferences({ is_muted: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="notifications" className="text-white">
                Notificaciones
              </Label>
              <p className="text-sm text-gray-400">
                Recibir notificaciones cuando te mencionen
              </p>
            </div>
            <Switch
              id="notifications"
              checked={preferences.notification_enabled}
              onCheckedChange={(checked) => 
                onUpdatePreferences({ notification_enabled: checked })
              }
              disabled={preferences.is_muted}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="emojis" className="text-white">
                Emojis
              </Label>
              <p className="text-sm text-gray-400">
                Mostrar selector de emojis al escribir
              </p>
            </div>
            <Switch
              id="emojis"
              checked={preferences.emoji_enabled}
              onCheckedChange={(checked) => 
                onUpdatePreferences({ emoji_enabled: checked })
              }
              disabled={preferences.is_muted}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cerrar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
