
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Shield, QrCode, Copy, Check } from 'lucide-react';
import QRCode from 'qrcode';

interface TwoFactorAuthProps {
  onSetupComplete?: () => void;
  mode?: 'setup' | 'verify';
}

const TwoFactorAuth: React.FC<TwoFactorAuthProps> = ({ 
  onSetupComplete, 
  mode = 'setup' 
}) => {
  const [step, setStep] = useState<'generate' | 'verify'>('generate');
  const [secretKey, setSecretKey] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (mode === 'setup') {
      generateSecret();
    }
  }, [mode]);

  const generateSecret = async () => {
    setIsLoading(true);
    try {
      // Simulate secret generation (in real app, this would be done server-side)
      const secret = Array.from({ length: 32 }, () => 
        'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'[Math.floor(Math.random() * 32)]
      ).join('');
      
      setSecretKey(secret);
      
      // Generate QR code for authenticator apps
      const issuer = 'PokerApp';
      const user = 'user@example.com'; // This would come from actual user data
      const otpauth = `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(user)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}`;
      
      const qrUrl = await QRCode.toDataURL(otpauth);
      setQrCodeUrl(qrUrl);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo generar el código 2FA",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copySecret = () => {
    navigator.clipboard.writeText(secretKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Copiado",
      description: "Clave secreta copiada al portapapeles",
    });
  };

  const verifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationCode || verificationCode.length !== 6) {
      toast({
        title: "Error",
        description: "Ingresa un código de 6 dígitos",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // In a real implementation, this would verify against the server
      // For now, we'll simulate success
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Save 2FA status to user profile
      const { error } = await supabase.auth.updateUser({
        data: { two_factor_enabled: true }
      });

      if (error) throw error;

      toast({
        title: "2FA Activado",
        description: "La autenticación de dos factores ha sido configurada exitosamente",
      });
      
      onSetupComplete?.();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Código de verificación inválido",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (mode === 'verify') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Shield className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle>Verificación 2FA</CardTitle>
          <p className="text-sm text-muted-foreground">
            Ingresa el código de tu aplicación autenticadora
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={verifyCode} className="space-y-4">
            <Input
              type="text"
              placeholder="000000"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              maxLength={6}
              className="text-center text-lg tracking-widest"
            />
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Verificando..." : "Verificar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <Shield className="h-6 w-6 text-blue-600" />
        </div>
        <CardTitle>Configurar 2FA</CardTitle>
        <p className="text-sm text-muted-foreground">
          Configura la autenticación de dos factores para mayor seguridad
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {step === 'generate' && (
          <>
            <div className="text-center space-y-4">
              <p className="text-sm">
                1. Escanea este código QR con tu app autenticadora:
              </p>
              {qrCodeUrl && (
                <div className="flex justify-center">
                  <img src={qrCodeUrl} alt="QR Code" className="border rounded" />
                </div>
              )}
              
              <p className="text-sm">
                2. O ingresa manualmente esta clave secreta:
              </p>
              <div className="flex items-center space-x-2">
                <Input
                  value={secretKey}
                  readOnly
                  className="text-xs font-mono"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={copySecret}
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            
            <Button
              onClick={() => setStep('verify')}
              className="w-full"
              disabled={!secretKey}
            >
              Continuar a verificación
            </Button>
          </>
        )}

        {step === 'verify' && (
          <form onSubmit={verifyCode} className="space-y-4">
            <div className="text-center">
              <p className="text-sm mb-4">
                Ingresa el código de 6 dígitos de tu aplicación autenticadora:
              </p>
              <Input
                type="text"
                placeholder="000000"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                maxLength={6}
                className="text-center text-lg tracking-widest"
              />
            </div>
            
            <div className="flex space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep('generate')}
                className="flex-1"
              >
                Atrás
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={isLoading}
              >
                {isLoading ? "Verificando..." : "Activar 2FA"}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default TwoFactorAuth;
