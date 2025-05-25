
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Plus, 
  AlertTriangle, 
  DollarSign, 
  FileText, 
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  User
} from 'lucide-react';
import { useSupport, DisputeCase } from '@/hooks/useSupport';

const DisputeManager: React.FC = () => {
  const { 
    disputes, 
    loading, 
    createDispute, 
    updateDisputeStatus 
  } = useSupport();
  
  const [selectedDispute, setSelectedDispute] = useState<DisputeCase | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newDisputeData, setNewDisputeData] = useState({
    type: 'REFUND' as const,
    amount: 0,
    description: ''
  });
  const [resolution, setResolution] = useState('');

  const handleCreateDispute = async () => {
    if (!newDisputeData.description || newDisputeData.amount <= 0) return;

    await createDispute({
      ...newDisputeData,
      userName: 'Usuario Actual'
    });

    setNewDisputeData({
      type: 'REFUND',
      amount: 0,
      description: ''
    });
    setShowCreateDialog(false);
  };

  const handleResolveDispute = async (status: 'APPROVED' | 'REJECTED') => {
    if (!selectedDispute) return;

    await updateDisputeStatus(selectedDispute.id, status, resolution);
    setResolution('');
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'PENDING': 'bg-yellow-500',
      'INVESTIGATING': 'bg-blue-500',
      'APPROVED': 'bg-green-500',
      'REJECTED': 'bg-red-500',
      'ESCALATED': 'bg-purple-500'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500';
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'REFUND':
        return <DollarSign className="h-4 w-4" />;
      case 'CHARGEBACK':
        return <AlertTriangle className="h-4 w-4" />;
      case 'GAME_DISPUTE':
        return <FileText className="h-4 w-4" />;
      case 'BONUS_DISPUTE':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      'REFUND': 'Reembolso',
      'CHARGEBACK': 'Contracargo',
      'GAME_DISPUTE': 'Disputa de Juego',
      'BONUS_DISPUTE': 'Disputa de Bonus'
    };
    return labels[type as keyof typeof labels] || type;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Gestión de Disputas y Reembolsos</h2>
        
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-emerald hover:bg-emerald/90">
              <Plus className="h-4 w-4 mr-2" />
              Nueva Disputa
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-navy border-emerald/20">
            <DialogHeader>
              <DialogTitle className="text-white">Crear Nueva Disputa</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Tipo de Disputa</label>
                <Select 
                  value={newDisputeData.type} 
                  onValueChange={(value: any) => setNewDisputeData({ ...newDisputeData, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="REFUND">Reembolso</SelectItem>
                    <SelectItem value="CHARGEBACK">Contracargo</SelectItem>
                    <SelectItem value="GAME_DISPUTE">Disputa de Juego</SelectItem>
                    <SelectItem value="BONUS_DISPUTE">Disputa de Bonus</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Monto</label>
                <Input
                  type="number"
                  value={newDisputeData.amount}
                  onChange={(e) => setNewDisputeData({ ...newDisputeData, amount: parseFloat(e.target.value) || 0 })}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Descripción</label>
                <Textarea
                  value={newDisputeData.description}
                  onChange={(e) => setNewDisputeData({ ...newDisputeData, description: e.target.value })}
                  placeholder="Describe detalladamente el motivo de la disputa"
                  rows={4}
                />
              </div>

              <Button 
                onClick={handleCreateDispute}
                disabled={!newDisputeData.description || newDisputeData.amount <= 0 || loading}
                className="w-full bg-emerald hover:bg-emerald/90"
              >
                Crear Disputa
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Disputes List */}
        <div className="lg:col-span-2 space-y-4">
          {disputes.map((dispute) => (
            <Card 
              key={dispute.id} 
              className={`bg-navy-light border-emerald/20 cursor-pointer transition-all ${
                selectedDispute?.id === dispute.id ? 'ring-2 ring-emerald' : ''
              }`}
              onClick={() => setSelectedDispute(dispute)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald/10 rounded">
                      {getTypeIcon(dispute.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-white font-medium">{getTypeLabel(dispute.type)}</h3>
                        <Badge className={getStatusColor(dispute.status)}>
                          {dispute.status}
                        </Badge>
                      </div>
                      <p className="text-gray-400 text-sm line-clamp-2">{dispute.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-emerald font-bold">${dispute.amount.toFixed(2)}</p>
                    {dispute.refundAmount && (
                      <p className="text-green-400 text-sm">
                        Reembolsado: ${dispute.refundAmount.toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-400">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {dispute.userName}
                    </div>
                    {dispute.assignedTo && (
                      <div className="text-emerald">
                        Asignado a: {dispute.assignedTo}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {dispute.createdAt.toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {disputes.length === 0 && (
            <Card className="bg-navy-light border-emerald/20">
              <CardContent className="p-8 text-center">
                <AlertTriangle className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">No hay disputas registradas</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Dispute Detail */}
        <div className="space-y-4">
          {selectedDispute ? (
            <>
              <Card className="bg-navy-light border-emerald/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    {getTypeIcon(selectedDispute.type)}
                    Detalle de Disputa
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-gray-400 text-sm">Estado:</span>
                      <div className="mt-1">
                        <Badge className={getStatusColor(selectedDispute.status)}>
                          {selectedDispute.status}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Monto:</span>
                      <p className="text-emerald font-bold text-lg">
                        ${selectedDispute.amount.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div>
                    <span className="text-gray-400 text-sm">Usuario:</span>
                    <p className="text-white">{selectedDispute.userName}</p>
                  </div>

                  <div>
                    <span className="text-gray-400 text-sm">Tipo:</span>
                    <p className="text-white">{getTypeLabel(selectedDispute.type)}</p>
                  </div>

                  <div>
                    <span className="text-gray-400 text-sm">Descripción:</span>
                    <p className="text-white text-sm leading-relaxed mt-1">
                      {selectedDispute.description}
                    </p>
                  </div>

                  {selectedDispute.evidence.length > 0 && (
                    <div>
                      <span className="text-gray-400 text-sm">Evidencia:</span>
                      <div className="mt-1 space-y-1">
                        {selectedDispute.evidence.map((file, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <FileText className="h-3 w-3" />
                            <span className="text-blue-400">{file}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="text-xs text-gray-500">
                    Creado: {selectedDispute.createdAt.toLocaleString()}
                    {selectedDispute.resolvedAt && (
                      <div>Resuelto: {selectedDispute.resolvedAt.toLocaleString()}</div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              {selectedDispute.status === 'PENDING' || selectedDispute.status === 'INVESTIGATING' ? (
                <Card className="bg-navy-light border-emerald/20">
                  <CardHeader>
                    <CardTitle className="text-white">Resolución</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">
                        Comentarios de resolución
                      </label>
                      <Textarea
                        value={resolution}
                        onChange={(e) => setResolution(e.target.value)}
                        placeholder="Describe la resolución de la disputa..."
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        onClick={() => handleResolveDispute('APPROVED')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Aprobar
                      </Button>
                      <Button
                        onClick={() => handleResolveDispute('REJECTED')}
                        variant="destructive"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Rechazar
                      </Button>
                    </div>

                    <Button
                      onClick={() => updateDisputeStatus(selectedDispute.id, 'INVESTIGATING')}
                      variant="outline"
                      className="w-full"
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      Marcar en Investigación
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-navy-light border-emerald/20">
                  <CardContent className="p-6 text-center">
                    <div className="mb-4">
                      {selectedDispute.status === 'APPROVED' ? (
                        <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                      ) : (
                        <XCircle className="h-12 w-12 text-red-500 mx-auto" />
                      )}
                    </div>
                    <p className="text-white font-medium mb-2">
                      Disputa {selectedDispute.status === 'APPROVED' ? 'Aprobada' : 'Rechazada'}
                    </p>
                    {selectedDispute.resolution && (
                      <p className="text-gray-400 text-sm">
                        {selectedDispute.resolution}
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Card className="bg-navy-light border-emerald/20">
              <CardContent className="p-8 text-center">
                <AlertTriangle className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">Selecciona una disputa para ver los detalles</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default DisputeManager;
