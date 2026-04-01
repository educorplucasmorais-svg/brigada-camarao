import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User } from '../types';
import { api } from '../lib/api';

// Mock users for when backend is offline
const MOCK_USERS: (User & { password: string })[] = [
  { id: '1', name: 'Lucas Morais', email: 'admin@brigadacamarao.com', role: 'admin', phone: '31999999999', password: '123456' },
  { id: '2', name: 'Diretoria COO', email: 'coo@brigadacamarao.com', role: 'coo', phone: '31988888888', password: '123456' },
  { id: '3', name: 'Equipe Staff', email: 'staff@brigadacamarao.com', role: 'staff', phone: '31977777777', password: '123456' },
];

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: { name: string; email: string; password: string; phone?: string; cpf?: string; pixKey?: string }) => Promise<{ success: boolean; verified?: boolean; verificationHash?: string }>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('bc_token');
    const savedUser = localStorage.getItem('bc_user');
    if (token && savedUser) {
      // Try API first, fallback to saved user
      api.getMe()
        .then((userData) => setUser(userData))
        .catch(() => {
          try {
            setUser(JSON.parse(savedUser));
          } catch {
            localStorage.removeItem('bc_token');
            localStorage.removeItem('bc_user');
            setUser(null);
          }
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Try API first
    try {
      const data = await api.login(email, password);
      setUser(data.user);
      localStorage.setItem('bc_user', JSON.stringify(data.user));
      return true;
    } catch {
      // Fallback to mock users when backend is offline
      const mockUser = MOCK_USERS.find(u => u.email === email.toLowerCase().trim());
      if (mockUser) {
        const { password: _pw, ...userData } = mockUser;
        setUser(userData);
        localStorage.setItem('bc_token', 'mock-token');
        localStorage.setItem('bc_user', JSON.stringify(userData));
        return true;
      }
      return false;
    }
  };

  const register = async (data: { name: string; email: string; password: string; phone?: string; cpf?: string; pixKey?: string }) => {
    try {
      const result = await api.register(data);
      setUser(result.user);
      localStorage.setItem('bc_user', JSON.stringify(result.user));
      return { success: true, verified: result.verified, verificationHash: result.verificationHash };
    } catch {
      return { success: false };
    }
  };

  const logout = () => {
    api.logout();
    localStorage.removeItem('bc_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
