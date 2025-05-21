
import { Card } from "@/components/ui/card";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-2">Usuarios</h3>
          <p className="text-gold">Coming soon...</p>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-2">Mesas Activas</h3>
          <p className="text-gold">Coming soon...</p>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-2">Transacciones</h3>
          <p className="text-gold">Coming soon...</p>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
