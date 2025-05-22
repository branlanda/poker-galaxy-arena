
import { User, useUsersStore } from '@/stores/users';
import { useTranslation } from '@/hooks/useTranslation';
import KycBadge from './KycBadge';
import { Button } from '@/components/ui/Button';
import { X, Check, Ban, Flag, AlertTriangle, Shield, Download, Eye } from 'lucide-react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from '@/components/ui/drawer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface UserDrawerProps {
  user: User;
  onClose: () => void;
}

const UserDrawer = ({ user, onClose }: UserDrawerProps) => {
  const { t } = useTranslation();
  const { banUser, unbanUser, approveKyc } = useUsersStore();
  const { toast } = useToast();
  const [isResetting, setIsResetting] = useState(false);
  
  const handleBan = () => {
    banUser(user.id);
    toast({
      title: t('admin.users.userBanned'),
      description: t('admin.users.userBannedDescription'),
    });
  };
  
  const handleUnban = () => {
    unbanUser(user.id);
    toast({
      title: t('admin.users.userUnbanned'),
      description: t('admin.users.userUnbannedDescription'),
    });
  };
  
  const handleApproveKyc = () => {
    approveKyc(user.id);
    toast({
      title: t('admin.users.kycApproved'),
      description: t('admin.users.kycApprovedDescription'),
    });
  };

  const handleResetFunds = () => {
    setIsResetting(true);
    // In a real app, we would make an API call here
    setTimeout(() => {
      setIsResetting(false);
      toast({
        title: t('admin.users.fundsReset'),
        description: t('admin.users.fundsResetDescription'),
      });
    }, 1000);
  };

  const handleExportUserData = () => {
    // In a real app, we would trigger an export here
    toast({
      title: t('admin.users.dataExported'),
      description: t('admin.users.dataExportedDescription'),
    });
  };
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  return (
    <Drawer open={true} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <DrawerContent className="bg-[#081624] text-gray-100">
        <DrawerHeader>
          <div className="flex items-center justify-between">
            <DrawerTitle className="text-xl text-white">{user.alias}</DrawerTitle>
            <DrawerClose asChild>
              <button className="rounded-full p-1 hover:bg-navy">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </button>
            </DrawerClose>
          </div>
        </DrawerHeader>
        
        <div className="px-6">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="profile">{t('admin.users.profileTab')}</TabsTrigger>
              <TabsTrigger value="transactions">{t('admin.users.transactionsTab')}</TabsTrigger>
              <TabsTrigger value="activity">{t('admin.users.activityTab')}</TabsTrigger>
              <TabsTrigger value="moderation">{t('admin.users.moderationTab')}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="space-y-4">
              <div className="flex justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-gray-400">{t('admin.users.email')}</p>
                  <p>{user.email}</p>
                </div>
                <KycBadge level={user.kyc} size="md" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-gray-400">{t('admin.users.country')}</p>
                  <p>{user.country}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-400">{t('admin.users.balance')}</p>
                  <p className="font-mono">${user.balance.toFixed(2)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-400">{t('admin.users.registerDate')}</p>
                  <p>{formatDate(user.registeredAt)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-400">{t('admin.users.status')}</p>
                  {user.banned ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-700/20 text-red-400">
                      {t('admin.users.statusBanned')}
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-700/20 text-emerald-400">
                      {t('admin.users.statusActive')}
                    </span>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="transactions">
              <div className="text-sm">
                <div className="bg-[#0e2337] p-3 rounded-lg mb-2">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-emerald">+$100.00</p>
                      <p className="text-xs text-gray-400">Deposit</p>
                    </div>
                    <p className="text-xs text-gray-400">May 21, 2025</p>
                  </div>
                </div>
                <div className="bg-[#0e2337] p-3 rounded-lg mb-2">
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
            </TabsContent>
            
            <TabsContent value="activity">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-400">Recent Tables</h3>
                  <div className="grid gap-2">
                    <div className="bg-[#0e2337] p-3 rounded-lg flex justify-between">
                      <div>
                        <p className="font-medium">Texas Hold'em - $1/$2</p>
                        <p className="text-xs text-gray-400">2 hours ago</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View</span>
                      </Button>
                    </div>
                    <div className="bg-[#0e2337] p-3 rounded-lg flex justify-between">
                      <div>
                        <p className="font-medium">Omaha - $2/$5</p>
                        <p className="text-xs text-gray-400">Yesterday</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View</span>
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-400">Login History</h3>
                  <div className="grid gap-2">
                    <div className="bg-[#0e2337] p-2 rounded-lg text-sm">
                      <p>Today, 14:32 - 192.168.1.1</p>
                    </div>
                    <div className="bg-[#0e2337] p-2 rounded-lg text-sm">
                      <p>May 20, 2025, 09:15 - 192.168.1.1</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="moderation">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-400">Reported Messages</h3>
                  <div className="bg-[#0e2337] p-3 rounded-lg">
                    <p className="text-sm">No reported messages</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-400">Chat Filters</h3>
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      id="chat-filter" 
                      className="rounded bg-navy border-gray-600" 
                      defaultChecked 
                    />
                    <label htmlFor="chat-filter" className="text-sm">
                      Apply standard chat filter
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      id="strict-filter" 
                      className="rounded bg-navy border-gray-600" 
                    />
                    <label htmlFor="strict-filter" className="text-sm">
                      Apply strict chat filter
                    </label>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-400">Fraud Detection</h3>
                  <div className="bg-[#0e2337] p-3 rounded-lg flex items-center gap-3">
                    <Shield className="h-5 w-5 text-emerald" />
                    <div>
                      <p className="text-sm font-medium">No suspicious activity detected</p>
                      <p className="text-xs text-gray-400">Last scan: Today, 12:30</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="space-y-2 mt-3">
          <div className="space-y-4">
            <h3 className="text-lg font-medium px-6">{t('admin.users.documents')}</h3>
            <div className="grid grid-cols-2 gap-3 px-6">
              <div className="aspect-[4/3] bg-[#0e2337] rounded-lg flex items-center justify-center">
                <Flag className="h-8 w-8 text-gray-600" />
                <span className="sr-only">ID Front</span>
              </div>
              <div className="aspect-[4/3] bg-[#0e2337] rounded-lg flex items-center justify-center">
                <Flag className="h-8 w-8 text-gray-600" />
                <span className="sr-only">ID Back</span>
              </div>
              <div className="aspect-[4/3] bg-[#0e2337] rounded-lg flex items-center justify-center">
                <Flag className="h-8 w-8 text-gray-600" />
                <span className="sr-only">Proof of Address</span>
              </div>
              <div className="aspect-[4/3] bg-[#0e2337] rounded-lg flex items-center justify-center">
                <Flag className="h-8 w-8 text-gray-600" />
                <span className="sr-only">Selfie</span>
              </div>
            </div>
          </div>
        </div>
        
        <DrawerFooter className="border-t border-emerald/10 pt-4">
          <div className="flex flex-wrap gap-2 justify-between">
            <div className="flex flex-wrap gap-2">
              {user.kyc < 3 && (
                <Button
                  variant="primary"
                  onClick={handleApproveKyc}
                  size="sm"
                  className="flex items-center justify-center gap-2"
                >
                  <Check className="h-4 w-4" />
                  {t('admin.users.approve')}
                </Button>
              )}
              
              <Button
                variant="outline"
                onClick={handleResetFunds}
                size="sm"
                disabled={isResetting}
                className="flex items-center justify-center gap-2"
              >
                {isResetting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-emerald border-t-transparent" />
                    {t('admin.users.resetting')}
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-4 w-4" />
                    {t('admin.users.resetFunds')}
                  </>
                )}
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={handleExportUserData}
                size="sm"
                className="flex items-center justify-center gap-2"
              >
                <Download className="h-4 w-4" />
                {t('admin.users.export')}
              </Button>
              
              {user.banned ? (
                <Button
                  variant="secondary"
                  onClick={handleUnban}
                  size="sm"
                  className="flex items-center justify-center gap-2"
                >
                  <Check className="h-4 w-4" />
                  {t('admin.users.unban')}
                </Button>
              ) : (
                <Button
                  variant="accent"
                  onClick={handleBan}
                  size="sm"
                  className="flex items-center justify-center gap-2"
                >
                  <Ban className="h-4 w-4" />
                  {t('admin.users.ban')}
                </Button>
              )}
            </div>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default UserDrawer;
