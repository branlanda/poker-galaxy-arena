
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, MessageSquare, Clock, User, Mail, Calendar } from 'lucide-react';
import { useSupport, SupportTicket } from '@/hooks/useSupport';

interface SupportTicketsProps {
  searchQuery: string;
}

const SupportTickets: React.FC<SupportTicketsProps> = ({ searchQuery }) => {
  const { 
    tickets, 
    loading, 
    createTicket, 
    updateTicketStatus, 
    addTicketMessage 
  } = useSupport();
  
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [newTicketData, setNewTicketData] = useState({
    subject: '',
    description: '',
    category: 'OTHER' as const,
    priority: 'MEDIUM' as const
  });
  const [replyMessage, setReplyMessage] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const filteredTickets = tickets.filter(ticket => 
    !searchQuery || 
    ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ticket.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ticket.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateTicket = async () => {
    if (!newTicketData.subject || !newTicketData.description) return;

    await createTicket({
      ...newTicketData,
      userName: 'Usuario Actual',
      email: 'user@example.com'
    });

    setNewTicketData({
      subject: '',
      description: '',
      category: 'OTHER',
      priority: 'MEDIUM'
    });
    setShowCreateDialog(false);
  };

  const handleReply = async () => {
    if (!selectedTicket || !replyMessage.trim()) return;

    await addTicketMessage(selectedTicket.id, replyMessage, 'AGENT');
    setReplyMessage('');
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'OPEN': 'bg-red-500',
      'IN_PROGRESS': 'bg-yellow-500',
      'WAITING_USER': 'bg-blue-500',
      'RESOLVED': 'bg-green-500',
      'CLOSED': 'bg-gray-500'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      'LOW': 'bg-green-600',
      'MEDIUM': 'bg-yellow-600',
      'HIGH': 'bg-orange-600',
      'URGENT': 'bg-red-600'
    };
    return colors[priority as keyof typeof colors] || 'bg-gray-600';
  };

  return (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Tickets de Soporte</h2>
        
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-emerald hover:bg-emerald/90">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Ticket
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-navy border-emerald/20">
            <DialogHeader>
              <DialogTitle className="text-white">Crear Nuevo Ticket</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Asunto</label>
                <Input
                  value={newTicketData.subject}
                  onChange={(e) => setNewTicketData({ ...newTicketData, subject: e.target.value })}
                  placeholder="Describe brevemente el problema"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Categoría</label>
                  <Select 
                    value={newTicketData.category} 
                    onValueChange={(value: any) => setNewTicketData({ ...newTicketData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TECHNICAL">Técnico</SelectItem>
                      <SelectItem value="PAYMENT">Pagos</SelectItem>
                      <SelectItem value="ACCOUNT">Cuenta</SelectItem>
                      <SelectItem value="GAME">Juego</SelectItem>
                      <SelectItem value="OTHER">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Prioridad</label>
                  <Select 
                    value={newTicketData.priority} 
                    onValueChange={(value: any) => setNewTicketData({ ...newTicketData, priority: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LOW">Baja</SelectItem>
                      <SelectItem value="MEDIUM">Media</SelectItem>
                      <SelectItem value="HIGH">Alta</SelectItem>
                      <SelectItem value="URGENT">Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Descripción</label>
                <Textarea
                  value={newTicketData.description}
                  onChange={(e) => setNewTicketData({ ...newTicketData, description: e.target.value })}
                  placeholder="Describe detalladamente el problema"
                  rows={4}
                />
              </div>

              <Button 
                onClick={handleCreateTicket}
                disabled={!newTicketData.subject || !newTicketData.description || loading}
                className="w-full bg-emerald hover:bg-emerald/90"
              >
                Crear Ticket
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tickets List */}
        <div className="lg:col-span-2 space-y-4">
          {filteredTickets.map((ticket) => (
            <Card 
              key={ticket.id} 
              className={`bg-navy-light border-emerald/20 cursor-pointer transition-all ${
                selectedTicket?.id === ticket.id ? 'ring-2 ring-emerald' : ''
              }`}
              onClick={() => setSelectedTicket(ticket)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-white font-medium mb-1">{ticket.subject}</h3>
                    <p className="text-gray-400 text-sm line-clamp-2">{ticket.description}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2 ml-4">
                    <Badge className={getStatusColor(ticket.status)}>
                      {ticket.status}
                    </Badge>
                    <Badge className={getPriorityColor(ticket.priority)}>
                      {ticket.priority}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-400">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {ticket.userName}
                    </div>
                    <div className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {ticket.email}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {ticket.createdAt.toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredTickets.length === 0 && (
            <Card className="bg-navy-light border-emerald/20">
              <CardContent className="p-8 text-center">
                <MessageSquare className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">No se encontraron tickets</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Ticket Detail */}
        <div className="space-y-4">
          {selectedTicket ? (
            <>
              <Card className="bg-navy-light border-emerald/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    Detalle del Ticket
                    <Select 
                      value={selectedTicket.status} 
                      onValueChange={(value: any) => updateTicketStatus(selectedTicket.id, value)}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="OPEN">Abierto</SelectItem>
                        <SelectItem value="IN_PROGRESS">En Progreso</SelectItem>
                        <SelectItem value="WAITING_USER">Esperando Usuario</SelectItem>
                        <SelectItem value="RESOLVED">Resuelto</SelectItem>
                        <SelectItem value="CLOSED">Cerrado</SelectItem>
                      </SelectContent>
                    </Select>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-white font-medium mb-2">{selectedTicket.subject}</h4>
                    <p className="text-gray-400 text-sm">{selectedTicket.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Usuario:</span>
                      <p className="text-white">{selectedTicket.userName}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Email:</span>
                      <p className="text-white">{selectedTicket.email}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Categoría:</span>
                      <p className="text-white">{selectedTicket.category}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Prioridad:</span>
                      <Badge className={getPriorityColor(selectedTicket.priority)}>
                        {selectedTicket.priority}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Messages */}
              <Card className="bg-navy-light border-emerald/20">
                <CardHeader>
                  <CardTitle className="text-white">Conversación</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedTicket.messages.length === 0 ? (
                    <p className="text-gray-400 text-center py-4">No hay mensajes aún</p>
                  ) : (
                    selectedTicket.messages.map((message) => (
                      <div 
                        key={message.id}
                        className={`p-3 rounded ${
                          message.senderType === 'USER' ? 'bg-navy ml-8' : 'bg-emerald/10 mr-8'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-white">
                            {message.senderName}
                          </span>
                          <span className="text-xs text-gray-400">
                            {message.timestamp.toLocaleString()}
                          </span>
                        </div>
                        <p className="text-gray-300 text-sm">{message.message}</p>
                      </div>
                    ))
                  )}

                  <div className="space-y-2">
                    <Textarea
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      placeholder="Escribe tu respuesta..."
                      rows={3}
                    />
                    <Button 
                      onClick={handleReply}
                      disabled={!replyMessage.trim()}
                      className="w-full bg-emerald hover:bg-emerald/90"
                    >
                      Enviar Respuesta
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="bg-navy-light border-emerald/20">
              <CardContent className="p-8 text-center">
                <MessageSquare className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">Selecciona un ticket para ver los detalles</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupportTickets;
