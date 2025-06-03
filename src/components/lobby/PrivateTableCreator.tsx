
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Copy, Lock, Users, Clock } from 'lucide-react';
import { VariantSelector } from './VariantSelector';
import { PokerVariant } from '@/types/pokerVariants';
import { toast } from '@/hooks/use-toast';

interface PrivateTableConfig {
  name: string;
  variant: PokerVariant;
  maxPlayers: number;
  smallBlind: number;
  bigBlind: number;
  minBuyIn: number;
  maxBuyIn: number;
  isPrivate: boolean;
  password?: string;
  inviteOnly: boolean;
  description?: string;
  timeLimit?: number;
}

export const PrivateTableCreator: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<PrivateTableConfig>({
    name: '',
    variant: 'TEXAS_HOLDEM',
    maxPlayers: 6,
    smallBlind: 5,
    bigBlind: 10,
    minBuyIn: 100,
    maxBuyIn: 1000,
    isPrivate: true,
    inviteOnly: false
  });
  const [accessCode, setAccessCode] = useState<string | null>(null);

  const handleCreate = async () => {
    // Simulate table creation
    const newAccessCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    setAccessCode(newAccessCode);
    
    toast({
      title: "Mesa Privada Creada",
      description: `Tu mesa "${config.name}" está lista. Código: ${newAccessCode}`,
    });
  };

  const copyAccessCode = () => {
    if (accessCode) {
      navigator.clipboard.writeText(accessCode);
      toast({
        title: "Código Copiado",
        description: "El código de acceso ha sido copiado al portapapeles",
      });
    }
  };

  if (accessCode) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="bg-purple-600/20 border-purple-500/50 hover:bg-purple-600/30">
            <Lock className="h-4 w-4 mr-2" />
            Mesa Privada
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-emerald">¡Mesa Creada!</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="text-center p-6 bg-slate-800 rounded-lg">
              <Lock className="h-12 w-12 mx-auto mb-4 text-purple-400" />
              <h3 className="text-xl font-bold mb-2">{config.name}</h3>
              <p className="text-gray-400 mb-4">{config.variant.replace('_', ' ')}</p>
              
              <div className="bg-slate-700 p-4 rounded-lg mb-4">
                <Label className="text-sm text-gray-400">Código de Acceso</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-lg px-4 py-2 font-mono">
                    {accessCode}
                  </Badge>
                  <Button size="sm" variant="ghost" onClick={copyAccessCode}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {config.maxPlayers} max
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {config.timeLimit || 'Sin límite'}
                </div>
              </div>
            </div>
            
            <Button onClick={() => setIsOpen(false)} className="w-full">
              Comenzar Juego
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-purple-600/20 border-purple-500/50 hover:bg-purple-600/30">
          <Lock className="h-4 w-4 mr-2" />
          Mesa Privada
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-emerald">Crear Mesa Privada</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Basic Settings */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nombre de la Mesa</Label>
              <Input
                value={config.name}
                onChange={(e) => setConfig(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Mi mesa privada"
                className="bg-slate-800 border-slate-600"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Máximo de Jugadores</Label>
              <Input
                type="number"
                min="2"
                max="9"
                value={config.maxPlayers}
                onChange={(e) => setConfig(prev => ({ ...prev, maxPlayers: parseInt(e.target.value) }))}
                className="bg-slate-800 border-slate-600"
              />
            </div>
          </div>

          {/* Poker Variant */}
          <VariantSelector
            value={config.variant}
            onValueChange={(variant) => setConfig(prev => ({ ...prev, variant }))}
          />

          {/* Blinds and Buy-ins */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Small Blind</Label>
              <Input
                type="number"
                value={config.smallBlind}
                onChange={(e) => setConfig(prev => ({ ...prev, smallBlind: parseFloat(e.target.value) }))}
                className="bg-slate-800 border-slate-600"
              />
            </div>
            <div className="space-y-2">
              <Label>Big Blind</Label>
              <Input
                type="number"
                value={config.bigBlind}
                onChange={(e) => setConfig(prev => ({ ...prev, bigBlind: parseFloat(e.target.value) }))}
                className="bg-slate-800 border-slate-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Buy-in Mínimo</Label>
              <Input
                type="number"
                value={config.minBuyIn}
                onChange={(e) => setConfig(prev => ({ ...prev, minBuyIn: parseFloat(e.target.value) }))}
                className="bg-slate-800 border-slate-600"
              />
            </div>
            <div className="space-y-2">
              <Label>Buy-in Máximo</Label>
              <Input
                type="number"
                value={config.maxBuyIn}
                onChange={(e) => setConfig(prev => ({ ...prev, maxBuyIn: parseFloat(e.target.value) }))}
                className="bg-slate-800 border-slate-600"
              />
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="space-y-4 p-4 bg-slate-800 rounded-lg">
            <h3 className="font-semibold text-purple-400">Configuración de Privacidad</h3>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Mesa Privada</Label>
                <p className="text-sm text-gray-400">Requiere código para unirse</p>
              </div>
              <Switch
                checked={config.isPrivate}
                onCheckedChange={(checked) => setConfig(prev => ({ ...prev, isPrivate: checked }))}
              />
            </div>

            {config.isPrivate && (
              <div className="space-y-2">
                <Label>Contraseña (Opcional)</Label>
                <Input
                  type="password"
                  value={config.password || ''}
                  onChange={(e) => setConfig(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Dejar vacío para solo código"
                  className="bg-slate-700 border-slate-600"
                />
              </div>
            )}

            <div className="flex items-center justify-between">
              <div>
                <Label>Solo por Invitación</Label>
                <p className="text-sm text-gray-400">Solo jugadores invitados pueden unirse</p>
              </div>
              <Switch
                checked={config.inviteOnly}
                onCheckedChange={(checked) => setConfig(prev => ({ ...prev, inviteOnly: checked }))}
              />
            </div>
          </div>

          {/* Additional Settings */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Descripción (Opcional)</Label>
              <Textarea
                value={config.description || ''}
                onChange={(e) => setConfig(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe tu mesa..."
                className="bg-slate-800 border-slate-600"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Límite de Tiempo (minutos, opcional)</Label>
              <Input
                type="number"
                value={config.timeLimit || ''}
                onChange={(e) => setConfig(prev => ({ ...prev, timeLimit: parseInt(e.target.value) || undefined }))}
                placeholder="Sin límite"
                className="bg-slate-800 border-slate-600"
              />
            </div>
          </div>

          <Button onClick={handleCreate} className="w-full bg-purple-600 hover:bg-purple-700">
            Crear Mesa Privada
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
