
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/stores/auth';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle } from 'lucide-react';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alias, setAlias] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const user = useAuth((s) => s.user);
  const setUser = useAuth((s) => s.setUser);
  const { toast } = useToast();

  // If user is already logged in, redirect to lobby
  useEffect(() => {
    if (user) {
      navigate('/lobby', { replace: true });
    }
  }, [user, navigate]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!email || !password || !alias) {
      setError("Todos los campos son requeridos");
      return;
    }
    
    if (alias.length < 3 || alias.length > 24) {
      setError("El alias debe tener entre 3 y 24 caracteres");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    
    setLoading(true);
    
    try {
      // Create auth user first
      const { data: authData, error: authError } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/lobby`,
        }
      });
      
      if (authError) {
        // Handle specific error cases
        if (authError.message.includes('rate limit')) {
          throw new Error('Has enviado demasiados emails. Por favor espera unos minutos antes de intentar de nuevo.');
        }
        if (authError.message.includes('already registered')) {
          throw new Error('Este email ya está registrado. Intenta iniciar sesión en su lugar.');
        }
        throw authError;
      }
      
      if (authData.user && authData.session) {
        // User is logged in immediately
        try {
          // Create player profile
          const { error: profileError } = await supabase
            .from('players')
            .insert([{ 
              user_id: authData.user.id, 
              alias,
              show_public_stats: true
            }]);
            
          if (profileError) {
            console.error("Profile creation error:", profileError);
            // Don't throw here, user is already created
            toast({
              title: "Cuenta creada pero hubo un problema con el perfil",
              variant: "destructive",
            });
          }
          
          // Update user state
          setUser({
            id: authData.user.id,
            email: authData.user.email || undefined,
            alias,
            showInLeaderboard: true
          });
          
          toast({
            title: "¡Cuenta creada exitosamente!",
          });
          navigate('/lobby');
        } catch (profileErr: any) {
          console.error("Profile setup error:", profileErr);
          toast({
            title: "Cuenta creada. Completa tu perfil en la configuración.",
          });
          navigate('/lobby');
        }
      } else if (authData.user) {
        // User created but needs email confirmation
        toast({
          title: "¡Registro exitoso! Revisa tu email para confirmar tu cuenta.",
        });
        setError("Revisa tu email y haz clic en el enlace de confirmación para activar tu cuenta.");
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      const errorMessage = error.message || "Error al crear la cuenta";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy p-4">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-navy/50 p-8 shadow-lg backdrop-blur-md border border-emerald/20">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-emerald">Crear Cuenta</h1>
          <p className="text-gray-400 mt-2">Únete a nuestra comunidad de poker</p>
        </div>
        
        {error && (
          <div className="bg-red-900/20 border border-red-500/50 rounded-md p-3 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-200">{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSignup} className="space-y-6">
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
              minLength={6}
              className="w-full"
              disabled={loading}
              autoComplete="new-password"
            />
            <p className="text-xs text-gray-400">Mínimo 6 caracteres</p>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="alias" className="block text-sm font-medium text-gray-200">
              Alias de Poker
              <span className="text-xs text-gray-400 ml-2">(3-24 caracteres)</span>
            </label>
            <Input
              id="alias"
              type="text"
              placeholder="MaestroPoker"
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
              required
              minLength={3}
              maxLength={24}
              className="w-full"
              disabled={loading}
            />
          </div>
          
          <Button 
            type="submit" 
            variant="primary" 
            loading={loading}
            fullWidth
          >
            {loading ? "Creando cuenta..." : "Registrarse"}
          </Button>
        </form>
        
        <div className="text-center text-gray-400 text-sm mt-6">
          ¿Ya tienes una cuenta?{" "}
          <Link to="/login" className="text-emerald hover:underline">
            Iniciar Sesión
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
