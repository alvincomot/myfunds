import { useState, useEffect } from 'react';
import api from '../services/api';
import { ArrowUpRight, ArrowDownRight, Wallet, Activity, CreditCard } from 'lucide-react';

const StatCard = ({ title, amount, icon: Icon, type }) => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 group">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold tracking-tight text-slate-900">
            Rp {new Intl.NumberFormat('id-ID').format(amount)}
          </h3>
        </div>
        <div className={`p-3 rounded-xl ${
          type === 'income' ? 'bg-emerald-50 text-emerald-600' :
          type === 'expense' ? 'bg-rose-50 text-rose-600' :
          'bg-indigo-50 text-indigo-600'
        } group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await api.get('/dashboard');
      setData(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex space-x-4 animate-pulse">
        <div className="h-32 w-1/3 bg-slate-200 rounded-2xl"></div>
        <div className="h-32 w-1/3 bg-slate-200 rounded-2xl"></div>
        <div className="h-32 w-1/3 bg-slate-200 rounded-2xl"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Saldo" 
          amount={data?.currentBalance || 0} 
          icon={Wallet} 
          type="balance" 
          trendValue={data?.balancePercentage || 0} 
        />
        <StatCard 
          title="Pemasukan Bulan Ini" 
          amount={data?.monthlyIncome || 0} 
          icon={ArrowUpRight} 
          type="income" 
          trendValue={data?.incomePercentage || 0} 
        />
        <StatCard 
          title="Pengeluaran Bulan Ini" 
          amount={data?.monthlyExpense || 0} 
          icon={ArrowDownRight} 
          type="expense" 
          trendValue={data?.expensePercentage || 0} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-500" />
              Transaksi Terakhir
            </h3>
            <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700">Lihat Semua</button>
          </div>
          
          <div className="space-y-4">
            {data?.recentTransactions?.slice(0, 5).map((trx) => (
              <div key={trx.id} className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-full ${
                    trx.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
                  }`}>
                    {trx.type === 'income' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">{trx.description || trx.category?.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{new Date(trx.transaction_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                </div>
                <div className={`font-bold ${trx.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {trx.type === 'income' ? '+' : '-'} Rp {new Intl.NumberFormat('id-ID').format(trx.amount)}
                </div>
              </div>
            ))}
            
            {(!data?.recentTransactions || data.recentTransactions.length === 0) && (
              <div className="text-center py-8 text-slate-400">Belum ada transaksi.</div>
            )}
          </div>
        </div>

        {/* Expense by Category (Mockup representation) */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6">
            <CreditCard className="w-5 h-5 text-indigo-500" />
            Pengeluaran per Kategori
          </h3>
          <div className="space-y-5">
            {data?.expenseByCategory?.map((item, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-slate-700">{item.category?.name}</span>
                  <span className="font-bold text-slate-900">Rp {new Intl.NumberFormat('id-ID').format(item.total)}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-indigo-500 h-2 rounded-full" 
                    style={{ width: `${Math.min((item.total / data.monthlyExpense) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
            
            {(!data?.expenseByCategory || data.expenseByCategory.length === 0) && (
              <div className="text-center py-8 text-slate-400">Tidak ada data bulan ini.</div>
            )}
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default Dashboard;
