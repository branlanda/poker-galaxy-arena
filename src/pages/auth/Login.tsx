
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/stores/auth';
import { toast } from 'sonner';
import { AlertCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const user = useAuth((s) => s.user);

  // If user is already logged in, redirect to lobby
  useEffect(() => {
    if (user) {
      navigate('/lobby', { replace: true });
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!email || !password) {
      setError("Email y contraseña son requeridos");
      return;
    }
    
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        // Handle specific error cases
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Email o contraseña incorrectos. Verifica tus datos.');
        }
        if (error.message.includes('Email not confirmed')) {
          throw new Error('Tu email no ha sido confirmado. Revisa tu bandeja de entrada.');
        }
        if (error.message.includes('Too many requests')) {
          throw new Error('Demasiados intentos de login. Espera unos minutos antes de intentar de nuevo.');
        }
        throw error;
      }

      if (data.user) {
        toast.success("¡Sesión iniciada exitosamente!");
        navigate('/lobby');
      }
    } catch (error: any) {
      console.error("Login error:", error);
      const errorMessage = error.message || "Error al iniciar sesión";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy p-4">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-navy/50 p-8 shadow-lg backdrop-blur-md border border-emerald/20">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-emerald">Bienvenido</h1>
          <p className="text-gray-400 mt-2">Inicia sesión para acceder a tu dashboard de poker</p>
        </div>
        
        {error && (
          <div className="bg-red-900/20 border border-red-500/50 rounded-md p-3 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-200">{error}</p>
          </div>
        )}
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-200">Email</label>
            <Input
              id="email"
              type="email"
              placeholder="tu@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full"
              disabled={loading}
              autoComplete="email"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-200">Contraseña</label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full"
              disabled={loading}
              autoComplete="current-password"
            />
          </div>
          
          <Button 
            type="submit" 
            variant="primary" 
            loading={loading}
            fullWidth
          >
            {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </Button>
        </form>
        
        <div className="text-center text-gray-400 text-sm mt-6">
          ¿No tienes una cuenta?{" "}
          <Link to="/signup" className="text-emerald hover:underline">
            Registrarse
          </Link>
        </div>
        
        <div className="text-center text-gray-400 text-sm">
          <Link to="/forgot-password" className="text-emerald hover:underline">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
