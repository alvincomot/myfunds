import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Wallet, Receipt, Tags, LogOut, Users, ShieldAlert, Menu, X } from 'lucide-react';
import api from '../services/api';
import { useState, useEffect } from 'react';

const Layout = ({ setAuth }) => {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // Close sidebar on route change in mobile
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location]);

  const handleLogout = async () => {
    try {
      await api.post('/logout');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      setAuth(false);
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Pemasukan', path: '/incomes', icon: Wallet },
    { name: 'Pengeluaran', path: '/expenses', icon: Receipt },
    { name: 'Kategori', path: '/categories', icon: Tags },
  ];

  const adminItems = [
    { name: 'Admin Dashboard', path: '/admin', icon: ShieldAlert },
    { name: 'Kelola Pengguna', path: '/admin/users', icon: Users },
  ];

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-hidden">
      
      {/* Mobile Top Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 z-40">
        <div className="flex items-center gap-2">
          <span className="font-bold text-xl tracking-tight text-slate-800">
            MyFunds
          </span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col shadow-xl md:shadow-sm transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-extrabold text-2xl tracking-tight text-slate-800">
              MyFunds
            </span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 font-medium shadow-sm ring-1 ring-indigo-100'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110' : ''}`} />
                {item.name}
              </Link>
            );
          })}

          {user?.role === 'admin' && (
            <>
              <div className="pt-6 pb-2 px-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Admin Area</p>
              </div>
              {adminItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path || (location.pathname.startsWith(item.path) && item.path !== '/admin');
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                      isActive
                        ? 'bg-rose-50 text-rose-700 font-medium shadow-sm ring-1 ring-rose-100'
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110' : ''}`} />
                    {item.name}
                  </Link>
                );
              })}
            </>
          )}
        </nav>

        <div className="p-4 border-t border-slate-100 bg-white">
          <div className="px-4 py-3 mb-2 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-sm shrink-0">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="text-sm min-w-0 flex-1">
              <p className="font-bold text-slate-700 truncate">{user?.name || 'User'}</p>
              <p className="text-slate-400 text-xs truncate capitalize">{user?.role || 'user'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-3 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors font-medium"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-slate-50 relative pt-16 md:pt-0">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>

    </div>
  );
};

export default Layout;
