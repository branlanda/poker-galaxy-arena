
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@/test/utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Login from './Login';
import { AuthResponse } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

// Mock the useAuth hook
const mockSetUser = vi.fn();
vi.mock('@/stores/auth', () => ({
  useAuth: () => ({
    setUser: mockSetUser,
  }),
}));

// Mock the supabase client
vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
    },
  },
}));

describe('Login Component', () => {
  beforeEach(() => {
    mockSetUser.mockClear();
  });

  it('renders the login form', () => {
    render(<Login />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
  });

  it('allows the user to input email and password', () => {
    render(<Login />);
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  it('attempts to sign in with valid credentials', async () => {
    (supabase.auth.signInWithPassword as any).mockResolvedValue({
      data: {
        user: {
          id: 'test-user-id',
          email: 'test@example.com',
        },
      },
      error: null,
    });

    render(<Login />);

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const signInButton = screen.getByRole('button', { name: 'Sign In' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(signInButton);

    await waitFor(() => {
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  it('displays an error message for invalid credentials', async () => {
    (supabase.auth.signInWithPassword as any).mockResolvedValue({
      data: { user: null },
      error: { message: 'Invalid credentials' },
    } as AuthResponse);

    render(<Login />);

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const signInButton = screen.getByRole('button', { name: 'Sign In' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(signInButton);

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });
});
