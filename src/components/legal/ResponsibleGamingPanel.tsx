import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useLegalCompliance } from '@/hooks/useLegalCompliance';
import { AlertTriangle, Clock, TrendingDown, Shield, DollarSign, Calendar } from 'lucide-react';

interface GamingLimit {
  type: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  category: 'DEPOSIT' | 'LOSS' | 'SESSION_TIME' | 'WAGER';
  amount?: number;
  duration?: number; // in minutes for session time
  isActive: boolean;
}

const ResponsibleGamingPanel: React.FC = () => {
  const { requestSelfExclusion, isUserSelfExcluded } = useLegalCompliance();
  const [limits, setLimits] = useState<GamingLimit[]>([
    { type: 'DAILY', category: 'DEPOSIT', amount: 100, isActive: false },
    { type: 'DAILY', category: 'LOSS', amount: 50, isActive: false },
    { type: 'DAILY', category: 'SESSION_TIME', duration: 120, isActive: false },
  ]);

  const [newLimit, setNewLimit] = useState<Partial<GamingLimit>>({
    type: 'DAILY',
    category: 'DEPOSIT'
  });

  const [currentSession, setCurrentSession] = useState({
    startTime: new Date(),
    duration: 45, // minutes
    spent: 25,
    won: 10
  });

  const addLimit = () => {
    if (newLimit.type && newLimit.category && (newLimit.amount || newLimit.duration)) {
      const limit: GamingLimit = {
        type: newLimit.type,
        category: newLimit.category,
        amount: newLimit.amount,
        duration: newLimit.duration,
        isActive: true
      };
      setLimits(prev => [...prev, limit]);
      setNewLimit({ type: 'DAILY', category: 'DEPOSIT' });
    }
  };

  const toggleLimit = (index: number) => {
    setLimits(prev => 
      prev.map((limit, i) => 
        i === index ? { ...limit, isActive: !limit.isActive } : limit
      )
    );
  };

  const handleSelfExclusion = (type: 'TEMPORARY' | 'PERMANENT', duration?: number) => {
    requestSelfExclusion({
      userId: 'current_user',
      type,
      duration,
      reason: 'Auto-exclusión voluntaria para juego responsable'
    });
  };

  const isExcluded = isUserSelfExcluded('current_user');

  return (
    <div className="space-y-6">
      {/* Self-Exclusion Warning */}
      {isExcluded && (
        <Card className="bg-red-900/20 border-red-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <span className="text-red-500 font-medium">
                Cuenta Auto-excluida
              </span>
            </div>
            <p className="text-sm text-gray-300 mt-2">
              Tu cuenta está actualmente auto-excluida. El acceso a los juegos está restringido.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Current Session Info */}
      <Card className="bg-navy-light border-emerald/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Sesión Actual
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald">{currentSession.duration}</div>
              <div className="text-sm text-gray-400">Minutos jugados</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-500">${currentSession.spent}</div>
              <div className="text-sm text-gray-400">Gastado</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">${currentSession.won}</div>
              <div className="text-sm text-gray-400">Ganado</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-500">
                ${currentSession.spent - currentSession.won > 0 ? '-' : '+'}
                {Math.abs(currentSession.spent - currentSession.won)}
              </div>
              <div className="text-sm text-gray-400">Balance neto</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gaming Limits */}
      <Card className="bg-navy-light border-emerald/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Límites de Juego
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add New Limit */}
          <div className="p-4 bg-navy rounded border border-emerald/10">
            <h4 className="text-white font-medium mb-3">Establecer Nuevo Límite</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Select value={newLimit.type} onValueChange={(value: any) => setNewLimit({...newLimit, type: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DAILY">Diario</SelectItem>
                  <SelectItem value="WEEKLY">Semanal</SelectItem>
                  <SelectItem value="MONTHLY">Mensual</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={newLimit.category} onValueChange={(value: any) => setNewLimit({...newLimit, category: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DEPOSIT">Depósito</SelectItem>
                  <SelectItem value="LOSS">Pérdida</SelectItem>
                  <SelectItem value="SESSION_TIME">Tiempo de Sesión</SelectItem>
                  <SelectItem value="WAGER">Apuesta</SelectItem>
                </SelectContent>
              </Select>
              
              <Input
                type="number"
                placeholder={newLimit.category === 'SESSION_TIME' ? 'Minutos' : 'Cantidad ($)'}
                value={newLimit.category === 'SESSION_TIME' ? newLimit.duration || '' : newLimit.amount || ''}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (newLimit.category === 'SESSION_TIME') {
                    setNewLimit({...newLimit, duration: value});
                  } else {
                    setNewLimit({...newLimit, amount: value});
                  }
                }}
              />
              
              <Button onClick={addLimit}>Agregar</Button>
            </div>
          </div>

          {/* Existing Limits */}
          <div className="space-y-3">
            {limits.map((limit, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-navy rounded border border-emerald/10">
                <div className="flex items-center gap-3">
                  <div className="text-sm">
                    <span className="text-white font-medium">
                      {limit.type} - {limit.category}
                    </span>
                    <div className="text-gray-400">
                      {limit.category === 'SESSION_TIME' 
                        ? `${limit.duration} minutos`
                        : `$${limit.amount}`
                      }
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={limit.isActive ? 'default' : 'secondary'}>
                    {limit.isActive ? 'Activo' : 'Inactivo'}
                  </Badge>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => toggleLimit(index)}
                  >
                    {limit.isActive ? 'Desactivar' : 'Activar'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Self-Exclusion Options */}
      <Card className="bg-navy-light border-emerald/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Auto-exclusión
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-yellow-900/20 border border-yellow-500/20 rounded">
            <p className="text-sm text-gray-300">
              La auto-exclusión es una medida de protección que limita tu acceso a la plataforma. 
              Esta decisión debe ser tomada con cuidado ya que no puede ser revertida fácilmente.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              onClick={() => handleSelfExclusion('TEMPORARY', 1)}
              className="h-16 flex flex-col items-center justify-center"
              disabled={isExcluded}
            >
              <span className="font-medium">24 Horas</span>
              <span className="text-xs text-gray-400">Pausa breve</span>
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => handleSelfExclusion('TEMPORARY', 30)}
              className="h-16 flex flex-col items-center justify-center"
              disabled={isExcluded}
            >
              <span className="font-medium">30 Días</span>
              <span className="text-xs text-gray-400">Descanso mensual</span>
            </Button>
            
            <Button 
              variant="destructive" 
              onClick={() => handleSelfExclusion('PERMANENT')}
              className="h-16 flex flex-col items-center justify-center"
              disabled={isExcluded}
            >
              <span className="font-medium">Permanente</span>
              <span className="text-xs">Exclusión definitiva</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Resources and Help */}
      <Card className="bg-navy-light border-emerald/20">
        <CardHeader>
          <CardTitle className="text-white">Recursos de Ayuda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-navy rounded border border-emerald/10">
              <h4 className="text-white font-medium">Gamblers Anonymous</h4>
              <p className="text-sm text-gray-400">Apoyo para personas con problemas de juego</p>
              <p className="text-sm text-emerald">www.gamblersanonymous.org</p>
            </div>
            
            <div className="p-3 bg-navy rounded border border-emerald/10">
              <h4 className="text-white font-medium">Línea de Ayuda</h4>
              <p className="text-sm text-gray-400">Soporte 24/7 para juego responsable</p>
              <p className="text-sm text-emerald">1-800-522-4700</p>
            </div>
            
            <div className="p-3 bg-navy rounded border border-emerald/10">
              <h4 className="text-white font-medium">Centro de Autoayuda</h4>
              <p className="text-sm text-gray-400">Herramientas y recursos online</p>
              <p className="text-sm text-emerald">help.responsiblegaming.org</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResponsibleGamingPanel;
