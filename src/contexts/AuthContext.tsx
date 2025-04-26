import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import api from '../services/api';
import { message } from 'antd';

// Định nghĩa kiểu dữ liệu cho User
interface User {
  id: number;
  email: string;
  fullName: string;
  phone?: string;
}

// Định nghĩa kiểu cho Auth Context
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    email: string;
    password: string;
    fullName: string;
    phone: string;
    dateOfBirth: Date;
  }) => Promise<void>;
  logout: () => void;
}

// Tạo context với giá trị mặc định
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Kiểm tra token khi khởi động app
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const { data } = await api.get('/users/me', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(data);
        }
      } catch (error) {
        localStorage.removeItem('token');
        console.error('Authentication check failed:', error);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  // Xử lý đăng nhập
  const login = async (email: string, password: string) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      setUser(data.user);
      message.success('Đăng nhập thành công!');
    } catch (error) {
      message.error('Sai email hoặc mật khẩu!');
      throw error;
    }
  };

  // Xử lý đăng ký
  const register = async (userData: {
    email: string;
    password: string;
    fullName: string;
    phone: string;
    dateOfBirth: Date;
  }) => {
    try {
      const { data } = await api.post('/auth/register', userData);
      localStorage.setItem('token', data.token);
      setUser(data.user);
      message.success('Đăng ký thành công!');
    } catch (error) {
      message.error('Đăng ký thất bại!');
      throw error;
    }
  };

  // Xử lý đăng xuất
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    message.success('Đã đăng xuất!');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook để sử dụng context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth phải được dùng trong AuthProvider');
  }
  return context;
};