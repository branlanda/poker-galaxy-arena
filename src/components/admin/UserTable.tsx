
import { useState } from 'react';
import { useUsersStore, User } from '@/stores/users';
import { useTranslation } from '@/hooks/useTranslation';
import KycBadge from './KycBadge';
import UserDrawer from './UserDrawer';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const UserTable = () => {
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
    setSelectedUser(user);
  };

  return (
    <div className="relative overflow-x-auto rounded-lg border border-emerald/10">
      <Table>
        <TableHeader>
          <TableRow className="bg-[#081624]">
            <TableHead>{t('admin.users.alias')}</TableHead>
            <TableHead>{t('admin.users.email')}</TableHead>
            <TableHead>{t('admin.users.country')}</TableHead>
            <TableHead>{t('admin.users.balance')}</TableHead>
            <TableHead>KYC</TableHead>
            <TableHead>{t('admin.users.status')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map(user => (
              <TableRow 
                key={user.id}
                className="hover:bg-[#0e2337] cursor-pointer"
                onClick={() => handleUserSelect(user)}
              >
                <TableCell>{user.alias}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.country}</TableCell>
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
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-10 text-gray-400">
                {t('admin.users.noResults')}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      
      {selectedUser && (
        <UserDrawer 
          user={selectedUser} 
          onClose={() => setSelectedUser(null)} 
        />
      )}
    </div>
  );
};

export default UserTable;
