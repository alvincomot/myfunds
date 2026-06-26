import { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Trash2, ArrowUpRight } from 'lucide-react';

const Incomes = () => {
  const [incomes, setIncomes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    category_id: '',
    transaction_date: new Date().toISOString().split('T')[0],
    description: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [incomesRes, categoriesRes] = await Promise.all([
        api.get('/incomes'),
        api.get('/categories')
      ]);
      setIncomes(incomesRes.data);
      setCategories(categoriesRes.data.filter(c => c.type === 'income'));
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/incomes', formData);
      setShowModal(false);
      setFormData({ ...formData, amount: '', description: '' });
      fetchData(); // refresh list
    } catch (error) {
      alert('Gagal menyimpan data!');
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm('Yakin ingin menghapus data ini?')) {
      try {
        await api.delete(`/incomes/${id}`);
        fetchData();
      } catch (error) {
        alert('Gagal menghapus data!');
      }
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Catatan Pemasukan</h2>
          <p className="text-slate-500 mt-1 text-sm">Kelola dan pantau semua aliran dana masuk Anda</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all duration-200 shadow-sm shadow-indigo-200"
        >
          <Plus className="w-5 h-5" />
          Tambah Pemasukan
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-400">Memuat data...</div>
        ) : incomes.length === 0 ? (
          <div className="p-8 text-center text-slate-400">Data pemasukan masih kosong.</div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="p-4 font-semibold text-slate-600 text-sm whitespace-nowrap">Tanggal</th>
                    <th className="p-4 font-semibold text-slate-600 text-sm whitespace-nowrap">Kategori</th>
                    <th className="p-4 font-semibold text-slate-600 text-sm whitespace-nowrap">Keterangan</th>
                    <th className="p-4 font-semibold text-slate-600 text-sm text-right whitespace-nowrap">Jumlah</th>
                    <th className="p-4 font-semibold text-slate-600 text-sm text-center whitespace-nowrap">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {incomes.map(item => (
                    <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 text-slate-600 text-sm whitespace-nowrap">
                        {new Date(item.transaction_date).toLocaleDateString('id-ID')}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                          <ArrowUpRight className="w-3 h-3" />
                          {item.category?.name}
                        </span>
                      </td>
                      <td className="p-4 text-slate-700 text-sm">{item.description || '-'}</td>
                      <td className="p-4 text-right font-bold text-emerald-600 whitespace-nowrap">
                        Rp {new Intl.NumberFormat('id-ID').format(item.amount)}
                      </td>
                      <td className="p-4 text-center whitespace-nowrap">
                        <button 
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden grid gap-4 p-4">
              {incomes.map(item => (
                <div key={item.id} className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col gap-3 relative">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex flex-col gap-1">
                      <span className="inline-flex items-center gap-1 w-max px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-100 mb-1">
                        <ArrowUpRight className="w-3 h-3" />
                        {item.category?.name}
                      </span>
                      <p className="font-medium text-slate-800 text-sm leading-tight">{item.description || 'Tanpa keterangan'}</p>
                      <p className="text-xs text-slate-500">{new Date(item.transaction_date).toLocaleDateString('id-ID')}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="font-bold text-emerald-600">
                        +Rp {new Intl.NumberFormat('id-ID').format(item.amount)}
                      </span>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 bg-white hover:bg-rose-50 rounded-lg shadow-sm border border-slate-200 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Modal Tambah */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-lg text-slate-800">Tambah Pemasukan Baru</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 text-xl font-bold">&times;</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Tanggal</label>
                <input 
                  type="date" 
                  value={formData.transaction_date}
                  onChange={e => setFormData({...formData, transaction_date: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Kategori</label>
                <select 
                  value={formData.category_id}
                  onChange={e => setFormData({...formData, category_id: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                  required
                >
                  <option value="">-- Pilih Kategori --</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Jumlah (Rp)</label>
                <input 
                  type="number" 
                  value={formData.amount}
                  onChange={e => setFormData({...formData, amount: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                  placeholder="0"
                  min="100"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Keterangan (Opsional)</label>
                <textarea 
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none resize-none h-24"
                  placeholder="Contoh: Gaji bulan ini"
                ></textarea>
              </div>

              <div className="pt-2 flex gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl font-medium transition-colors">Batal</button>
                <button type="submit" className="flex-1 px-4 py-2.5 text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl font-medium transition-colors">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Incomes;
