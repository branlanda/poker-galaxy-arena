
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Mail, RefreshCw } from 'lucide-react';

interface EmailVerificationProps {
  email: string;
  onVerified: () => void;
}

const EmailVerification: React.FC<EmailVerificationProps> = ({ email, onVerified }) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const { toast } = useToast();

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationCode.trim()) {
      toast({
        title: "Error",
        description: "Por favor ingresa el código de verificación",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: verificationCode,
        type: 'signup'
      });

      if (error) throw error;

      toast({
        title: "¡Email verificado!",
        description: "Tu cuenta ha sido activada exitosamente",
      });
      onVerified();
    } catch (error: any) {
      toast({
        title: "Error de verificación",
        description: error.message || "Código de verificación inválido",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email
      });

      if (error) throw error;

      toast({
        title: "Código reenviado",
        description: "Se ha enviado un nuevo código a tu email",
      });
      setTimeLeft(60);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo reenviar el código",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <Mail className="h-6 w-6 text-blue-600" />
        </div>
        <CardTitle>Verifica tu email</CardTitle>
        <p className="text-sm text-muted-foreground">
          Hemos enviado un código de verificación a <strong>{email}</strong>
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleVerifyEmail} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Código de verificación"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              maxLength={6}
              className="text-center text-lg tracking-widest"
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isVerifying}
          >
            {isVerifying ? "Verificando..." : "Verificar Email"}
          </Button>

          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">
              ¿No recibiste el código?
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={handleResendCode}
              disabled={isResending || timeLeft > 0}
              className="w-full"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              {timeLeft > 0 ? `Reenviar en ${timeLeft}s` : "Reenviar código"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default EmailVerification;
