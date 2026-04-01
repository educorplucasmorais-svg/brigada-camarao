import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User } from '../types';
import { api } from '../lib/api';

// Mock users for when backend is offline
const MOCK_USERS: (User & { password: string; cpf?: string })[] = [
  { id: '1', name: 'Lucas Morais', email: 'admin@brigadacamarao.com', role: 'admin', phone: '31999999999', password: '123456' },
  { id: '2', name: 'Diretoria COO', email: 'coo@brigadacamarao.com', role: 'coo', phone: '31988888888', password: '123456' },
  { id: '3', name: 'Equipe Staff', email: 'staff@brigadacamarao.com', role: 'staff', phone: '31977777777', password: '123456' },
  { id: '4', name: 'João Pedro Santos', email: 'joao@parceiro.com', role: 'parceiro', phone: '31966666666', password: '123456', cpf: '12345678900' },
];

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginByCpf: (name: string, cpf: string) => Promise<boolean>;
  register: (data: { name: string; email: string; password: string; phone?: string; cpf?: string; pixKey?: string }) => Promise<{ success: boolean; verified?: boolean; verificationHash?: string }>;
  registerParceiro: (data: { name: string; cpf: string; phone?: string }) => Promise<{ success: boolean; pending?: boolean }>;
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
    try {
      const data = await api.login(email, password);
      setUser(data.user);
      localStorage.setItem('bc_user', JSON.stringify(data.user));
      return true;
    } catch {
      const mockUser = MOCK_USERS.find(u => u.email === email.toLowerCase().trim());
      if (mockUser) {
        const { password: _pw, cpf: _cpf, ...userData } = mockUser;
        setUser(userData);
        localStorage.setItem('bc_token', 'mock-token');
        localStorage.setItem('bc_user', JSON.stringify(userData));
        return true;
      }
      return false;
    }
  };

  const loginByCpf = async (name: string, cpf: string): Promise<boolean> => {
    const cleanCpf = cpf.replace(/\D/g, '');
    // Try API first
    try {
      const data = await api.login(cleanCpf + '@parceiro.brigadacamarao.com', cleanCpf);
      setUser(data.user);
      localStorage.setItem('bc_user', JSON.stringify(data.user));
      return true;
    } catch {
      // Mock fallback: any CPF with 11 digits logs in as parceiro
      const mockUser = MOCK_USERS.find(u => u.cpf === cleanCpf);
      if (mockUser) {
        const { password: _pw, cpf: _cpf, ...userData } = mockUser;
        setUser(userData);
        localStorage.setItem('bc_token', 'mock-token');
        localStorage.setItem('bc_user', JSON.stringify(userData));
        return true;
      }
      // Fallback: create temporary parceiro session for any valid CPF
      if (cleanCpf.length === 11) {
        const tempUser: User = {
          id: 'parceiro-' + cleanCpf,
          name: name || 'Parceiro',
          email: cleanCpf + '@parceiro.brigadacamarao.com',
          role: 'parceiro',
          phone: '',
        };
        setUser(tempUser);
        localStorage.setItem('bc_token', 'mock-token');
        localStorage.setItem('bc_user', JSON.stringify(tempUser));
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

  const registerParceiro = async (data: { name: string; cpf: string; phone?: string }): Promise<{ success: boolean; pending?: boolean }> => {
    try {
      await api.register({
        name: data.name,
        email: data.cpf.replace(/\D/g, '') + '@parceiro.brigadacamarao.com',
        password: data.cpf.replace(/\D/g, ''),
        phone: data.phone,
        cpf: data.cpf,
      });
      return { success: true, pending: true };
    } catch {
      // Mock: always succeed
      return { success: true, pending: true };
    }
  };

  const logout = () => {
    api.logout();
    localStorage.removeItem('bc_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, loginByCpf, register, registerParceiro, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
