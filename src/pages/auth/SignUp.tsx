
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/stores/auth';
import { toast } from 'sonner';
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
      setError("All fields are required");
      return;
    }
    
    if (alias.length < 3 || alias.length > 24) {
      setError("Alias must be between 3 and 24 characters");
      return;
    }
    
    setLoading(true);
    
    try {
      // Create auth user first
      const { data: authData, error: authError } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        }
      });
      
      if (authError) throw authError;
      
      if (authData.user && authData.session) {
        // Wait a moment for the auth session to be established
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Create player profile - the RLS policy should now work since user is authenticated
        const { error: profileError } = await supabase
          .from('players')
          .insert([{ 
            user_id: authData.user.id, 
            alias,
            show_public_stats: true
          }]);
          
        if (profileError) {
          console.error("Profile creation error:", profileError);
          throw new Error(`Failed to create player profile: ${profileError.message}`);
        }
        
        // Update user state
        setUser({
          id: authData.user.id,
          email: authData.user.email || undefined,
          alias,
          showInLeaderboard: true
        });
        
        toast.success("Account created successfully!");
        navigate('/lobby');
      } else {
        // User created but needs email confirmation
        toast.success("Please check your email to confirm your account!");
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      setError(error.message || "Failed to create account");
      toast.error(error.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy p-4">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-navy/50 p-8 shadow-lg backdrop-blur-md border border-emerald/20">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-emerald">Create Your Account</h1>
          <p className="text-gray-400 mt-2">Join our poker community and start playing</p>
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
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full"
              disabled={loading}
              autoComplete="email"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-200">Password</label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full"
              disabled={loading}
              autoComplete="new-password"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="alias" className="block text-sm font-medium text-gray-200">
              Poker Alias
              <span className="text-xs text-gray-400 ml-2">(3-24 characters)</span>
            </label>
            <Input
              id="alias"
              type="text"
              placeholder="PokerMaster"
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
            {loading ? "Creating Account..." : "Sign Up"}
          </Button>
        </form>
        
        <div className="text-center text-gray-400 text-sm mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-emerald hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
