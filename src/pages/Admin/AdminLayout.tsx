
import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/admin/Sidebar';
import Header from '@/components/admin/Header';

const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-navy text-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
