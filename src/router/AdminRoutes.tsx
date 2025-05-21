
import { Route, Routes } from 'react-router-dom';
import { AdminGuard } from '@/hooks/useAdminGuard';
import AdminLayout from '@/pages/Admin/AdminLayout';
import Dashboard from '@/pages/Admin/Dashboard';
import Users from '@/pages/Admin/Users';
import Tables from '@/pages/Admin/Tables';
import Ledger from '@/pages/Admin/Ledger';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route
        path="/*"
        element={
          <AdminGuard>
            <AdminLayout />
          </AdminGuard>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="tables" element={<Tables />} />
        <Route path="ledger" element={<Ledger />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
