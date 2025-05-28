
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAccountSecurity } from '@/hooks/useAccountSecurity';
import { Shield, Smartphone, Mail, Key, Monitor, AlertTriangle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

const SecuritySettings: React.FC = () => {
  const {
    securitySettings,
    devices,
    loading,
    enableTwoFactor,
    disableTwoFactor,
    revokeDevice
  } = useAccountSecurity();

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-32 bg-slate-800/50 rounded-lg"></div>
        <div className="h-48 bg-slate-800/50 rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Security Overview */}
      <Card className="bg-slate-800/90 border-emerald/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Shield className="h-5 w-5" />
            Estado de Seguridad
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 border border-emerald/20 rounded-lg bg-slate-700/50">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-emerald" />
                <span className="text-gray-300">Verificación de Email</span>
              </div>
              <Badge variant={securitySettings.emailVerified ? "default" : "destructive"}>
                {securitySettings.emailVerified ? "Verificado" : "Pendiente"}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 border border-emerald/20 rounded-lg bg-slate-700/50">
              <div className="flex items-center gap-3">
                <Smartphone className="h-5 w-5 text-emerald" />
                <span className="text-gray-300">Autenticación 2FA</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={securitySettings.twoFactorEnabled ? "default" : "secondary"}>
                  {securitySettings.twoFactorEnabled ? "Activado" : "Inactivo"}
                </Badge>
                <Button
                  size="sm"
                  variant={securitySettings.twoFactorEnabled ? "destructive" : "default"}
                  onClick={securitySettings.twoFactorEnabled ? disableTwoFactor : enableTwoFactor}
                >
                  {securitySettings.twoFactorEnabled ? "Desactivar" : "Activar"}
                </Button>
              </div>
            </div>
          </div>

          <div className="p-3 border border-emerald/20 rounded-lg bg-slate-700/50">
            <div className="flex items-center gap-3 mb-2">
              <Key className="h-5 w-5 text-emerald" />
              <span className="text-gray-300">Último cambio de contraseña</span>
            </div>
            <p className="text-sm text-gray-400">
              {securitySettings.lastPasswordChange
                ? formatDistanceToNow(securitySettings.lastPasswordChange, { addSuffix: true, locale: es })
                : "Nunca"}
            </p>
          </div>

          {securitySettings.accountLocked && (
            <div className="p-3 border border-red-400/20 bg-red-900/20 rounded-lg">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-red-400" />
                <span className="text-red-300 font-medium">Cuenta bloqueada</span>
              </div>
              <p className="text-sm text-red-400 mt-1">
                Tu cuenta está temporalmente bloqueada debido a múltiples intentos de acceso fallidos.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Trusted Devices */}
      <Card className="bg-slate-800/90 border-emerald/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Monitor className="h-5 w-5" />
            Dispositivos de Confianza
          </CardTitle>
        </CardHeader>
        <CardContent>
          {devices.length === 0 ? (
            <p className="text-gray-400 text-center py-4">
              No hay dispositivos de confianza registrados
            </p>
          ) : (
            <div className="space-y-3">
              {devices.map((device) => (
                <div
                  key={device.id}
                  className="flex items-center justify-between p-3 border border-emerald/20 rounded-lg bg-slate-700/50"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Monitor className="h-4 w-4 text-emerald" />
                      <span className="font-medium text-gray-300">{device.name}</span>
                    </div>
                    <div className="text-sm text-gray-400 space-y-1">
                      <p>{device.browser}</p>
                      {device.location && <p>{device.location}</p>}
                      <p>
                        Último uso: {formatDistanceToNow(device.lastUsed, { addSuffix: true, locale: es })}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => revokeDevice(device.id)}
                    className="border-emerald/20 text-gray-300 hover:bg-slate-600"
                  >
                    Revocar
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Recommendations */}
      <Card className="bg-slate-800/90 border-emerald/20">
        <CardHeader>
          <CardTitle className="text-white">Recomendaciones de Seguridad</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {!securitySettings.emailVerified && (
              <div className="p-3 border border-yellow-400/20 bg-yellow-900/20 rounded-lg">
                <p className="text-yellow-300">
                  Verifica tu email para mejorar la seguridad de tu cuenta
                </p>
              </div>
            )}
            
            {!securitySettings.twoFactorEnabled && (
              <div className="p-3 border border-blue-400/20 bg-blue-900/20 rounded-lg">
                <p className="text-blue-300">
                  Activa la autenticación de dos factores para mayor protección
                </p>
              </div>
            )}

            {!securitySettings.lastPasswordChange || 
             (Date.now() - securitySettings.lastPasswordChange.getTime()) > 90 * 24 * 60 * 60 * 1000 && (
              <div className="p-3 border border-orange-400/20 bg-orange-900/20 rounded-lg">
                <p className="text-orange-300">
                  Considera cambiar tu contraseña regularmente (recomendado cada 90 días)
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecuritySettings;
