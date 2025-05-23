import React, { useState, useEffect } from 'react';
import { useAuth } from '@/stores/auth';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { supabase } from '@/lib/supabase';

interface ChatMessage {
  id: string;
  player_id: string;
  message: string;
  created_at: string;
  channel_id: string;
  player_name?: string;
  player_avatar?: string;
}

const ChatModeration = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedChannel, setSelectedChannel] = useState('global');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      fetchMessages(selectedChannel);
    }
  }, [user, navigate, selectedChannel]);

  const fetchMessages = async (channelId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('channel_id', channelId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setMessages(data || []);
    } catch (error: any) {
      toast({
        title: t('error'),
        description: t('failedToLoadMessages', { message: error.message }),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteMessage = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('chat_messages')
        .delete()
        .eq('id', messageId);

      if (error) throw error;

      setMessages(messages.filter(msg => msg.id !== messageId));
      toast({
        title: t('success'),
        description: t('messageDeleted'),
      });
    } catch (error: any) {
      toast({
        title: t('error'),
        description: t('failedToDeleteMessage', { message: error.message }),
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4 text-white">{t('chatModeration')}</h1>

      <div className="mb-4">
        <Select value={selectedChannel} onValueChange={setSelectedChannel}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t('selectChannel')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="global">{t('globalChannel')}</SelectItem>
            {/* Add more channels as needed */}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">{t('loadingMessages')}</p>
      ) : (
        <Table>
          <TableCaption>{t('chatMessages')}</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">{t('author')}</TableHead>
              <TableHead>{t('message')}</TableHead>
              <TableHead className="text-right">{t('actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {messages.map((msg) => (
              <TableRow key={msg.id}>
                <TableCell className="font-medium">{msg.player_name || msg.player_id}</TableCell>
                <TableCell>{msg.message}</TableCell>
                <TableCell className="text-right">
                  <Button variant="destructive" size="sm" onClick={() => deleteMessage(msg.id)}>
                    {t('delete')}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default ChatModeration;
