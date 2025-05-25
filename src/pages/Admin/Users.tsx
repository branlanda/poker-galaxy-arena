
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '@/hooks/useTranslation';
import { useUserMocks } from '@/hooks/useUserMocks';
import UserTable from '@/components/admin/UserTable';
import { useUsersStore } from '@/stores/users';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, UserPlus, Download, FileText } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

const Users = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  useUserMocks();
  const { users, filters, userStats, setFilters, fetchUsers } = useUsersStore();
  const [searchTerm, setSearchTerm] = useState(filters.searchTerm || '');
  
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers, filters]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setFilters({ searchTerm: value });
  };
  
  const handleUserDetail = (userId: string) => {
    navigate(`/admin/users/${userId}`);
  };
  
  const handleExportUsers = () => {
    // In a real app, this would trigger a CSV export
    // For now, we'll just log the action
    console.log('Exporting users...');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t('admin.sidebar.users')}</h2>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleExportUsers}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            {t('admin.users.export')}
          </Button>
          
          <Button className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            {t('admin.users.addUser')}
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-[#0e2337]">
          <div className="text-gray-400 text-sm mb-1">{t('admin.users.totalUsers')}</div>
          <div className="text-2xl font-bold">{userStats.total}</div>
        </Card>
        
        <Card className="p-4 bg-[#0e2337]">
          <div className="text-gray-400 text-sm mb-1">{t('admin.users.activeUsers')}</div>
          <div className="text-2xl font-bold text-emerald">{userStats.active}</div>
        </Card>
        
        <Card className="p-4 bg-[#0e2337]">
          <div className="text-gray-400 text-sm mb-1">{t('admin.users.bannedUsers')}</div>
          <div className="text-2xl font-bold text-red-400">{userStats.banned}</div>
        </Card>
        
        <Card className="p-4 bg-[#0e2337]">
          <div className="text-gray-400 text-sm mb-1">{t('admin.users.kycPending')}</div>
          <div className="text-2xl font-bold text-amber-400">{userStats.kycPending}</div>
        </Card>
      </div>
      
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder={t('admin.users.search')}
              className="bg-[#0e2337] border border-emerald/10 rounded-lg py-2 pl-10 pr-3 w-full text-sm"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Select 
              value={filters.country || ''}
              onValueChange={value => setFilters({ country: value || undefined })}
            >
              <SelectTrigger className="bg-[#0e2337] border border-emerald/10 rounded-lg px-3 py-2 text-sm w-[180px]">
                <SelectValue placeholder={t('admin.users.allCountries')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">{t('admin.users.allCountries')}</SelectItem>
                <SelectItem value="US">United States</SelectItem>
                <SelectItem value="BR">Brazil</SelectItem>
                <SelectItem value="CO">Colombia</SelectItem>
                <SelectItem value="MX">Mexico</SelectItem>
                <SelectItem value="ES">Spain</SelectItem>
              </SelectContent>
            </Select>
            
            <Select 
              value={filters.kyc !== undefined ? String(filters.kyc) : ''}
              onValueChange={value => setFilters({ kyc: value === '' ? undefined : Number(value) as 0|1|2|3 })}
            >
              <SelectTrigger className="bg-[#0e2337] border border-emerald/10 rounded-lg px-3 py-2 text-sm w-[180px]">
                <SelectValue placeholder={t('admin.users.anyKyc')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">{t('admin.users.anyKyc')}</SelectItem>
                <SelectItem value="0">KYC 0</SelectItem>
                <SelectItem value="1">KYC 1</SelectItem>
                <SelectItem value="2">KYC 2</SelectItem>
                <SelectItem value="3">KYC 3</SelectItem>
              </SelectContent>
            </Select>
            
            <Select 
              value={filters.banned !== undefined ? (filters.banned ? 'banned' : 'active') : ''}
              onValueChange={value => setFilters({ banned: value === 'banned' ? true : value === 'active' ? false : undefined })}
            >
              <SelectTrigger className="bg-[#0e2337] border border-emerald/10 rounded-lg px-3 py-2 text-sm w-[180px]">
                <SelectValue placeholder={t('admin.users.allStatus')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">{t('admin.users.allStatus')}</SelectItem>
                <SelectItem value="active">{t('admin.users.statusActive')}</SelectItem>
                <SelectItem value="banned">{t('admin.users.statusBanned')}</SelectItem>
              </SelectContent>
            </Select>
            
            {(filters.searchTerm || filters.country || filters.kyc !== undefined || filters.banned !== undefined) && (
              <Button 
                variant="ghost" 
                onClick={() => setFilters({})}
                className="text-sm"
              >
                {t('admin.users.clearFilters')}
              </Button>
            )}
          </div>
        </div>
        
        <div className="flex gap-2 mb-4">
          {filters.country && (
            <Badge 
              variant="outline" 
              className="flex items-center gap-1"
            >
              {t('admin.users.country')}: {filters.country}
              <button 
                className="ml-1 text-gray-400 hover:text-white"
                onClick={() => setFilters({ country: undefined })}
              >
                &times;
              </button>
            </Badge>
          )}
          
          {filters.kyc !== undefined && (
            <Badge 
              variant="outline" 
              className="flex items-center gap-1"
            >
              KYC: {filters.kyc}
              <button 
                className="ml-1 text-gray-400 hover:text-white"
                onClick={() => setFilters({ kyc: undefined })}
              >
                &times;
              </button>
            </Badge>
          )}
          
          {filters.banned !== undefined && (
            <Badge 
              variant="outline" 
              className="flex items-center gap-1"
            >
              {filters.banned ? t('admin.users.statusBanned') : t('admin.users.statusActive')}
              <button 
                className="ml-1 text-gray-400 hover:text-white"
                onClick={() => setFilters({ banned: undefined })}
              >
                &times;
              </button>
            </Badge>
          )}
        </div>
        
        <UserTable onUserSelect={handleUserDetail} />
      </Card>
    </div>
  );
};

export default Users;
