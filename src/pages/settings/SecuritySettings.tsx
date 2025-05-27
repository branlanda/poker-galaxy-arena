
import React from 'react';
import SecuritySettings from '@/components/auth/SecuritySettings';
import KycVerification from '@/components/kyc/KycVerification';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, FileCheck } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';

const SecuritySettingsPage: React.FC = () => {
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Configuración de Seguridad</h1>
          <p className="text-muted-foreground">
            Administra la seguridad de tu cuenta, dispositivos de confianza y verificación de identidad
          </p>
        </div>

        <Tabs defaultValue="security" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Seguridad de Cuenta
            </TabsTrigger>
            <TabsTrigger value="kyc" className="flex items-center gap-2">
              <FileCheck className="h-4 w-4" />
              Verificación KYC
            </TabsTrigger>
          </TabsList>

          <TabsContent value="security" className="mt-6">
            <SecuritySettings />
          </TabsContent>

          <TabsContent value="kyc" className="mt-6">
            <KycVerification />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default SecuritySettingsPage;
