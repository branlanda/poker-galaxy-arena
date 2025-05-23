import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle } from 'lucide-react';

const resetPasswordSchema = z.object({
  newPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"], // path of error
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const { token } = useParams();
  const navigate = useNavigate();

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing token.");
    }
  }, [token]);

  const onSubmit = async (data: ResetPasswordFormValues) => {
    setError(null);
    setLoading(true);

    if (!token) {
      setError("Invalid or missing token.");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: data.newPassword,
      }, {
        redirectTo: `${window.location.origin}/login`
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Password Reset Successful",
        description: "Your password has been successfully reset. You will be redirected to login.",
      });

      navigate('/login');
    } catch (error: any) {
      setError(error.message || "Failed to reset password");
      toast({
        title: "Error",
        description: error.message || "Failed to reset password",
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
          <h1 className="text-2xl font-bold text-emerald">Reset Your Password</h1>
          <p className="text-gray-400 mt-2">Enter your new password below</p>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-500/50 rounded-md p-3 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-200">{error}</p>
          </div>
        )}

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-200">New Password</label>
            <Input
              id="newPassword"
              type="password"
              placeholder="••••••••"
              {...form.register("newPassword")}
              required
              className="w-full"
              disabled={loading}
            />
            {form.formState.errors.newPassword && (
              <p className="text-xs text-red-400">{form.formState.errors.newPassword.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-200">Confirm New Password</label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              {...form.register("confirmPassword")}
              required
              className="w-full"
              disabled={loading}
            />
            {form.formState.errors.confirmPassword && (
              <p className="text-xs text-red-400">{form.formState.errors.confirmPassword.message}</p>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            loading={loading}
            fullWidth
          >
            {loading ? "Resetting Password..." : "Reset Password"}
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

export default ResetPassword;
