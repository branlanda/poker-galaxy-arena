import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

  const formSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email address" }),
  });

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      formSchema.parse({ email });
    } catch (err: any) {
      setError(err.errors[0].message);
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        throw error;
      }

      setSuccess(true);
      toast({
        title: "Check your email",
        description: "We've sent a password reset link to your email address.",
      });
    } catch (error: any) {
      setError(error.message || "Failed to send reset password email");
      toast({
        title: "Error",
        description: error.message || "Failed to send reset password email",
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
          <h1 className="text-2xl font-bold text-emerald">Forgot Password</h1>
          <p className="text-gray-400 mt-2">Enter your email to reset your password</p>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-500/50 rounded-md p-3 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-200">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-900/20 border border-green-500/50 rounded-md p-3 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
            <p className="text-sm text-green-200">
              Password reset email sent! Check your inbox.
            </p>
          </div>
        )}

        <form onSubmit={handleForgotPassword} className="space-y-6">
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
            {loading ? "Sending Reset Link..." : "Reset Password"}
          </Button>
        </form>

        <div className="text-center text-gray-400 text-sm mt-6">
          Remember your password?{" "}
          <Link to="/login" className="text-emerald hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
