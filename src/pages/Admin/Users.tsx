
import { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useUserMocks } from '@/hooks/useUserMocks';
import UserTable from '@/components/admin/UserTable';
import { useUsersStore } from '@/stores/users';
import { Search } from 'lucide-react';

const Users = () => {
  const { t } = useTranslation();
  useUserMocks();
  const setFilters = useUsersStore(s => s.setFilters);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setFilters({ searchTerm: value });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{t('admin.sidebar.users')}</h2>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input 
            type="text"
            placeholder={t('admin.users.search')}
            className="bg-[#0e2337] border border-emerald/10 rounded-lg py-2 pl-10 pr-3 w-full text-sm"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <select 
            className="bg-[#0e2337] border border-emerald/10 rounded-lg px-3 py-2 text-sm"
            onChange={e => setFilters({ country: e.target.value || undefined })}
          >
            <option value="">{t('admin.users.allCountries')}</option>
            <option value="US">United States</option>
            <option value="BR">Brazil</option>
            <option value="CO">Colombia</option>
            <option value="MX">Mexico</option>
            <option value="ES">Spain</option>
          </select>
          
          <select 
            className="bg-[#0e2337] border border-emerald/10 rounded-lg px-3 py-2 text-sm"
            onChange={e => setFilters({ kyc: e.target.value === '' ? undefined : Number(e.target.value) as 0|1|2|3 })}
          >
            <option value="">{t('admin.users.anyKyc')}</option>
            <option value="0">KYC 0</option>
            <option value="1">KYC 1</option>
            <option value="2">KYC 2</option>
            <option value="3">KYC 3</option>
          </select>
          
          <select 
            className="bg-[#0e2337] border border-emerald/10 rounded-lg px-3 py-2 text-sm"
            onChange={e => setFilters({ banned: e.target.value === 'banned' ? true : e.target.value === 'active' ? false : undefined })}
          >
            <option value="">{t('admin.users.allStatus')}</option>
            <option value="active">{t('admin.users.statusActive')}</option>
            <option value="banned">{t('admin.users.statusBanned')}</option>
          </select>
        </div>
      </div>
      
      <UserTable />
    </div>
  );
};

export default Users;
