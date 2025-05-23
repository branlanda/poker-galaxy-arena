
import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useAdmin } from '@/hooks/useAdmin';
import { useToast } from '@/hooks/use-toast';
import { Search, Shield, MessageCircle, Flag, Trash2, Ban, CheckCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ChatMessage {
  id: string;
  user_id: string;
  username: string;
  message: string;
  created_at: string;
  room_id: string;
  room_name: string;
  reported: boolean;
  reported_by?: string;
  report_reason?: string;
}

const ChatModeration = () => {
  const { t } = useTranslation();
  const { createAuditLog, canPerformAction } = useAdmin();
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [reportedMessages, setReportedMessages] = useState<ChatMessage[]>([]);
  const [filter, setFilter] = useState('');
  const [roomFilter, setRoomFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchChatMessages();
    
    const chatChannel = supabase
      .channel('chat-moderation')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'table_chat_messages' }, () => {
        fetchChatMessages();
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(chatChannel);
    };
  }, []);
  
  const fetchChatMessages = async () => {
    try {
      setLoading(true);
      
      // Mock reported messages
      setReportedMessages([
        {
          id: '1',
          user_id: 'user1',
          username: 'player123',
          message: 'Hey, what's your real name?',
          created_at: new Date().toISOString(),
          room_id: 'table1',
          room_name: 'Texas Hold'em $1/$2',
          reported: true,
          reported_by: 'user2',
          report_reason: 'Personal information request'
        },
        {
          id: '2',
          user_id: 'user3',
          username: 'pokerface',
          message: 'This game is rigged!',
          created_at: new Date(Date.now() - 3600000).toISOString(),
          room_id: 'table2',
          room_name: 'Omaha $2/$5',
          reported: true,
          reported_by: 'user4',
          report_reason: 'False accusations'
        }
      ]);
      
      // Mock regular messages
      setMessages([
        {
          id: '3',
          user_id: 'user5',
          username: 'cardhero',
          message: 'Good game everyone!',
          created_at: new Date(Date.now() - 7200000).toISOString(),
          room_id: 'table1',
          room_name: 'Texas Hold'em $1/$2',
          reported: false
        },
        {
          id: '4',
          user_id: 'user6',
          username: 'dealerking',
          message: 'Nice hand!',
          created_at: new Date(Date.now() - 10800000).toISOString(),
          room_id: 'table2',
          room_name: 'Omaha $2/$5',
          reported: false
        }
      ]);
      
    } catch (error) {
      console.error('Error fetching chat messages:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch chat messages',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteMessage = async (messageId: string) => {
    try {
      // In a real app, delete the message from the database
      // await supabase.from('table_chat_messages').delete().eq('id', messageId);
      
      // Create audit log
      await createAuditLog(
        'DELETE_CHAT_MESSAGE',
        `Chat message ${messageId} deleted by moderator`,
        { messageId }
      );
      
      // Remove from local state
      setMessages(messages.filter(msg => msg.id !== messageId));
      setReportedMessages(reportedMessages.filter(msg => msg.id !== messageId));
      
      toast({
        title: 'Message Deleted',
        description: 'The message has been removed from chat history.'
      });
      
    } catch (error) {
      console.error('Error deleting message:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete message',
        variant: 'destructive'
      });
    }
  };
  
  const handleBanUser = async (userId: string, username: string) => {
    try {
      // In a real app, ban the user
      // await supabase.from('profiles').update({ banned: true }).eq('id', userId);
      
      // Create audit log
      await createAuditLog(
        'BAN_USER_FROM_CHAT',
        `User ${username} (${userId}) banned from chat by moderator`,
        { userId, username }
      );
      
      toast({
        title: 'User Banned',
        description: `${username} has been banned from using the chat.`
      });
      
    } catch (error) {
      console.error('Error banning user:', error);
      toast({
        title: 'Error',
        description: 'Failed to ban user',
        variant: 'destructive'
      });
    }
  };
  
  const handleDismissReport = async (messageId: string) => {
    try {
      // In a real app, mark report as resolved
      // await supabase.from('chat_reports').update({ resolved: true }).eq('message_id', messageId);
      
      // Create audit log
      await createAuditLog(
        'DISMISS_CHAT_REPORT',
        `Chat report for message ${messageId} dismissed by moderator`,
        { messageId }
      );
      
      // Remove from reported messages
      setReportedMessages(reportedMessages.filter(msg => msg.id !== messageId));
      
      toast({
        title: 'Report Dismissed',
        description: 'The report has been dismissed.'
      });
      
    } catch (error) {
      console.error('Error dismissing report:', error);
      toast({
        title: 'Error',
        description: 'Failed to dismiss report',
        variant: 'destructive'
      });
    }
  };
  
  const filteredMessages = messages.filter(msg => {
    const matchesFilter = msg.message.toLowerCase().includes(filter.toLowerCase()) ||
                          msg.username.toLowerCase().includes(filter.toLowerCase());
    const matchesRoom = roomFilter === 'all' || msg.room_id === roomFilter;
    return matchesFilter && matchesRoom;
  });
  
  const filteredReportedMessages = reportedMessages.filter(msg => {
    const matchesFilter = msg.message.toLowerCase().includes(filter.toLowerCase()) ||
                          msg.username.toLowerCase().includes(filter.toLowerCase());
    const matchesRoom = roomFilter === 'all' || msg.room_id === roomFilter;
    return matchesFilter && matchesRoom;
  });
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <MessageCircle className="h-6 w-6" />
          {t('admin.chat.title')}
        </h2>
      </div>
      
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder={t('admin.chat.searchMessages')}
              className="pl-10"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
          
          <Select value={roomFilter} onValueChange={setRoomFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder={t('admin.chat.allRooms')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('admin.chat.allRooms')}</SelectItem>
              <SelectItem value="table1">Texas Hold'em $1/$2</SelectItem>
              <SelectItem value="table2">Omaha $2/$5</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex items-center gap-2">
            <Checkbox id="autoRefresh" defaultChecked />
            <label htmlFor="autoRefresh" className="text-sm">
              {t('admin.chat.autoRefresh')}
            </label>
          </div>
        </div>
        
        <Tabs defaultValue="reported">
          <TabsList className="mb-4">
            <TabsTrigger value="reported" className="flex items-center gap-2">
              <Flag className="h-4 w-4" />
              {t('admin.chat.reportedMessages')}
              {filteredReportedMessages.length > 0 && (
                <span className="bg-emerald/20 text-emerald text-xs rounded-full px-2 py-0.5 ml-2">
                  {filteredReportedMessages.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="all" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              {t('admin.chat.allMessages')}
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              {t('admin.chat.filterSettings')}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="reported">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-emerald"></div>
              </div>
            ) : filteredReportedMessages.length > 0 ? (
              <div className="space-y-4">
                {filteredReportedMessages.map(msg => (
                  <div key={msg.id} className="bg-[#0e2337] border-l-4 border-red-500 p-4 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={`https://api.dicebear.com/7.x/shapes/svg?seed=${msg.user_id}`} />
                          <AvatarFallback>{msg.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{msg.username}</p>
                          <p className="text-xs text-gray-400">{msg.room_name} • {new Date(msg.created_at).toLocaleTimeString()}</p>
                        </div>
                      </div>
                      <div className="text-xs text-red-400 flex items-center gap-1">
                        <Flag className="h-3 w-3" />
                        {t('admin.chat.reported')}
                      </div>
                    </div>
                    
                    <p className="mb-3 pl-10">{msg.message}</p>
                    
                    {msg.report_reason && (
                      <div className="bg-red-500/10 p-2 rounded text-sm mb-3">
                        <span className="font-medium">{t('admin.chat.reportReason')}:</span> {msg.report_reason}
                      </div>
                    )}
                    
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDismissReport(msg.id)}
                        className="flex items-center gap-1"
                      >
                        <CheckCircle className="h-4 w-4" />
                        {t('admin.chat.dismiss')}
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="flex items-center gap-1"
                          >
                            <Trash2 className="h-4 w-4" />
                            {t('admin.chat.delete')}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>{t('admin.chat.confirmDelete')}</AlertDialogTitle>
                            <AlertDialogDescription>
                              {t('admin.chat.deleteWarning')}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>{t('admin.cancel')}</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteMessage(msg.id)}>
                              {t('admin.chat.delete')}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="accent" 
                            size="sm"
                            className="flex items-center gap-1"
                          >
                            <Ban className="h-4 w-4" />
                            {t('admin.chat.banUser')}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>{t('admin.chat.confirmBan')}</AlertDialogTitle>
                            <AlertDialogDescription>
                              {t('admin.chat.banWarning', { username: msg.username })}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>{t('admin.cancel')}</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleBanUser(msg.user_id, msg.username)}>
                              {t('admin.chat.banUser')}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <CheckCircle className="h-12 w-12 text-emerald mb-4" />
                <h3 className="text-xl font-medium mb-2">{t('admin.chat.noReportedMessages')}</h3>
                <p className="text-gray-400">{t('admin.chat.allClear')}</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="all">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-emerald"></div>
              </div>
            ) : filteredMessages.length > 0 ? (
              <div className="space-y-4">
                {filteredMessages.map(msg => (
                  <div key={msg.id} className="bg-[#0e2337] p-4 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={`https://api.dicebear.com/7.x/shapes/svg?seed=${msg.user_id}`} />
                          <AvatarFallback>{msg.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{msg.username}</p>
                          <p className="text-xs text-gray-400">{msg.room_name} • {new Date(msg.created_at).toLocaleTimeString()}</p>
                        </div>
                      </div>
                    </div>
                    
                    <p className="mb-3 pl-10">{msg.message}</p>
                    
                    {canPerformAction('moderator') && (
                      <div className="flex justify-end gap-2">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="flex items-center gap-1"
                            >
                              <Trash2 className="h-4 w-4" />
                              {t('admin.chat.delete')}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>{t('admin.chat.confirmDelete')}</AlertDialogTitle>
                              <AlertDialogDescription>
                                {t('admin.chat.deleteWarning')}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>{t('admin.cancel')}</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteMessage(msg.id)}>
                                {t('admin.chat.delete')}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <MessageCircle className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-xl font-medium mb-2">{t('admin.chat.noMessages')}</h3>
                <p className="text-gray-400">{t('admin.chat.noMessagesDescription')}</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="settings">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">{t('admin.chat.autoModeration')}</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Checkbox id="filterProfanity" defaultChecked />
                    <label htmlFor="filterProfanity" className="text-sm">
                      {t('admin.chat.filterProfanity')}
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="filterPersonalInfo" defaultChecked />
                    <label htmlFor="filterPersonalInfo" className="text-sm">
                      {t('admin.chat.filterPersonalInfo')}
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="filterLinks" defaultChecked />
                    <label htmlFor="filterLinks" className="text-sm">
                      {t('admin.chat.filterLinks')}
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="filterSpam" defaultChecked />
                    <label htmlFor="filterSpam" className="text-sm">
                      {t('admin.chat.filterSpam')}
                    </label>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">{t('admin.chat.customWordFilter')}</h3>
                <div className="space-y-3">
                  <div>
                    <label htmlFor="bannedWords" className="text-sm block mb-2">
                      {t('admin.chat.bannedWords')}
                    </label>
                    <textarea
                      id="bannedWords"
                      className="w-full p-3 rounded-md bg-[#081624] border border-gray-700"
                      rows={4}
                      defaultValue="scam, hack, cheat, rigged"
                      placeholder={t('admin.chat.oneWordPerLine')}
                    />
                  </div>
                  <Button className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    {t('admin.chat.saveFilter')}
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default ChatModeration;
