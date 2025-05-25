
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarContent, AvatarFallback } from '@/components/ui/avatar';
import { MessageSquare, Send, Phone, PhoneOff, User, Clock } from 'lucide-react';
import { useSupport, LiveChatSession } from '@/hooks/useSupport';

const LiveChatSupport: React.FC = () => {
  const { 
    liveChatSessions, 
    startLiveChat, 
    sendChatMessage 
  } = useSupport();
  
  const [selectedSession, setSelectedSession] = useState<LiveChatSession | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedSession?.messages]);

  const handleSendMessage = async () => {
    if (!selectedSession || !newMessage.trim()) return;

    await sendChatMessage(selectedSession.id, newMessage, 'AGENT');
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getSessionStatusColor = (status: string) => {
    const colors = {
      'WAITING': 'bg-yellow-500',
      'ACTIVE': 'bg-green-500',
      'ENDED': 'bg-gray-500'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500';
  };

  const formatDuration = (startTime: Date, endTime?: Date) => {
    const end = endTime || new Date();
    const diff = end.getTime() - startTime.getTime();
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Chat de Soporte en Vivo</h2>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-400">
            Sesiones activas: {liveChatSessions.filter(s => s.status === 'ACTIVE').length}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Sessions List */}
        <div className="space-y-4">
          <Card className="bg-navy-light border-emerald/20">
            <CardHeader>
              <CardTitle className="text-white">Sesiones de Chat</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {liveChatSessions.map((session) => (
                <div
                  key={session.id}
                  className={`p-3 rounded cursor-pointer transition-all border ${
                    selectedSession?.id === session.id 
                      ? 'border-emerald bg-emerald/10' 
                      : 'border-emerald/20 hover:border-emerald/40'
                  }`}
                  onClick={() => setSelectedSession(session)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-emerald text-white">
                          {session.userName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-white text-sm font-medium">{session.userName}</p>
                        <p className="text-gray-400 text-xs">
                          {session.agentName || 'Sin asignar'}
                        </p>
                      </div>
                    </div>
                    <Badge className={getSessionStatusColor(session.status)}>
                      {session.status}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDuration(session.startTime, session.endTime)}
                    </div>
                    <div>
                      {session.messages.length} mensajes
                    </div>
                  </div>
                </div>
              ))}

              {liveChatSessions.length === 0 && (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">No hay sesiones de chat</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Chat Interface */}
        <div className="lg:col-span-2">
          {selectedSession ? (
            <Card className="bg-navy-light border-emerald/20 h-[600px] flex flex-col">
              {/* Chat Header */}
              <CardHeader className="border-b border-emerald/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-emerald text-white">
                        {selectedSession.userName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-white">{selectedSession.userName}</CardTitle>
                      <p className="text-gray-400 text-sm">
                        {selectedSession.status === 'ACTIVE' ? 'En línea' : selectedSession.status}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge className={getSessionStatusColor(selectedSession.status)}>
                      {selectedSession.status}
                    </Badge>
                    <Button size="sm" variant="outline">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <PhoneOff className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 overflow-auto p-4 space-y-4">
                {selectedSession.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.senderType === 'AGENT' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.senderType === 'AGENT'
                          ? 'bg-emerald text-white'
                          : message.senderType === 'SYSTEM'
                          ? 'bg-gray-600 text-gray-200'
                          : 'bg-navy text-white border border-emerald/20'
                      }`}
                    >
                      <p className="text-sm">{message.message}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </CardContent>

              {/* Message Input */}
              {selectedSession.status === 'ACTIVE' && (
                <div className="p-4 border-t border-emerald/20">
                  <div className="flex gap-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Escribe un mensaje..."
                      className="flex-1"
                    />
                    <Button 
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="bg-emerald hover:bg-emerald/90"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          ) : (
            <Card className="bg-navy-light border-emerald/20 h-[600px] flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-white text-lg font-medium mb-2">Selecciona una sesión de chat</h3>
                <p className="text-gray-400">
                  Elige una sesión de la lista para comenzar a chatear
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveChatSupport;
