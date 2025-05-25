
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  MessageSquare, 
  FileText, 
  HelpCircle, 
  AlertTriangle,
  Clock,
  CheckCircle,
  Users,
  TrendingUp
} from 'lucide-react';
import { useSupport } from '@/hooks/useSupport';
import SupportTickets from './SupportTickets';
import LiveChatSupport from './LiveChatSupport';
import FAQSection from './FAQSection';
import DisputeManager from './DisputeManager';

const SupportDashboard: React.FC = () => {
  const { 
    tickets, 
    liveChatSessions, 
    faqItems, 
    disputes,
    loading 
  } = useSupport();
  
  const [searchQuery, setSearchQuery] = useState('');

  // Statistics calculations
  const openTickets = tickets.filter(t => t.status === 'OPEN').length;
  const inProgressTickets = tickets.filter(t => t.status === 'IN_PROGRESS').length;
  const activeChatSessions = liveChatSessions.filter(s => s.status === 'ACTIVE').length;
  const pendingDisputes = disputes.filter(d => d.status === 'PENDING').length;

  const getStatusBadge = (status: string) => {
    const colors = {
      'OPEN': 'bg-red-500',
      'IN_PROGRESS': 'bg-yellow-500',
      'WAITING_USER': 'bg-blue-500',
      'RESOLVED': 'bg-green-500',
      'CLOSED': 'bg-gray-500'
    };
    return <Badge className={colors[status as keyof typeof colors] || 'bg-gray-500'}>{status}</Badge>;
  };

  return (
    <div className="min-h-screen bg-navy text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-emerald">Centro de Soporte</h1>
            <p className="text-gray-400 mt-2">
              Gestiona tickets, chat en vivo, FAQ y disputas
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Input
                placeholder="Buscar en soporte..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64"
              />
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-navy-light border-emerald/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Tickets Abiertos</p>
                  <p className="text-2xl font-bold text-white">{openTickets}</p>
                </div>
                <FileText className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-navy-light border-emerald/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">En Progreso</p>
                  <p className="text-2xl font-bold text-white">{inProgressTickets}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-navy-light border-emerald/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Chats Activos</p>
                  <p className="text-2xl font-bold text-white">{activeChatSessions}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-navy-light border-emerald/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Disputas Pendientes</p>
                  <p className="text-2xl font-bold text-white">{pendingDisputes}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="tickets" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-navy-light">
            <TabsTrigger 
              value="tickets" 
              className="data-[state=active]:bg-emerald data-[state=active]:text-white"
            >
              <FileText className="h-4 w-4 mr-2" />
              Tickets
            </TabsTrigger>
            <TabsTrigger 
              value="chat" 
              className="data-[state=active]:bg-emerald data-[state=active]:text-white"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Chat en Vivo
            </TabsTrigger>
            <TabsTrigger 
              value="faq" 
              className="data-[state=active]:bg-emerald data-[state=active]:text-white"
            >
              <HelpCircle className="h-4 w-4 mr-2" />
              FAQ
            </TabsTrigger>
            <TabsTrigger 
              value="disputes" 
              className="data-[state=active]:bg-emerald data-[state=active]:text-white"
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Disputas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tickets">
            <SupportTickets searchQuery={searchQuery} />
          </TabsContent>

          <TabsContent value="chat">
            <LiveChatSupport />
          </TabsContent>

          <TabsContent value="faq">
            <FAQSection searchQuery={searchQuery} />
          </TabsContent>

          <TabsContent value="disputes">
            <DisputeManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SupportDashboard;
