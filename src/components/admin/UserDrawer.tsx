
import { User, useUsersStore } from '@/stores/users';
import { useTranslation } from '@/hooks/useTranslation';
import KycBadge from './KycBadge';
import { Button } from '@/components/ui/Button';
import { X, Check, Ban, Flag } from 'lucide-react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';

interface UserDrawerProps {
  user: User;
  onClose: () => void;
}

const UserDrawer = ({ user, onClose }: UserDrawerProps) => {
  const { t } = useTranslation();
  const { banUser, unbanUser, approveKyc } = useUsersStore();
  
  const handleBan = () => {
    banUser(user.id);
    // In a real app, we would make an API call here
    console.log(`Banned user ${user.id}`);
  };
  
  const handleUnban = () => {
    unbanUser(user.id);
    // In a real app, we would make an API call here
    console.log(`Unbanned user ${user.id}`);
  };
  
  const handleApproveKyc = () => {
    approveKyc(user.id);
    // In a real app, we would make an API call here
    console.log(`Approved KYC for user ${user.id}`);
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
        
        <div className="p-6 space-y-6">
          <div className="space-y-4">
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
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-medium">{t('admin.users.documents')}</h3>
            <div className="grid grid-cols-2 gap-3">
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
          
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            {user.kyc < 3 && (
              <Button
                variant="primary"
                onClick={handleApproveKyc}
                className="flex items-center justify-center gap-2"
              >
                <Check className="h-4 w-4" />
                {t('admin.users.approve')}
              </Button>
            )}
            
            {user.banned ? (
              <Button
                variant="secondary"
                onClick={handleUnban}
                className="flex items-center justify-center gap-2"
              >
                <Check className="h-4 w-4" />
                {t('admin.users.unban')}
              </Button>
            ) : (
              <Button
                variant="accent"
                onClick={handleBan}
                className="flex items-center justify-center gap-2"
              >
                <Ban className="h-4 w-4" />
                {t('admin.users.ban')}
              </Button>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default UserDrawer;
