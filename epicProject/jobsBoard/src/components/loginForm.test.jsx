import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginForm from './loginForm'; // Adjust path as needed
import { vi } from 'vitest';
import { supabase } from '../SupabaseClient';

// Mock supabase
vi.mock('../SupabaseClient', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
    },
    from: vi.fn(() => ({
      insert: vi.fn().mockResolvedValue({ error: null }),
    })),
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe('LoginForm', () => {
  it('renders login form by default', () => {
    render(<LoginForm />);
    expect(screen.getByText(/please select your role/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
    expect(screen.getByText(/already have an account\? login/i)).toBeInTheDocument();
  });

  it('toggles to sign up form', async () => {
    render(<LoginForm />);
    fireEvent.click(screen.getByText(/already have an account\? login/i));

    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByText(/create an account/i)).toBeInTheDocument();
  });

  it('submits login form', async () => {
    supabase.auth.signInWithPassword.mockResolvedValue({ error: null });

    render(<LoginForm />);
    fireEvent.click(screen.getByText(/Already have an account/i)); // back to login

    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'password123' } });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  it('submits student sign up and inserts correct data', async () => {
    supabase.auth.signUp.mockResolvedValue({ error: null });

    const insertMock = vi.fn().mockResolvedValue({ error: null });
    supabase.from.mockReturnValue({ insert: insertMock });

    render(<LoginForm />);

    fireEvent.click(screen.getByLabelText(/student/i));
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'student@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'pass1234' } });
    fireEvent.change(screen.getByPlaceholderText(/first name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByPlaceholderText(/last name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByPlaceholderText(/student id/i), { target: { value: 'S123' } });
    fireEvent.change(screen.getByPlaceholderText(/year group/i), { target: { value: '2025' } });

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(supabase.auth.signUp).toHaveBeenCalled();
      expect(insertMock).toHaveBeenCalled(); // Could also assert insert content here
    });
  });
});
