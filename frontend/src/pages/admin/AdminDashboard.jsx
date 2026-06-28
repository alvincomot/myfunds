import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Users, CreditCard, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/admin/dashboard-stats');
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch admin stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="text-center text-slate-500 py-12">Memuat dashboard...</div>;

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Admin Dashboard</h2>
        <p className="text-slate-500 mt-1 text-sm">Ringkasan aktivitas seluruh sistem</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-slate-500 font-medium">Total Pengguna</h3>
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h4 className="text-3xl font-bold text-slate-800">{stats?.total_users || 0}</h4>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-slate-500 font-medium">Total Transaksi</h3>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h4 className="text-3xl font-bold text-slate-800">{stats?.total_transactions || 0}</h4>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-slate-500 font-medium">Total Pemasukan Global</h3>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h4 className="text-xl font-bold text-slate-800 truncate">
              Rp {new Intl.NumberFormat('id-ID').format(stats?.total_incomes || 0)}
            </h4>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-slate-500 font-medium">Total Pengeluaran Global</h3>
            <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
              <ArrowDownRight className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h4 className="text-xl font-bold text-slate-800 truncate">
              Rp {new Intl.NumberFormat('id-ID').format(stats?.total_expenses || 0)}
            </h4>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="font-bold text-lg text-slate-800">Pendaftar Baru Terakhir</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-sm">
                <th className="p-4 font-semibold text-slate-600">Nama</th>
                <th className="p-4 font-semibold text-slate-600">Email</th>
                <th className="p-4 font-semibold text-slate-600">Role</th>
                <th className="p-4 font-semibold text-slate-600">Tgl Bergabung</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recent_users?.map(user => (
                <tr key={user.id} className="border-b border-slate-50">
                  <td className="p-4 text-sm font-medium text-slate-700">{user.name}</td>
                  <td className="p-4 text-sm text-slate-500">{user.email}</td>
                  <td className="p-4 text-sm capitalize">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-slate-500">
                    {new Date(user.created_at).toLocaleDateString('id-ID')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
