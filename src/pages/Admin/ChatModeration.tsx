
import React, { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Search, 
  MoreHorizontal, 
  Ban, 
  MessageSquare, 
  Eye, 
  Trash2,
  Filter,
  Download
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock chat data
const mockChatMessages = [
  {
    id: '1',
    userId: 'user1',
    username: 'PokerPro21',
    tableId: 'table1',
    tableName: 'Texas Hold\'em - $1/$2',
    message: 'Good game everyone!',
    timestamp: '2025-05-21 14:32:15',
    flagged: false,
    severity: 'low'
  },
  {
    id: '2',
    userId: 'user2',
    username: 'BluffMaster',
    tableId: 'table2',
    tableName: 'Omaha - $2/$5',
    message: 'You are terrible at this game',
    timestamp: '2025-05-21 14:30:42',
    flagged: true,
    severity: 'medium'
  },
  {
    id: '3',
    userId: 'user3',
    username: 'CardShark88',
    tableId: 'table1',
    tableName: 'Texas Hold\'em - $1/$2',
    message: 'Nice hand!',
    timestamp: '2025-05-21 14:28:33',
    flagged: false,
    severity: 'low'
  },
  {
    id: '4',
    userId: 'user4',
    username: 'RiverRat',
    tableId: 'table3',
    tableName: 'Seven Card Stud - $1/$2',
    message: 'This is rigged! Complete garbage site!',
    timestamp: '2025-05-21 14:25:11',
    flagged: true,
    severity: 'high'
  },
  {
    id: '5',
    userId: 'user5',
    username: 'AllInAnnie',
    tableId: 'table2',
    tableName: 'Omaha - $2/$5',
    message: 'Thanks for the fun game',
    timestamp: '2025-05-21 14:22:45',
    flagged: false,
    severity: 'low'
  },
];

const ChatModeration: React.FC = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterFlagged, setFilterFlagged] = useState<boolean | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  
  const filteredMessages = mockChatMessages.filter(message => {
    const matchesSearch = 
      message.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.tableName.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterFlagged === null) return matchesSearch;
    return matchesSearch && message.flagged === filterFlagged;
  });

  const getSeverityBadgeClass = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-500/20 text-red-400';
      case 'medium':
        return 'bg-amber-500/20 text-amber-400';
      case 'low':
        return 'bg-emerald/20 text-emerald';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };
  
  const handleMessageAction = (action: string, messageId: string) => {
    const message = mockChatMessages.find(m => m.id === messageId);
    
    if (!message) return;
    
    switch (action) {
      case 'view':
        toast({
          title: 'Message details',
          description: `Viewing details for message from ${message.username}`,
        });
        break;
      case 'delete':
        setSelectedMessage(messageId);
        break;
      case 'ban':
        toast({
          title: 'User banned',
          description: `${message.username} has been banned from chat`,
        });
        break;
      case 'warn':
        toast({
          title: 'Warning sent',
          description: `Warning sent to ${message.username}`,
        });
        break;
    }
  };
  
  const confirmDeleteMessage = () => {
    if (!selectedMessage) return;
    
    const message = mockChatMessages.find(m => m.id === selectedMessage);
    
    toast({
      title: 'Message deleted',
      description: `Message from ${message?.username} has been deleted`,
    });
    
    setSelectedMessage(null);
  };

  const handleExportLogs = () => {
    toast({
      title: 'Chat logs exported',
      description: 'Chat moderation logs have been exported',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t('admin.chat.title')}</h2>
        
        <Button onClick={handleExportLogs} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          {t('admin.chat.exportLogs')}
        </Button>
      </div>
      
      <Card className="p-4">
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('admin.chat.searchPlaceholder')}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={filterFlagged === true ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterFlagged(filterFlagged === true ? null : true)}
            >
              <Filter className="h-4 w-4 mr-2" />
              {t('admin.chat.flaggedOnly')}
            </Button>
            <Button
              variant={filterFlagged === false ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterFlagged(filterFlagged === false ? null : false)}
            >
              <Filter className="h-4 w-4 mr-2" />
              {t('admin.chat.allMessages')}
            </Button>
          </div>
        </div>
        
        <div className="rounded-md border border-emerald/10 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#081624]">
                <TableHead>{t('admin.chat.timestamp')}</TableHead>
                <TableHead>{t('admin.chat.user')}</TableHead>
                <TableHead>{t('admin.chat.table')}</TableHead>
                <TableHead>{t('admin.chat.message')}</TableHead>
                <TableHead>{t('admin.chat.severity')}</TableHead>
                <TableHead>{t('admin.chat.status')}</TableHead>
                <TableHead className="text-right">{t('admin.chat.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMessages.map(message => (
                <TableRow key={message.id} className="hover:bg-[#0e2337]">
                  <TableCell className="font-mono text-sm">{message.timestamp}</TableCell>
                  <TableCell className="font-medium">{message.username}</TableCell>
                  <TableCell className="text-sm">{message.tableName}</TableCell>
                  <TableCell className="max-w-xs truncate">{message.message}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs uppercase ${getSeverityBadgeClass(message.severity)}`}>
                      {message.severity}
                    </span>
                  </TableCell>
                  <TableCell>
                    {message.flagged ? (
                      <span className="px-2 py-1 rounded-full text-xs bg-red-500/20 text-red-400">
                        {t('admin.chat.flagged')}
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded-full text-xs bg-emerald/20 text-emerald">
                        {t('admin.chat.normal')}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleMessageAction('view', message.id)}>
                          <Eye className="h-4 w-4 mr-2" />
                          {t('admin.chat.viewDetails')}
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem onClick={() => handleMessageAction('warn', message.id)}>
                          <MessageSquare className="h-4 w-4 mr-2" />
                          {t('admin.chat.warnUser')}
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem onClick={() => handleMessageAction('ban', message.id)}>
                          <Ban className="h-4 w-4 mr-2" />
                          {t('admin.chat.banUser')}
                        </DropdownMenuItem>
                        
                        <DropdownMenuSeparator />
                        
                        <DropdownMenuItem 
                          onClick={() => handleMessageAction('delete', message.id)}
                          className="text-red-400 focus:text-red-400"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          {t('admin.chat.deleteMessage')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              
              {filteredMessages.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    {t('admin.chat.noMessages')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
      
      <AlertDialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('admin.chat.confirmDelete')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('admin.chat.confirmDeleteDescription')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('admin.chat.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteMessage} className="bg-red-500 hover:bg-red-600">
              {t('admin.chat.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ChatModeration;
