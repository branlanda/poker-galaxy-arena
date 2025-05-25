
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import ResponsibleGamingPanel from '@/components/legal/ResponsibleGamingPanel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';

const ResponsibleGamingPage: React.FC = () => {
  return (
    <AppLayout>
      <div className="container mx-auto p-6 bg-navy min-h-screen">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="h-8 w-8 text-emerald" />
          <h1 className="text-3xl font-bold text-white">Juego Responsable</h1>
        </div>
        
        <div className="mb-6">
          <Card className="bg-navy-light border-emerald/20">
            <CardHeader>
              <CardTitle className="text-white">Compromiso con el Juego Responsable</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Nuestro compromiso es proporcionar un entorno de juego seguro y responsable. 
                Ofrecemos herramientas y recursos para ayudarte a mantener el control sobre 
                tu experiencia de juego y garantizar que siga siendo una actividad de entretenimiento.
              </p>
            </CardContent>
          </Card>
        </div>
        
        <ResponsibleGamingPanel />
      </div>
    </AppLayout>
  );
};

export default ResponsibleGamingPage;
