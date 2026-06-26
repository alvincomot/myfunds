import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Incomes from './pages/Incomes';
import Expenses from './pages/Expenses';
import Categories from './pages/Categories';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import Layout from './components/Layout';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setIsAuthenticated(true);
      setUserRole(JSON.parse(userData).role);
    }
    setLoading(false);
  }, []);

  if (loading) return <div className="flex h-screen items-center justify-center text-slate-500">Loading...</div>;

  const AdminRoute = ({ children }) => {
    if (!isAuthenticated) return <Navigate to="/login" />;
    if (userRole !== 'admin') return <Navigate to="/dashboard" />;
    return children;
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <Login setAuth={(status, role) => { setIsAuthenticated(status); setUserRole(role); }} /> : <Navigate to={userRole === 'admin' ? "/admin" : "/dashboard"} />} />
        <Route path="/register" element={!isAuthenticated ? <Register setAuth={(status, role) => { setIsAuthenticated(status); setUserRole(role); }} /> : <Navigate to="/dashboard" />} />
        
        {/* Protected Routes */}
        <Route path="/" element={isAuthenticated ? <Layout setAuth={setIsAuthenticated} /> : <Navigate to="/login" />}>
          <Route index element={<Navigate to={userRole === 'admin' ? "/admin" : "/dashboard"} />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="incomes" element={<Incomes />} />
          <Route path="expenses" element={<Expenses />} />
          <Route path="categories" element={<Categories />} />
          
          {/* Admin Routes */}
          <Route path="admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="admin/users" element={<AdminRoute><UserManagement /></AdminRoute>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
