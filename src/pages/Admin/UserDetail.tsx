
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUsersStore } from '@/stores/users';
import { useTranslation } from '@/hooks/useTranslation';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/Button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Ban, Check, ArrowLeft, Shield, Download, FileText, Activity, MessageCircle } from 'lucide-react';
import KycBadge from '@/components/admin/KycBadge';
import { useToast } from '@/hooks/use-toast';
import { useAdmin } from '@/hooks/useAdmin';

const UserDetail = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { toast } = useToast();
  const { fetchUserById, selectedUser, banUser, unbanUser, approveKyc, resetUserFunds } = useUsersStore();
  const { canPerformAction, createAuditLog } = useAdmin();
  const [isResettingFunds, setIsResettingFunds] = useState(false);
  
  useEffect(() => {
    if (userId) {
      fetchUserById(userId);
    }
  }, [userId, fetchUserById]);
  
  if (!selectedUser) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-emerald"></div>
      </div>
    );
  }
  
  const handleBack = () => {
    navigate('/admin/users');
  };
  
  const handleBan = async () => {
    if (!selectedUser) return;
    
    await banUser(selectedUser.id);
    createAuditLog('BAN_USER', `User ${selectedUser.alias} (${selectedUser.id}) banned`, { userId: selectedUser.id });
  };
  
  const handleUnban = async () => {
    if (!selectedUser) return;
    
    await unbanUser(selectedUser.id);
    createAuditLog('UNBAN_USER', `User ${selectedUser.alias} (${selectedUser.id}) unbanned`, { userId: selectedUser.id });
  };
  
  const handleApproveKyc = async () => {
    if (!selectedUser) return;
    
    await approveKyc(selectedUser.id);
    createAuditLog('APPROVE_KYC', `KYC approved for user ${selectedUser.alias} (${selectedUser.id})`, { userId: selectedUser.id });
  };
  
  const handleResetFunds = async () => {
    if (!selectedUser) return;
    
    setIsResettingFunds(true);
    try {
      await resetUserFunds(selectedUser.id);
      createAuditLog('RESET_FUNDS', `Funds reset for user ${selectedUser.alias} (${selectedUser.id})`, { userId: selectedUser.id });
      toast({
        title: t('admin.users.fundsReset'),
        description: t('admin.users.fundsResetDescription'),
      });
    } finally {
      setIsResettingFunds(false);
    }
  };
  
  const handleExportUserData = () => {
    // In a real app, this would trigger an export of user data
    toast({
      title: t('admin.users.dataExported'),
      description: t('admin.users.dataExportedDescription'),
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={handleBack} 
          className="flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          {t('admin.back')}
        </Button>
        
        <h1 className="text-2xl font-bold">{t('admin.users.userDetail')}</h1>
        
        <div className="flex gap-2">
          {canPerformAction('moderator') && (
            <Download 
              className="h-5 w-5 text-gray-400 cursor-pointer hover:text-white" 
              onClick={handleExportUserData}
            />
          )}
        </div>
      </div>
      
      <Card className="p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <Avatar className="h-20 w-20">
            <AvatarImage src={`https://api.dicebear.com/7.x/shapes/svg?seed=${selectedUser.id}`} />
            <AvatarFallback>
              {selectedUser.alias.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold">{selectedUser.alias}</h2>
              {selectedUser.banned && (
                <Badge variant="destructive">
                  {t('admin.users.statusBanned')}
                </Badge>
              )}
              <KycBadge level={selectedUser.kyc} size="md" />
            </div>
            
            <p className="text-gray-400">{selectedUser.email}</p>
            
            <div className="flex gap-2 flex-wrap">
              <Badge variant="outline">{selectedUser.country}</Badge>
              <Badge variant="outline">{t('admin.users.registerDate')}: {new Date(selectedUser.registeredAt).toLocaleDateString()}</Badge>
              {selectedUser.lastLoginAt && (
                <Badge variant="outline">{t('admin.users.lastLogin')}: {new Date(selectedUser.lastLoginAt).toLocaleDateString()}</Badge>
              )}
            </div>
          </div>
          
          <div className="flex flex-col md:items-end gap-2">
            <div className="text-right">
              <div className="text-sm text-gray-400">{t('admin.users.balance')}</div>
              <div className="text-2xl font-mono">${selectedUser.balance.toFixed(2)}</div>
            </div>
            
            <div className="flex gap-2">
              {canPerformAction('moderator') && selectedUser.kyc < 3 && (
                <Button 
                  variant="primary" 
                  size="sm" 
                  onClick={handleApproveKyc}
                  className="flex items-center gap-2"
                >
                  <Check className="h-4 w-4" />
                  {t('admin.users.approveKyc')}
                </Button>
              )}
              
              {canPerformAction('superadmin') && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-2"
                    >
                      <Shield className="h-4 w-4" />
                      {t('admin.users.resetFunds')}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t('admin.users.resetFundsConfirm')}</AlertDialogTitle>
                      <AlertDialogDescription>
                        {t('admin.users.resetFundsWarning')}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{t('admin.cancel')}</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleResetFunds}
                        disabled={isResettingFunds}
                      >
                        {isResettingFunds ? t('admin.users.resetting') : t('admin.users.resetFunds')}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
              
              {canPerformAction('moderator') && (
                selectedUser.banned ? (
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    onClick={handleUnban}
                    className="flex items-center gap-2"
                  >
                    <Check className="h-4 w-4" />
                    {t('admin.users.unban')}
                  </Button>
                ) : (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="accent" 
                        size="sm" 
                        className="flex items-center gap-2"
                      >
                        <Ban className="h-4 w-4" />
                        {t('admin.users.ban')}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>{t('admin.users.banConfirm')}</AlertDialogTitle>
                        <AlertDialogDescription>
                          {t('admin.users.banWarning')}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>{t('admin.cancel')}</AlertDialogCancel>
                        <AlertDialogAction onClick={handleBan}>{t('admin.users.ban')}</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )
              )}
            </div>
          </div>
        </div>
      </Card>
      
      <Tabs defaultValue="activity" className="w-full">
        <TabsList>
          <TabsTrigger value="activity">
            <Activity className="h-4 w-4 mr-2" />
            {t('admin.users.activityTab')}
          </TabsTrigger>
          <TabsTrigger value="transactions">
            <FileText className="h-4 w-4 mr-2" />
            {t('admin.users.transactionsTab')}
          </TabsTrigger>
          <TabsTrigger value="chat">
            <MessageCircle className="h-4 w-4 mr-2" />
            {t('admin.users.chatHistoryTab')}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="activity" className="mt-4">
          <Card className="p-6 space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">{t('admin.users.recentGames')}</h3>
              <div className="space-y-2">
                <div className="bg-[#0e2337] p-3 rounded-lg flex justify-between">
                  <div>
                    <p className="font-medium">Texas Hold'em - $1/$2</p>
                    <p className="text-xs text-gray-400">2 hours ago</p>
                  </div>
                  <div className="text-sm">
                    <p className="text-emerald">+$120.50</p>
                  </div>
                </div>
                <div className="bg-[#0e2337] p-3 rounded-lg flex justify-between">
                  <div>
                    <p className="font-medium">Omaha - $2/$5</p>
                    <p className="text-xs text-gray-400">Yesterday</p>
                  </div>
                  <div className="text-sm">
                    <p className="text-red-400">-$85.25</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">{t('admin.users.loginHistory')}</h3>
              <div className="space-y-2">
                <div className="bg-[#0e2337] p-3 rounded-lg">
                  <div className="flex justify-between">
                    <div>
                      <p>Today, 14:32</p>
                      <p className="text-xs text-gray-400">Success</p>
                    </div>
                    <div className="text-sm text-gray-400">
                      192.168.1.1
                    </div>
                  </div>
                </div>
                <div className="bg-[#0e2337] p-3 rounded-lg">
                  <div className="flex justify-between">
                    <div>
                      <p>Yesterday, 09:15</p>
                      <p className="text-xs text-gray-400">Success</p>
                    </div>
                    <div className="text-sm text-gray-400">
                      192.168.1.1
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="transactions" className="mt-4">
          <Card className="p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">{t('admin.users.transactionHistory')}</h3>
              <div className="space-y-2">
                <div className="bg-[#0e2337] p-3 rounded-lg">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-emerald">+$100.00</p>
                      <p className="text-xs text-gray-400">Deposit</p>
                    </div>
                    <p className="text-xs text-gray-400">May 21, 2025</p>
                  </div>
                </div>
                <div className="bg-[#0e2337] p-3 rounded-lg">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-red-400">-$25.00</p>
                      <p className="text-xs text-gray-400">Withdraw</p>
                    </div>
                    <p className="text-xs text-gray-400">May 19, 2025</p>
                  </div>
                </div>
                <div className="bg-[#0e2337] p-3 rounded-lg">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-emerald">+$50.00</p>
                      <p className="text-xs text-gray-400">Deposit</p>
                    </div>
                    <p className="text-xs text-gray-400">May 15, 2025</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="chat" className="mt-4">
          <Card className="p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">{t('admin.users.chatHistory')}</h3>
              <div className="space-y-2">
                <div className="bg-[#0e2337] p-3 rounded-lg">
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between">
                      <p>Texas Hold'em - $1/$2</p>
                      <p className="text-xs text-gray-400">Today, 14:32</p>
                    </div>
                    <p className="text-sm">"Good game everyone, thanks for playing!"</p>
                  </div>
                </div>
                <div className="bg-[#0e2337] p-3 rounded-lg">
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between">
                      <p>Omaha - $2/$5</p>
                      <p className="text-xs text-gray-400">Yesterday, 20:15</p>
                    </div>
                    <p className="text-sm">"Nice hand!"</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserDetail;
