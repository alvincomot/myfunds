import { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Trash2, Tags } from 'lucide-react';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'income'
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/categories', formData);
      setShowModal(false);
      setFormData({ name: '', type: 'income' });
      fetchCategories();
    } catch (error) {
      alert('Gagal menyimpan kategori!');
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm('Yakin ingin menghapus kategori ini? Transaksi yang menggunakan kategori ini mungkin akan terpengaruh.')) {
      try {
        await api.delete(`/categories/${id}`);
        fetchCategories();
      } catch (error) {
        alert('Gagal menghapus kategori!');
      }
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Manajemen Kategori</h2>
          <p className="text-slate-500 mt-1 text-sm">Kelola kategori untuk Pemasukan dan Pengeluaran Anda</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium transition-all duration-200 shadow-sm shadow-indigo-200"
        >
          <Plus className="w-5 h-5" />
          Kategori Baru
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Kolom Pemasukan */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6">
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
            Kategori Pemasukan
          </h3>
          <div className="space-y-3">
            {categories.filter(c => c.type === 'income').map(item => (
              <div key={item.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                <span className="font-medium text-slate-700 flex items-center gap-2">
                  <Tags className="w-4 h-4 text-emerald-500" />
                  {item.name}
                </span>
                <button 
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Kolom Pengeluaran */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6">
            <span className="w-3 h-3 rounded-full bg-rose-500"></span>
            Kategori Pengeluaran
          </h3>
          <div className="space-y-3">
            {categories.filter(c => c.type === 'expense').map(item => (
              <div key={item.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                <span className="font-medium text-slate-700 flex items-center gap-2">
                  <Tags className="w-4 h-4 text-rose-500" />
                  {item.name}
                </span>
                <button 
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-lg text-slate-800">Tambah Kategori Baru</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 text-xl font-bold">&times;</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Nama Kategori</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                  placeholder="Contoh: Belanja Bulanan"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Tipe Kategori</label>
                <select 
                  value={formData.type}
                  onChange={e => setFormData({...formData, type: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                  required
                >
                  <option value="income">Pemasukan (Income)</option>
                  <option value="expense">Pengeluaran (Expense)</option>
                </select>
              </div>

              <div className="pt-2 flex gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl font-medium transition-colors">Batal</button>
                <button type="submit" className="flex-1 px-4 py-2.5 text-white bg-blue-500 hover:bg-blue-600 rounded-xl font-medium transition-colors">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
