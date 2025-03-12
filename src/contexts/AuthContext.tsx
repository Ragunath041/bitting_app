import React, { createContext, useState, useContext, useEffect } from 'react';

type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, role: 'admin' | 'user') => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const savedUser = localStorage.getItem('bettingAppUser');
      const token = localStorage.getItem('token');

      if (savedUser && token) {
        try {
          // 🔹 Verify token with backend to ensure user session is valid
          const response = await fetch('http://localhost:5241/api/auth/verify-token', {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` },
          });

          if (response.ok) {
            setUser(JSON.parse(savedUser));
          } else {
            localStorage.removeItem('bettingAppUser');
            localStorage.removeItem('token');
          }
        } catch (error) {
          console.error('Error verifying token:', error);
        }
      }

      setIsLoading(false);
    };

    loadUser();
  }, []);

  // 🔹 Login Function (Using Backend)
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5241/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error('Invalid credentials');

      const data = await response.json();
      const userData: User = { id: data.id, name: data.name, email, role: data.role };

      // Save token and user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('bettingAppUser', JSON.stringify(userData));
      setUser(userData);
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // 🔹 Register Function (Using Backend)
  const register = async (name: string, email: string, password: string, role: 'admin' | 'user'): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5241/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });

      if (!response.ok) throw new Error('Registration failed');

      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // 🔹 Logout Function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('bettingAppUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
