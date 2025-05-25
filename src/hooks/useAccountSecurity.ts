
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface SecuritySettings {
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  lastPasswordChange: Date | null;
  loginAttempts: number;
  accountLocked: boolean;
  trustedDevices: string[];
}

interface DeviceInfo {
  id: string;
  name: string;
  lastUsed: Date;
  browser: string;
  location?: string;
}

export function useAccountSecurity() {
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    emailVerified: false,
    twoFactorEnabled: false,
    lastPasswordChange: null,
    loginAttempts: 0,
    accountLocked: false,
    trustedDevices: []
  });
  const [devices, setDevices] = useState<DeviceInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadSecuritySettings();
  }, []);

  const loadSecuritySettings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Load user metadata for security settings
      const settings: SecuritySettings = {
        emailVerified: user.email_confirmed_at !== null,
        twoFactorEnabled: user.user_metadata?.two_factor_enabled || false,
        lastPasswordChange: user.user_metadata?.last_password_change 
          ? new Date(user.user_metadata.last_password_change) 
          : null,
        loginAttempts: user.user_metadata?.login_attempts || 0,
        accountLocked: user.user_metadata?.account_locked || false,
        trustedDevices: user.user_metadata?.trusted_devices || []
      };

      setSecuritySettings(settings);

      // Load trusted devices (mock data for now)
      const mockDevices: DeviceInfo[] = [
        {
          id: 'device-1',
          name: 'Chrome en Windows',
          lastUsed: new Date(),
          browser: 'Chrome 120.0',
          location: 'Madrid, España'
        },
        {
          id: 'device-2',
          name: 'Safari en iPhone',
          lastUsed: new Date(Date.now() - 86400000),
          browser: 'Safari 17.0',
          location: 'Madrid, España'
        }
      ];
      setDevices(mockDevices);
    } catch (error) {
      console.error('Error loading security settings:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las configuraciones de seguridad",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const enableTwoFactor = async () => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: { two_factor_enabled: true }
      });

      if (error) throw error;

      setSecuritySettings(prev => ({
        ...prev,
        twoFactorEnabled: true
      }));

      toast({
        title: "2FA Activado",
        description: "La autenticación de dos factores ha sido activada",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo activar 2FA",
        variant: "destructive",
      });
    }
  };

  const disableTwoFactor = async () => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: { two_factor_enabled: false }
      });

      if (error) throw error;

      setSecuritySettings(prev => ({
        ...prev,
        twoFactorEnabled: false
      }));

      toast({
        title: "2FA Desactivado",
        description: "La autenticación de dos factores ha sido desactivada",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo desactivar 2FA",
        variant: "destructive",
      });
    }
  };

  const revokeDevice = async (deviceId: string) => {
    try {
      // Remove device from trusted devices
      const updatedDevices = securitySettings.trustedDevices.filter(id => id !== deviceId);
      
      const { error } = await supabase.auth.updateUser({
        data: { trusted_devices: updatedDevices }
      });

      if (error) throw error;

      setSecuritySettings(prev => ({
        ...prev,
        trustedDevices: updatedDevices
      }));

      setDevices(prev => prev.filter(device => device.id !== deviceId));

      toast({
        title: "Dispositivo revocado",
        description: "El dispositivo ha sido removido de la lista de confianza",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo revocar el dispositivo",
        variant: "destructive",
      });
    }
  };

  const checkMultipleAccounts = async (email: string): Promise<boolean> => {
    try {
      // This would typically be done server-side with better fraud detection
      // For now, we'll simulate checking for multiple accounts
      
      // Check for similar emails, phone numbers, device fingerprints, etc.
      const { data, error } = await supabase
        .from('players')
        .select('user_id')
        .ilike('alias', `%${email.split('@')[0]}%`);

      if (error) throw error;

      // If we find multiple similar accounts, flag for review
      return (data?.length || 0) > 1;
    } catch (error) {
      console.error('Error checking for multiple accounts:', error);
      return false;
    }
  };

  const reportSuspiciousActivity = async (activityType: string, details: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Log suspicious activity for admin review
      await supabase.from('audit_logs').insert({
        user_id: user.id,
        action: 'SUSPICIOUS_ACTIVITY',
        description: `Suspicious activity detected: ${activityType}`,
        metadata: { activity_type: activityType, details }
      });

      console.log('Suspicious activity reported:', activityType, details);
    } catch (error) {
      console.error('Error reporting suspicious activity:', error);
    }
  };

  return {
    securitySettings,
    devices,
    loading,
    enableTwoFactor,
    disableTwoFactor,
    revokeDevice,
    checkMultipleAccounts,
    reportSuspiciousActivity,
    reload: loadSecuritySettings
  };
}
