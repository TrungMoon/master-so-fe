import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import api from '../services/api';
import { message } from 'antd';

// Định nghĩa kiểu dữ liệu cho User
interface User {
  id: number;
  email: string;
  fullName: string;
  phone?: string;
  roles?: string[]; // Roles for permission checking
}

// Định nghĩa kiểu cho Auth Context
interface AuthContextType {
  user: User | null;
  loading: boolean;
  authToken: string | null; // Add token for API calls
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    email: string;
    password: string;
    fullName: string;
    phone: string;
    dateOfBirth: Date;
  }) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: string) => boolean; // Check if user has specific permission
  isAdmin: () => boolean; // Check if user is admin
  isSuperAdmin: () => boolean; // Check if user is super admin
  isRegularUser: () => boolean; // Check if user is regular user
  getRedirectPath: () => string; // Get redirect path based on role
}

// Map roles to permissions
const rolePermissions: { [key: string]: string[] } = {
  SuperAdmin: [
    'create_story', 'edit_own_story', 'delete_own_story',
    'approve_story', 'reject_story', 'delete_any_story',
    'view_pending_stories', 'comment_story', 'moderate_comments',
    'view_users', 'edit_users', 'delete_users', 'manage_user_roles',
    'manage_slides', 'manage_ads', 'manage_settings', 'access_dashboard'
  ],
  Admin: [
    'create_story', 'edit_own_story', 'delete_own_story',
    'approve_story', 'reject_story', 'view_pending_stories',
    'comment_story', 'moderate_comments', 'view_users',
    'manage_slides', 'manage_ads', 'access_dashboard'
  ],
  User: [
    'create_story', 'edit_own_story', 'delete_own_story', 'comment_story'
  ]
};

// Tạo context với giá trị mặc định
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  authToken: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  hasPermission: () => false,
  isAdmin: () => false,
  isSuperAdmin: () => false,
  isRegularUser: () => false,
  getRedirectPath: () => '/',
});

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authToken, setAuthToken] = useState<string | null>(localStorage.getItem('token'));

  // Kiểm tra token khi khởi động app
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          setAuthToken(token);
          const { data } = await api.get('/users/me', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(data);
        }
      } catch (error) {
        localStorage.removeItem('token');
        setAuthToken(null);
        console.error('Authentication check failed:', error);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  // Check if user has a specific permission
  const hasPermission = (permission: string): boolean => {
    if (!user || !user.roles) return false;
    
    for (const role of user.roles) {
      if (rolePermissions[role]?.includes(permission)) {
        return true;
      }
    }
    
    return false;
  };
  
  // Check if user is admin
  const isAdmin = (): boolean => {
    return user?.roles?.includes('Admin') || false;
  };

  // Check if user is super admin
  const isSuperAdmin = (): boolean => {
    return user?.roles?.includes('SuperAdmin') || false;
  };

  // Check if user is regular user
  const isRegularUser = (): boolean => {
    return (user?.roles?.includes('User') && 
            !user.roles.includes('Admin') && 
            !user.roles.includes('SuperAdmin')) || false;
  };

  // Get redirect path based on role
  const getRedirectPath = (): string => {
    if (!user || !user.roles || user.roles.length === 0) {
      return '/';
    }
    
    if (user.roles.includes('SuperAdmin') || user.roles.includes('Admin')) {
      return '/admin/dashboard';
    }
    
    return '/';
  };

  // Xử lý đăng nhập
  const login = async (email: string, password: string) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      setAuthToken(data.token);
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
      setAuthToken(data.token);
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
    setAuthToken(null);
    setUser(null);
    message.success('Đã đăng xuất!');
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      authToken,
      login,
      register,
      logout,
      hasPermission,
      isAdmin,
      isSuperAdmin,
      isRegularUser,
      getRedirectPath
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook để sử dụng AuthContext
export const useAuth = () => useContext(AuthContext);