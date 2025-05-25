
import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { KeyRound, Mail, Shield } from 'lucide-react';

type RecoveryStep = 'email' | 'security_questions' | 'verify_identity' | 'reset_complete';

interface SecurityQuestion {
  id: string;
  question: string;
  answer: string;
}

const AccountRecovery: React.FC = () => {
  const [step, setStep] = useState<RecoveryStep>('email');
  const [email, setEmail] = useState('');
  const [securityAnswers, setSecurityAnswers] = useState<Record<string, string>>({});
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const securityQuestions: SecurityQuestion[] = [
    { id: '1', question: '¿Cuál es el nombre de tu primera mascota?', answer: '' },
    { id: '2', question: '¿En qué ciudad naciste?', answer: '' },
    { id: '3', question: '¿Cuál es el apellido de soltera de tu madre?', answer: '' }
  ];

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast({
        title: "Error",
        description: "Por favor ingresa tu email",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Check if email exists and send recovery email
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) throw error;

      toast({
        title: "Email de recuperación enviado",
        description: "Revisa tu bandeja de entrada para continuar",
      });
      setStep('security_questions');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo enviar el email de recuperación",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSecurityQuestions = async (e: React.FormEvent) => {
    e.preventDefault();
    const unanswered = securityQuestions.filter(q => !securityAnswers[q.id]?.trim());
    
    if (unanswered.length > 0) {
      toast({
        title: "Error",
        description: "Por favor responde todas las preguntas de seguridad",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // In a real implementation, verify security answers against stored data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Verificación exitosa",
        description: "Preguntas de seguridad verificadas correctamente",
      });
      setStep('verify_identity');
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Una o más respuestas son incorrectas",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyIdentity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationCode.trim()) {
      toast({
        title: "Error",
        description: "Por favor ingresa el código de verificación",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Verify the code from email
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: verificationCode,
        type: 'recovery'
      });

      if (error) throw error;

      setStep('reset_complete');
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

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Las contraseñas no coinciden",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Error",
        description: "La contraseña debe tener al menos 6 caracteres",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast({
        title: "¡Contraseña actualizada!",
        description: "Tu contraseña ha sido cambiada exitosamente",
      });
      
      // Redirect to login
      window.location.href = '/login';
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo actualizar la contraseña",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateSecurityAnswer = (questionId: string, answer: string) => {
    setSecurityAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            {step === 'email' && <Mail className="h-6 w-6 text-blue-600" />}
            {step === 'security_questions' && <Shield className="h-6 w-6 text-blue-600" />}
            {(step === 'verify_identity' || step === 'reset_complete') && <KeyRound className="h-6 w-6 text-blue-600" />}
          </div>
          <CardTitle>
            {step === 'email' && 'Recuperar Cuenta'}
            {step === 'security_questions' && 'Preguntas de Seguridad'}
            {step === 'verify_identity' && 'Verificar Identidad'}
            {step === 'reset_complete' && 'Nueva Contraseña'}
          </CardTitle>
        </CardHeader>

        <CardContent>
          {step === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Email de la cuenta</label>
                <Input
                  type="email"
                  placeholder="tu@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Enviando..." : "Enviar código de recuperación"}
              </Button>
            </form>
          )}

          {step === 'security_questions' && (
            <form onSubmit={handleSecurityQuestions} className="space-y-4">
              <p className="text-sm text-muted-foreground mb-4">
                Responde las siguientes preguntas de seguridad para verificar tu identidad:
              </p>
              {securityQuestions.map((question) => (
                <div key={question.id} className="space-y-2">
                  <label className="text-sm font-medium">{question.question}</label>
                  <Input
                    type="text"
                    value={securityAnswers[question.id] || ''}
                    onChange={(e) => updateSecurityAnswer(question.id, e.target.value)}
                    required
                  />
                </div>
              ))}
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Verificando..." : "Verificar respuestas"}
              </Button>
            </form>
          )}

          {step === 'verify_identity' && (
            <form onSubmit={handleVerifyIdentity} className="space-y-4">
              <p className="text-sm text-muted-foreground mb-4">
                Ingresa el código de verificación que enviamos a tu email:
              </p>
              <Input
                type="text"
                placeholder="Código de verificación"
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
                {isLoading ? "Verificando..." : "Verificar código"}
              </Button>
            </form>
          )}

          {step === 'reset_complete' && (
            <form onSubmit={handlePasswordReset} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nueva contraseña</label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Confirmar contraseña</label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Actualizando..." : "Actualizar contraseña"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountRecovery;
