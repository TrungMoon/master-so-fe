import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LayoutComponent from './components/Layout';
import Home from './pages/Home';
import Tools from './pages/Tools';
import Article from './pages/Article';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
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

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<LayoutComponent><Home /></LayoutComponent>} />
            <Route path="/articles/:category" element={<LayoutComponent><Article /></LayoutComponent>} />
            
            {/* Protected routes */}
            <Route 
              path="/tools/calculator" 
              element={
                <ProtectedRoute>
                  <LayoutComponent><Tools /></LayoutComponent>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <LayoutComponent><Profile /></LayoutComponent>
                </ProtectedRoute>
              } 
            />
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
