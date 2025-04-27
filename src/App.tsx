import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import LayoutComponent from './components/Layout';
import AdminLayout from './components/AdminLayout';
import Home from './pages/Home';
import Tools from './pages/Tools';
import Article from './pages/Article';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Stories from './pages/Stories';
import StoryCreate from './pages/Stories/Create';
import StoryModeration from './pages/Admin/StoryModeration';
import AdminDashboard from './pages/Admin/Dashboard';
import UserManagement from './pages/Admin/Users';
import SearchPage from './pages/Search';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './App.css';

// Create a query client for React Query
const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Đang tải...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Admin route component
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading, isAdmin, isSuperAdmin } = useAuth();
  
  if (loading) {
    return <div>Đang tải...</div>;
  }
  
  if (!user || (!isAdmin() && !isSuperAdmin())) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

// Super Admin route component
const SuperAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading, isSuperAdmin } = useAuth();
  
  if (loading) {
    return <div>Đang tải...</div>;
  }
  
  if (!user || !isSuperAdmin()) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* All routes with regular layout */}
            <Route element={<LayoutComponent><Outlet /></LayoutComponent>}>
              <Route path="/" element={<Home />} />
              <Route path="tools" element={<Tools />} />
              <Route path="article/:id" element={<Article />} />
              <Route path="stories" element={<Stories />} />
              <Route path="search" element={<SearchPage />} />
              <Route
                path="stories/create"
                element={
                  <ProtectedRoute>
                    <StoryCreate />
                  </ProtectedRoute>
                }
              />
              <Route
                path="profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
            </Route>
            
            {/* Admin routes with admin layout */}
            <Route 
              path="/admin" 
              element={
                <AdminRoute>
                  <AdminLayout>
                    <AdminDashboard />
                  </AdminLayout>
                </AdminRoute>
              } 
            />
            <Route 
              path="/admin/dashboard" 
              element={
                <AdminRoute>
                  <AdminLayout>
                    <AdminDashboard />
                  </AdminLayout>
                </AdminRoute>
              } 
            />
            <Route 
              path="/admin/story-moderation" 
              element={
                <AdminRoute>
                  <AdminLayout>
                    <StoryModeration />
                  </AdminLayout>
                </AdminRoute>
              } 
            />
            <Route 
              path="/admin/users" 
              element={
                <AdminRoute>
                  <AdminLayout>
                    <UserManagement />
                  </AdminLayout>
                </AdminRoute>
              } 
            />
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
