
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/stores/auth';
import { toast } from 'sonner';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alias, setAlias] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setUser = useAuth((s) => s.setUser);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !alias) {
      toast.error("All fields are required");
      return;
    }
    
    if (alias.length < 3 || alias.length > 24) {
      toast.error("Alias must be between 3 and 24 characters");
      return;
    }
    
    setLoading(true);
    
    try {
      // Create auth user
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) throw error;
      
      if (data.user) {
        // Create player profile
        const { error: profileError } = await supabase
          .from('players')
          .insert([{ 
            user_id: data.user.id, 
            alias,
            show_in_leaderboard: true
          }]);
          
        if (profileError) throw profileError;
        
        // Update user state
        setUser({
          id: data.user.id,
          email: data.user.email || undefined,
          alias,
          showInLeaderboard: true
        });
        
        toast.success("Account created successfully!");
        navigate('/lobby');
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to create account");
      console.error("Signup error:", error);
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
            />
          </div>
          
          <Button 
            type="submit" 
            variant="primary" 
            loading={loading}
            fullWidth
          >
            Sign Up
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
