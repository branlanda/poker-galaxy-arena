
import React from 'react';
import SecuritySettings from '@/components/auth/SecuritySettings';

const SecuritySettingsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Configuración de Seguridad</h1>
          <p className="text-muted-foreground">
            Administra la seguridad de tu cuenta y dispositivos de confianza
          </p>
        </div>
        <SecuritySettings />
      </div>
    </div>
  );
};

export default SecuritySettingsPage;
