
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Calendar, Clock, Database, Archive, AlertCircle } from 'lucide-react';

interface BackupSchedule {
  id: string;
  name: string;
  type: 'FULL' | 'INCREMENTAL' | 'DIFFERENTIAL';
  frequency: 'HOURLY' | 'DAILY' | 'WEEKLY' | 'MONTHLY';
  time: string;
  retention: number; // days
  enabled: boolean;
  target: 'DATABASE' | 'FILES' | 'COMPLETE';
  compression: boolean;
  encryption: boolean;
  lastRun?: Date;
  nextRun: Date;
  status: 'ACTIVE' | 'PAUSED' | 'ERROR';
}

const BackupScheduler: React.FC = () => {
  const [schedules, setSchedules] = useState<BackupSchedule[]>([
    {
      id: 'schedule_1',
      name: 'Database Daily Backup',
      type: 'FULL',
      frequency: 'DAILY',
      time: '03:00',
      retention: 30,
      enabled: true,
      target: 'DATABASE',
      compression: true,
      encryption: true,
      lastRun: new Date(Date.now() - 3 * 60 * 60 * 1000),
      nextRun: new Date(Date.now() + 21 * 60 * 60 * 1000),
      status: 'ACTIVE'
    },
    {
      id: 'schedule_2',
      name: 'Files Weekly Backup',
      type: 'INCREMENTAL',
      frequency: 'WEEKLY',
      time: '02:00',
      retention: 60,
      enabled: true,
      target: 'FILES',
      compression: true,
      encryption: false,
      lastRun: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      nextRun: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      status: 'ACTIVE'
    }
  ]);

  const [newSchedule, setNewSchedule] = useState<Partial<BackupSchedule>>({
    type: 'FULL',
    frequency: 'DAILY',
    time: '00:00',
    retention: 30,
    enabled: true,
    target: 'DATABASE',
    compression: true,
    encryption: true
  });

  const [showCreateForm, setShowCreateForm] = useState(false);

  const addSchedule = () => {
    if (newSchedule.name && newSchedule.type && newSchedule.frequency) {
      const schedule: BackupSchedule = {
        ...newSchedule as BackupSchedule,
        id: `schedule_${Date.now()}`,
        nextRun: calculateNextRun(newSchedule.frequency!, newSchedule.time!),
        status: 'ACTIVE'
      };

      setSchedules(prev => [...prev, schedule]);
      setNewSchedule({
        type: 'FULL',
        frequency: 'DAILY',
        time: '00:00',
        retention: 30,
        enabled: true,
        target: 'DATABASE',
        compression: true,
        encryption: true
      });
      setShowCreateForm(false);
    }
  };

  const calculateNextRun = (frequency: string, time: string): Date => {
    const now = new Date();
    const [hours, minutes] = time.split(':').map(Number);
    const nextRun = new Date(now);
    nextRun.setHours(hours, minutes, 0, 0);

    switch (frequency) {
      case 'HOURLY':
        if (nextRun <= now) {
          nextRun.setHours(nextRun.getHours() + 1);
        }
        break;
      case 'DAILY':
        if (nextRun <= now) {
          nextRun.setDate(nextRun.getDate() + 1);
        }
        break;
      case 'WEEKLY':
        if (nextRun <= now) {
          nextRun.setDate(nextRun.getDate() + 7);
        }
        break;
      case 'MONTHLY':
        if (nextRun <= now) {
          nextRun.setMonth(nextRun.getMonth() + 1);
        }
        break;
    }

    return nextRun;
  };

  const toggleSchedule = (scheduleId: string) => {
    setSchedules(prev => 
      prev.map(schedule => 
        schedule.id === scheduleId 
          ? { ...schedule, enabled: !schedule.enabled, status: !schedule.enabled ? 'ACTIVE' : 'PAUSED' }
          : schedule
      )
    );
  };

  const deleteSchedule = (scheduleId: string) => {
    setSchedules(prev => prev.filter(schedule => schedule.id !== scheduleId));
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      'ACTIVE': 'bg-green-500',
      'PAUSED': 'bg-yellow-500',
      'ERROR': 'bg-red-500'
    };
    return <Badge className={colors[status as keyof typeof colors]}>{status}</Badge>;
  };

  const getTypeIcon = (target: string) => {
    switch (target) {
      case 'DATABASE':
        return <Database className="h-4 w-4" />;
      case 'FILES':
        return <Archive className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-navy-light border-emerald/20">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Programación de Backups
          </CardTitle>
          <Button 
            onClick={() => setShowCreateForm(!showCreateForm)}
            variant="outline"
            size="sm"
          >
            {showCreateForm ? 'Cancelar' : 'Nuevo Horario'}
          </Button>
        </CardHeader>
        <CardContent>
          {showCreateForm && (
            <div className="mb-6 p-4 bg-navy rounded border border-emerald/10">
              <h4 className="text-white font-medium mb-4">Crear Nuevo Horario</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Nombre</label>
                  <Input
                    value={newSchedule.name || ''}
                    onChange={(e) => setNewSchedule({ ...newSchedule, name: e.target.value })}
                    placeholder="Nombre del backup"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Tipo</label>
                  <Select 
                    value={newSchedule.type} 
                    onValueChange={(value: any) => setNewSchedule({ ...newSchedule, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FULL">Completo</SelectItem>
                      <SelectItem value="INCREMENTAL">Incremental</SelectItem>
                      <SelectItem value="DIFFERENTIAL">Diferencial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Objetivo</label>
                  <Select 
                    value={newSchedule.target} 
                    onValueChange={(value: any) => setNewSchedule({ ...newSchedule, target: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DATABASE">Base de Datos</SelectItem>
                      <SelectItem value="FILES">Archivos</SelectItem>
                      <SelectItem value="COMPLETE">Completo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Frecuencia</label>
                  <Select 
                    value={newSchedule.frequency} 
                    onValueChange={(value: any) => setNewSchedule({ ...newSchedule, frequency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="HOURLY">Cada hora</SelectItem>
                      <SelectItem value="DAILY">Diario</SelectItem>
                      <SelectItem value="WEEKLY">Semanal</SelectItem>
                      <SelectItem value="MONTHLY">Mensual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Hora</label>
                  <Input
                    type="time"
                    value={newSchedule.time}
                    onChange={(e) => setNewSchedule({ ...newSchedule, time: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Retención (días)</label>
                  <Input
                    type="number"
                    value={newSchedule.retention}
                    onChange={(e) => setNewSchedule({ ...newSchedule, retention: parseInt(e.target.value) })}
                    min="1"
                    max="365"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 mb-4">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={newSchedule.compression}
                    onCheckedChange={(checked) => setNewSchedule({ ...newSchedule, compression: checked })}
                  />
                  <span className="text-sm text-gray-400">Compresión</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Switch
                    checked={newSchedule.encryption}
                    onCheckedChange={(checked) => setNewSchedule({ ...newSchedule, encryption: checked })}
                  />
                  <span className="text-sm text-gray-400">Encriptación</span>
                </div>
              </div>

              <Button onClick={addSchedule}>Crear Horario</Button>
            </div>
          )}

          <div className="space-y-3">
            {schedules.map((schedule) => (
              <div key={schedule.id} className="flex items-center justify-between p-4 bg-navy rounded border border-emerald/10">
                <div className="flex items-center gap-4">
                  {getTypeIcon(schedule.target)}
                  <div>
                    <div className="text-white font-medium">{schedule.name}</div>
                    <div className="text-sm text-gray-400">
                      {schedule.type} • {schedule.frequency} a las {schedule.time}
                    </div>
                    <div className="text-xs text-gray-500">
                      Retención: {schedule.retention} días
                      {schedule.compression && ' • Comprimido'}
                      {schedule.encryption && ' • Encriptado'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm text-gray-400">Próximo:</div>
                    <div className="text-xs text-white">
                      {schedule.nextRun.toLocaleString()}
                    </div>
                    {schedule.lastRun && (
                      <div className="text-xs text-gray-500">
                        Último: {schedule.lastRun.toLocaleString()}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {getStatusBadge(schedule.status)}
                    <Switch
                      checked={schedule.enabled}
                      onCheckedChange={() => toggleSchedule(schedule.id)}
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteSchedule(schedule.id)}
                    >
                      Eliminar
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BackupScheduler;
