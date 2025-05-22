
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { toast } from 'sonner';
import Login from './Login';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/stores/auth';

// Mock dependencies
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

vi.mock('@/stores/auth', () => ({
  useAuth: vi.fn(),
}));

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      getSession: vi.fn(),
    }
  },
}));

describe('Login Component', () => {
  const mockNavigate = vi.fn();
  const mockSetUser = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock react-router hooks
    vi.mock('react-router-dom', async () => {
      const actual = await vi.importActual('react-router-dom');
      return {
        ...actual,
        useNavigate: () => mockNavigate,
        useLocation: () => ({ state: { from: { pathname: '/dashboard' } } }),
      };
    });
    
    // Mock auth store
    (useAuth as any).mockImplementation((selector) => {
      const store = { user: null, setUser: mockSetUser };
      return selector ? selector(store) : store;
    });
  });

  it('renders the login form', () => {
    render(<Login />);
    
    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('shows validation errors when form is submitted empty', async () => {
    render(<Login />);
    
    const signInButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(signInButton);
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Email and password are required');
    });
    
    expect(vi.mocked(supabase.auth.signInWithPassword)).not.toHaveBeenCalled();
  });

  it('calls supabase signIn when form is submitted with valid data', async () => {
    (vi.mocked(supabase.auth.signInWithPassword) as any).mockResolvedValue({
      data: { user: { id: '123', email: 'test@example.com' } },
      error: null,
    });
    
    render(<Login />);
    
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const signInButton = screen.getByRole('button', { name: /sign in/i });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(signInButton);
    
    await waitFor(() => {
      expect(vi.mocked(supabase.auth.signInWithPassword)).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
    
    expect(toast.success).toHaveBeenCalledWith('Successfully logged in');
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard', { replace: true });
  });

  it('shows error message when login fails', async () => {
    (vi.mocked(supabase.auth.signInWithPassword) as any).mockResolvedValue({
      data: null,
      error: { message: 'Invalid credentials' },
    });
    
    render(<Login />);
    
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const signInButton = screen.getByRole('button', { name: /sign in/i });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(signInButton);
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Invalid credentials');
    });
  });
});
