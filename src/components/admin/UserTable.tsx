
import { useState } from 'react';
import { useUsersStore, User } from '@/stores/users';
import { useTranslation } from '@/hooks/useTranslation';
import KycBadge from './KycBadge';
import UserDrawer from './UserDrawer';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
    if (filters.kycLevel && user.kycLevel !== filters.kycLevel) {
      return false;
    }
    
    return true;
  });

  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('admin.users.alias')}</TableHead>
              <TableHead>{t('admin.users.email')}</TableHead>
              <TableHead>{t('admin.users.country')}</TableHead>
              <TableHead>{t('admin.users.kyc')}</TableHead>
              <TableHead>{t('admin.users.joinDate')}</TableHead>
              <TableHead>{t('admin.users.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.alias}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.country}</TableCell>
                <TableCell>
                  <KycBadge level={user.kycLevel} />
                </TableCell>
                <TableCell>
                  {new Date(user.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedUser(user)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {onUserSelect && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onUserSelect(user.id)}
                      >
                        {t('admin.users.select')}
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedUser && (
        <UserDrawer
          user={selectedUser}
          open={!!selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </>
  );
};

export default UserTable;
