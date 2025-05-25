
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  email: string;
  subject: string;
  description: string;
  category: 'TECHNICAL' | 'PAYMENT' | 'ACCOUNT' | 'GAME' | 'OTHER';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'OPEN' | 'IN_PROGRESS' | 'WAITING_USER' | 'RESOLVED' | 'CLOSED';
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
  attachments?: string[];
  messages: TicketMessage[];
}

export interface TicketMessage {
  id: string;
  ticketId: string;
  senderId: string;
  senderName: string;
  senderType: 'USER' | 'AGENT';
  message: string;
  timestamp: Date;
  isInternal?: boolean;
}

export interface LiveChatSession {
  id: string;
  userId: string;
  userName: string;
  agentId?: string;
  agentName?: string;
  status: 'WAITING' | 'ACTIVE' | 'ENDED';
  startTime: Date;
  endTime?: Date;
  messages: ChatMessage[];
  rating?: number;
  feedback?: string;
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  senderId: string;
  senderName: string;
  senderType: 'USER' | 'AGENT' | 'SYSTEM';
  message: string;
  timestamp: Date;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
  views: number;
  helpful: number;
  notHelpful: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface DisputeCase {
  id: string;
  userId: string;
  userName: string;
  type: 'REFUND' | 'CHARGEBACK' | 'GAME_DISPUTE' | 'BONUS_DISPUTE';
  amount: number;
  description: string;
  evidence: string[];
  status: 'PENDING' | 'INVESTIGATING' | 'APPROVED' | 'REJECTED' | 'ESCALATED';
  assignedTo?: string;
  createdAt: Date;
  resolvedAt?: Date;
  resolution?: string;
  refundAmount?: number;
}

export function useSupport() {
  const [loading, setLoading] = useState(false);
  const [tickets, setTickets] = useState<SupportTicket[]>([
    {
      id: 'ticket_1',
      userId: 'user_1',
      userName: 'John Doe',
      email: 'john@example.com',
      subject: 'Problema con depósito',
      description: 'No puedo ver mi depósito reflejado en mi cuenta',
      category: 'PAYMENT',
      priority: 'HIGH',
      status: 'OPEN',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      messages: []
    },
    {
      id: 'ticket_2',
      userId: 'user_2',
      userName: 'Jane Smith',
      email: 'jane@example.com',
      subject: 'Error en mesa de poker',
      description: 'La mesa se desconectó durante una mano importante',
      category: 'GAME',
      priority: 'MEDIUM',
      status: 'IN_PROGRESS',
      assignedTo: 'agent_1',
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      messages: []
    }
  ]);

  const [liveChatSessions, setLiveChatSessions] = useState<LiveChatSession[]>([
    {
      id: 'chat_1',
      userId: 'user_3',
      userName: 'Mike Johnson',
      agentId: 'agent_2',
      agentName: 'Sarah Wilson',
      status: 'ACTIVE',
      startTime: new Date(Date.now() - 15 * 60 * 1000),
      messages: [
        {
          id: 'msg_1',
          sessionId: 'chat_1',
          senderId: 'user_3',
          senderName: 'Mike Johnson',
          senderType: 'USER',
          message: 'Hola, necesito ayuda con mi cuenta',
          timestamp: new Date(Date.now() - 15 * 60 * 1000)
        },
        {
          id: 'msg_2',
          sessionId: 'chat_1',
          senderId: 'agent_2',
          senderName: 'Sarah Wilson',
          senderType: 'AGENT',
          message: 'Hola Mike, estaré encantada de ayudarte. ¿Cuál es el problema?',
          timestamp: new Date(Date.now() - 14 * 60 * 1000)
        }
      ]
    }
  ]);

  const [faqItems, setFaqItems] = useState<FAQItem[]>([
    {
      id: 'faq_1',
      question: '¿Cómo puedo hacer un depósito?',
      answer: 'Puedes hacer un depósito desde la sección "Fondos" en tu cuenta. Aceptamos múltiples métodos de pago incluyendo tarjetas de crédito y criptomonedas.',
      category: 'Pagos',
      tags: ['deposito', 'pagos', 'fondos'],
      views: 1250,
      helpful: 95,
      notHelpful: 5,
      isPublished: true,
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    },
    {
      id: 'faq_2',
      question: '¿Cuáles son los límites de retiro?',
      answer: 'Los límites de retiro varían según tu nivel de verificación. Usuarios verificados pueden retirar hasta $10,000 por día.',
      category: 'Retiros',
      tags: ['retiro', 'limites', 'verificacion'],
      views: 890,
      helpful: 78,
      notHelpful: 12,
      isPublished: true,
      createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    }
  ]);

  const [disputes, setDisputes] = useState<DisputeCase[]>([
    {
      id: 'dispute_1',
      userId: 'user_4',
      userName: 'Robert Brown',
      type: 'REFUND',
      amount: 250,
      description: 'Solicito reembolso por desconexión durante torneo',
      evidence: ['screenshot1.png', 'log_file.txt'],
      status: 'INVESTIGATING',
      assignedTo: 'agent_3',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
    }
  ]);

  const { toast } = useToast();

  const createTicket = useCallback(async (ticketData: Partial<SupportTicket>) => {
    try {
      setLoading(true);
      
      const newTicket: SupportTicket = {
        id: `ticket_${Date.now()}`,
        userId: ticketData.userId || 'current_user',
        userName: ticketData.userName || 'Usuario',
        email: ticketData.email || 'user@example.com',
        subject: ticketData.subject || '',
        description: ticketData.description || '',
        category: ticketData.category || 'OTHER',
        priority: ticketData.priority || 'MEDIUM',
        status: 'OPEN',
        createdAt: new Date(),
        updatedAt: new Date(),
        messages: []
      };

      setTickets(prev => [newTicket, ...prev]);
      
      toast({
        title: 'Ticket creado',
        description: 'Tu ticket de soporte ha sido creado exitosamente',
      });

      return newTicket;
    } catch (error) {
      console.error('Error creating ticket:', error);
      toast({
        title: 'Error',
        description: 'No se pudo crear el ticket',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const updateTicketStatus = useCallback(async (ticketId: string, status: SupportTicket['status']) => {
    try {
      setTickets(prev => 
        prev.map(ticket => 
          ticket.id === ticketId 
            ? { ...ticket, status, updatedAt: new Date() }
            : ticket
        )
      );

      toast({
        title: 'Ticket actualizado',
        description: 'El estado del ticket ha sido actualizado',
      });
    } catch (error) {
      console.error('Error updating ticket:', error);
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el ticket',
        variant: 'destructive',
      });
    }
  }, [toast]);

  const addTicketMessage = useCallback(async (ticketId: string, message: string, senderType: 'USER' | 'AGENT') => {
    try {
      const newMessage: TicketMessage = {
        id: `msg_${Date.now()}`,
        ticketId,
        senderId: senderType === 'USER' ? 'current_user' : 'agent_1',
        senderName: senderType === 'USER' ? 'Usuario' : 'Agente de Soporte',
        senderType,
        message,
        timestamp: new Date()
      };

      setTickets(prev => 
        prev.map(ticket => 
          ticket.id === ticketId 
            ? { 
                ...ticket, 
                messages: [...ticket.messages, newMessage],
                updatedAt: new Date()
              }
            : ticket
        )
      );
    } catch (error) {
      console.error('Error adding message:', error);
    }
  }, []);

  const startLiveChat = useCallback(async (userId: string, userName: string) => {
    try {
      const newSession: LiveChatSession = {
        id: `chat_${Date.now()}`,
        userId,
        userName,
        status: 'WAITING',
        startTime: new Date(),
        messages: [
          {
            id: 'msg_welcome',
            sessionId: `chat_${Date.now()}`,
            senderId: 'system',
            senderName: 'Sistema',
            senderType: 'SYSTEM',
            message: 'Bienvenido al chat de soporte. Un agente se conectará contigo pronto.',
            timestamp: new Date()
          }
        ]
      };

      setLiveChatSessions(prev => [newSession, ...prev]);
      
      toast({
        title: 'Chat iniciado',
        description: 'Te hemos conectado con un agente de soporte',
      });

      return newSession;
    } catch (error) {
      console.error('Error starting chat:', error);
      toast({
        title: 'Error',
        description: 'No se pudo iniciar el chat',
        variant: 'destructive',
      });
    }
  }, [toast]);

  const sendChatMessage = useCallback(async (sessionId: string, message: string, senderType: 'USER' | 'AGENT') => {
    try {
      const newMessage: ChatMessage = {
        id: `msg_${Date.now()}`,
        sessionId,
        senderId: senderType === 'USER' ? 'current_user' : 'agent_1',
        senderName: senderType === 'USER' ? 'Usuario' : 'Agente',
        senderType,
        message,
        timestamp: new Date()
      };

      setLiveChatSessions(prev => 
        prev.map(session => 
          session.id === sessionId 
            ? { ...session, messages: [...session.messages, newMessage] }
            : session
        )
      );
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }, []);

  const createDispute = useCallback(async (disputeData: Partial<DisputeCase>) => {
    try {
      setLoading(true);
      
      const newDispute: DisputeCase = {
        id: `dispute_${Date.now()}`,
        userId: disputeData.userId || 'current_user',
        userName: disputeData.userName || 'Usuario',
        type: disputeData.type || 'REFUND',
        amount: disputeData.amount || 0,
        description: disputeData.description || '',
        evidence: disputeData.evidence || [],
        status: 'PENDING',
        createdAt: new Date()
      };

      setDisputes(prev => [newDispute, ...prev]);
      
      toast({
        title: 'Disputa creada',
        description: 'Tu caso de disputa ha sido enviado para revisión',
      });

      return newDispute;
    } catch (error) {
      console.error('Error creating dispute:', error);
      toast({
        title: 'Error',
        description: 'No se pudo crear la disputa',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const updateDisputeStatus = useCallback(async (disputeId: string, status: DisputeCase['status'], resolution?: string) => {
    try {
      setDisputes(prev => 
        prev.map(dispute => 
          dispute.id === disputeId 
            ? { 
                ...dispute, 
                status, 
                resolution,
                resolvedAt: status === 'APPROVED' || status === 'REJECTED' ? new Date() : undefined
              }
            : dispute
        )
      );

      toast({
        title: 'Disputa actualizada',
        description: 'El estado de la disputa ha sido actualizado',
      });
    } catch (error) {
      console.error('Error updating dispute:', error);
      toast({
        title: 'Error',
        description: 'No se pudo actualizar la disputa',
        variant: 'destructive',
      });
    }
  }, [toast]);

  const searchFAQ = useCallback((query: string) => {
    if (!query.trim()) return faqItems;
    
    return faqItems.filter(item => 
      item.question.toLowerCase().includes(query.toLowerCase()) ||
      item.answer.toLowerCase().includes(query.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
  }, [faqItems]);

  return {
    // Data
    tickets,
    liveChatSessions,
    faqItems,
    disputes,
    loading,
    
    // Ticket functions
    createTicket,
    updateTicketStatus,
    addTicketMessage,
    
    // Live chat functions
    startLiveChat,
    sendChatMessage,
    
    // Dispute functions
    createDispute,
    updateDisputeStatus,
    
    // FAQ functions
    searchFAQ
  };
}
