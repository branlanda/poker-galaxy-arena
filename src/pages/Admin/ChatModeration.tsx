import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, Flag, Shield, UserX, CheckCircle, MessageSquare } from 'lucide-react';

interface ChatMessage {
  id: string;
  user_id: string;
  username: string;
  message: string;
  created_at: string;
  reported: boolean;
  is_flagged: boolean;
}

interface ReportedMessage extends ChatMessage {
  reporter_id: string;
  reporter_name: string;
  reason: string;
  report_date: string;
  status: 'pending' | 'resolved' | 'dismissed';
}

interface FilteredWord {
  id: string;
  word: string;
  severity: 'low' | 'medium' | 'high';
  created_at: string;
}

export default function ChatModeration() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('reports');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [reportedMessages, setReportedMessages] = useState<ReportedMessage[]>([]);
  const [filteredWords, setFilteredWords] = useState<FilteredWord[]>([]);
  const [loading, setLoading] = useState(true);
  const [newFilteredWord, setNewFilteredWord] = useState('');
  const [newFilteredWordSeverity, setNewFilteredWordSeverity] = useState<'low' | 'medium' | 'high'>('medium');

  useEffect(() => {
    fetchReportedMessages();
    fetchFilteredWords();
    fetchRecentMessages();
  }, []);

  async function fetchReportedMessages() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('message_reports')
        .select(`
          id,
          reported_message_id,
          reporter_id,
          reason,
          status,
          created_at,
          users:reporter_id (username),
          reported_messages:reported_message_id (
            id,
            user_id,
            message,
            created_at,
            users:user_id (username)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform the data to match the ReportedMessage interface
      const transformedData: ReportedMessage[] = (data || []).map((report: any) => ({
        id: report.reported_message_id,
        user_id: report.reported_messages?.user_id || '',
        username: report.reported_messages?.users?.username || 'Unknown',
        message: report.reported_messages?.message || '',
        created_at: report.reported_messages?.created_at || '',
        reported: true,
        is_flagged: true,
        reporter_id: report.reporter_id,
        reporter_name: report.users?.username || 'Unknown',
        reason: report.reason,
        report_date: report.created_at,
        status: report.status
      }));

      setReportedMessages(transformedData);
    } catch (error) {
      console.error('Error fetching reported messages:', error);
      toast({
        title: 'Error',
        description: 'Could not load reported messages',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  async function fetchFilteredWords() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('filtered_words')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFilteredWords(data || []);
    } catch (error) {
      console.error('Error fetching filtered words:', error);
      toast({
        title: 'Error',
        description: 'Could not load filtered words',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  async function fetchRecentMessages() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('chat_messages')
        .select(`
          id,
          user_id,
          message,
          created_at,
          is_flagged,
          users:user_id (username)
        `)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      // Transform the data to match the ChatMessage interface
      const transformedData: ChatMessage[] = (data || []).map((message: any) => ({
        id: message.id,
        user_id: message.user_id,
        username: message.users?.username || 'Unknown',
        message: message.message,
        created_at: message.created_at,
        reported: false,
        is_flagged: message.is_flagged || false
      }));

      setMessages(transformedData);
    } catch (error) {
      console.error('Error fetching recent messages:', error);
      toast({
        title: 'Error',
        description: 'Could not load recent messages',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  async function addFilteredWord() {
    if (!newFilteredWord.trim()) return;
    
    try {
      const { data, error } = await supabase
        .from('filtered_words')
        .insert({
          word: newFilteredWord.toLowerCase().trim(),
          severity: newFilteredWordSeverity
        })
        .select();

      if (error) throw error;
      
      setFilteredWords([...filteredWords, data[0]]);
      setNewFilteredWord('');
      
      toast({
        title: 'Word Added',
        description: `"${newFilteredWord}" has been added to the filtered list`,
      });
    } catch (error) {
      console.error('Error adding filtered word:', error);
      toast({
        title: 'Error',
        description: 'Could not add the filtered word',
        variant: 'destructive',
      });
    }
  }

  async function removeFilteredWord(id: string, word: string) {
    try {
      const { error } = await supabase
        .from('filtered_words')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setFilteredWords(filteredWords.filter(w => w.id !== id));
      
      toast({
        title: 'Word Removed',
        description: `"${word}" has been removed from the filtered list`,
      });
    } catch (error) {
      console.error('Error removing filtered word:', error);
      toast({
        title: 'Error',
        description: 'Could not remove the filtered word',
        variant: 'destructive',
      });
    }
  }

  async function handleReportResolution(reportId: string, status: 'resolved' | 'dismissed') {
    try {
      const { error } = await supabase
        .from('message_reports')
        .update({ status })
        .eq('id', reportId);

      if (error) throw error;
      
      // Update UI
      setReportedMessages(prev => 
        prev.map(message => 
          message.id === reportId ? { ...message, status } : message
        )
      );
      
      toast({
        title: 'Report Updated',
        description: `Report has been marked as ${status}`,
      });
    } catch (error) {
      console.error('Error updating report status:', error);
      toast({
        title: 'Error',
        description: 'Could not update the report status',
        variant: 'destructive',
      });
    }
  }

  async function banUser(userId: string, username: string) {
    try {
      // This would call a server function to ban the user
      const { error } = await supabase.functions.invoke('ban-user', {
        body: { userId }
      });

      if (error) throw error;
      
      toast({
        title: 'User Banned',
        description: `${username} has been banned from chat`,
      });
    } catch (error) {
      console.error('Error banning user:', error);
      toast({
        title: 'Error',
        description: 'Could not ban the user',
        variant: 'destructive',
      });
    }
  }

  async function deleteMessage(messageId: string) {
    try {
      const { error } = await supabase
        .from('chat_messages')
        .delete()
        .eq('id', messageId);

      if (error) throw error;
      
      // Update UI by removing the message from both lists
      setMessages(prev => prev.filter(m => m.id !== messageId));
      setReportedMessages(prev => prev.filter(m => m.id !== messageId));
      
      toast({
        title: 'Message Deleted',
        description: 'The message has been deleted',
      });
    } catch (error) {
      console.error('Error deleting message:', error);
      toast({
        title: 'Error',
        description: 'Could not delete the message',
        variant: 'destructive',
      });
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Chat Moderation</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="reports">
            <Flag className="mr-2 h-4 w-4" />
            Reported Messages
            {reportedMessages.filter(m => m.status === 'pending').length > 0 && (
              <Badge className="ml-2 bg-red-500">{reportedMessages.filter(m => m.status === 'pending').length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="messages">
            <MessageSquare className="mr-2 h-4 w-4" />
            Recent Messages
          </TabsTrigger>
          <TabsTrigger value="filters">
            <Shield className="mr-2 h-4 w-4" />
            Word Filters
          </TabsTrigger>
        </TabsList>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Reported Messages</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <div className="flex justify-center p-8">
                  <div className="animate-spin h-8 w-8 border-4 border-emerald border-t-transparent rounded-full"></div>
                </div>
              ) : reportedMessages.length === 0 ? (
                <div className="text-center p-8 text-gray-500">
                  No reported messages found.
                </div>
              ) : (
                reportedMessages.map(report => (
                  <Card key={report.id + report.reporter_id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex justify-between">
                        <div>
                          <div className="flex items-center mb-2">
                            <span className="font-semibold">{report.username}</span>
                            <Badge className={`ml-2 ${
                              report.status === 'pending' ? 'bg-yellow-500' : 
                              report.status === 'resolved' ? 'bg-green-500' : 'bg-gray-500'
                            }`}>
                              {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                            </Badge>
                          </div>
                          <p className="bg-gray-100 dark:bg-gray-800 p-2 rounded">{report.message}</p>
                          <div className="mt-2 text-sm text-gray-500">
                            <span>Reported by {report.reporter_name} • {new Date(report.report_date).toLocaleString()}</span>
                          </div>
                          <div className="mt-1 flex items-center">
                            <AlertTriangle className="h-4 w-4 text-yellow-500 mr-1" />
                            <span className="text-sm font-medium">Reason: {report.reason}</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-col space-y-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleReportResolution(report.id, 'resolved')}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Resolve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => deleteMessage(report.id)}
                          >
                            Delete Message
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => banUser(report.user_id, report.username)}
                          >
                            <UserX className="h-4 w-4 mr-1" />
                            Ban User
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages">
          {/* Similar structure for recent messages tab */}
        </TabsContent>

        <TabsContent value="filters">
          <Card>
            <CardHeader>
              <CardTitle>Filtered Words</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2 mb-4">
                <Input 
                  placeholder="Add word to filter..." 
                  value={newFilteredWord}
                  onChange={(e) => setNewFilteredWord(e.target.value)}
                  className="max-w-sm"
                />
                <select 
                  className="border rounded px-3 py-1"
                  value={newFilteredWordSeverity}
                  onChange={(e) => setNewFilteredWordSeverity(e.target.value as 'low' | 'medium' | 'high')}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                <Button onClick={addFilteredWord}>Add</Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {filteredWords.map(word => (
                  <div key={word.id} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center">
                      <span className="font-mono">{word.word}</span>
                      <Badge className={`ml-2 ${
                        word.severity === 'high' ? 'bg-red-500' : 
                        word.severity === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                      }`}>
                        {word.severity}
                      </Badge>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => removeFilteredWord(word.id, word.word)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
