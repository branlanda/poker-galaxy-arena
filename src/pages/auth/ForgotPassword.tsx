
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!email) {
      setError("Please enter your email address");
      return;
    }
    
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      setSubmitted(true);
      toast.success("Password reset instructions sent");
    } catch (error: any) {
      setError(error.message || "Failed to send reset instructions");
      toast.error(error.message || "Failed to send reset instructions");
      console.error("Reset password error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy p-4">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-navy/50 p-8 shadow-lg backdrop-blur-md border border-emerald/20">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-emerald">Reset Your Password</h1>
          <p className="text-gray-400 mt-2">
            Enter the email address associated with your account
          </p>
        </div>
        
        {submitted ? (
          <div className="bg-emerald-900/20 border border-emerald-500/50 rounded-md p-4 flex flex-col items-center gap-3 text-center">
            <CheckCircle2 className="h-12 w-12 text-emerald-400 mb-2" />
            <h3 className="text-lg font-medium text-emerald-300">Check your email</h3>
            <p className="text-sm text-gray-300">
              We've sent password reset instructions to: <strong>{email}</strong>
            </p>
            <p className="text-xs text-gray-400 mt-2">
              If you don't see the email, check your spam folder
            </p>
            <Link to="/login" className="mt-4">
              <Button variant="outline">Back to Sign In</Button>
            </Link>
          </div>
        ) : (
          <>
            {error && (
              <div className="bg-red-900/20 border border-red-500/50 rounded-md p-3 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm text-red-200">{error}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
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
              
              <Button 
                type="submit" 
                variant="primary" 
                loading={loading}
                fullWidth
              >
                {loading ? "Sending..." : "Send Reset Instructions"}
              </Button>
              
              <div className="text-center pt-2">
                <Link to="/login" className="text-sm text-emerald hover:underline">
                  Back to Sign In
                </Link>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
