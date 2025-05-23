
import { useState } from 'react';
import { useUsersStore, User } from '@/stores/users';
import { useTranslation } from '@/hooks/useTranslation';
import KycBadge from './KycBadge';
import UserDrawer from './UserDrawer';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface UserTableProps {
  onUserSelect?: (userId: string) => void;
}

const UserTable: React.FC<UserTableProps> = ({ onUserSelect }) => {
  const { t } = useTranslation();
  const { users, filters } = useUsersStore();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  const filteredUsers = users.filter(user => {
    // Filter by search term (alias or email)
    if (filters.searchTerm && !user.alias.toLowerCase().includes(filters.searchTerm.toLowerCase()) && 
        !user.email.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
      return false;
    }
    
    // Filter by country
    if (filters.country && user.country !== filters.country) {
      return false;
    }
    
    // Filter by KYC level
    if (filters.kyc !== undefined && user.kyc !== filters.kyc) {
      return false;
    }
    
    // Filter by banned status
    if (filters.banned !== undefined && user.banned !== filters.banned) {
      return false;
    }
    
    return true;
  });

  const handleUserSelect = (user: User) => {
    if (onUserSelect) {
      onUserSelect(user.id);
    } else {
      setSelectedUser(user);
    }
  };

  return (
    <div className="relative overflow-x-auto rounded-lg border border-emerald/10">
      <Table>
        <TableHeader>
          <TableRow className="bg-[#081624]">
            <TableHead>{t('admin.users.alias')}</TableHead>
            <TableHead className="hidden md:table-cell">{t('admin.users.email')}</TableHead>
            <TableHead className="hidden lg:table-cell">{t('admin.users.country')}</TableHead>
            <TableHead>{t('admin.users.balance')}</TableHead>
            <TableHead>KYC</TableHead>
            <TableHead>{t('admin.users.status')}</TableHead>
            <TableHead className="text-right">{t('admin.users.actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map(user => (
              <TableRow 
                key={user.id}
                className="hover:bg-[#0e2337]"
              >
                <TableCell>{user.alias}</TableCell>
                <TableCell className="hidden md:table-cell">{user.email}</TableCell>
                <TableCell className="hidden lg:table-cell">{user.country}</TableCell>
                <TableCell className="font-mono">${user.balance.toFixed(2)}</TableCell>
                <TableCell><KycBadge level={user.kyc} /></TableCell>
                <TableCell>
                  {user.banned ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-700/20 text-red-400">
                      {t('admin.users.statusBanned')}
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-700/20 text-emerald-400">
                      {t('admin.users.statusActive')}
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-8 w-8 p-0" 
                    onClick={() => handleUserSelect(user)}
                  >
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">{t('admin.users.viewDetails')}</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-10 text-gray-400">
                {t('admin.users.noResults')}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      
      {!onUserSelect && selectedUser && (
        <UserDrawer 
          user={selectedUser} 
          onClose={() => setSelectedUser(null)} 
        />
      )}
    </div>
  );
};

export default UserTable;
