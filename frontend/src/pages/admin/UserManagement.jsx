import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Pencil, Trash2, Shield, User, Search } from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    email: '',
    role: 'user',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setFormData({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/admin/users/${formData.id}`, formData);
      setShowModal(false);
      fetchUsers();
    } catch (error) {
      alert(error.response?.data?.message || 'Gagal mengubah pengguna!');
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm('Yakin ingin menghapus pengguna ini beserta semua data transaksinya?')) {
      try {
        await api.delete(`/admin/users/${id}`);
        fetchUsers();
      } catch (error) {
        alert(error.response?.data?.message || 'Gagal menghapus pengguna!');
      }
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Kelola Pengguna</h2>
          <p className="text-slate-500 mt-1 text-sm">Manajemen akses dan data akun pengguna</p>
        </div>
        
        <div className="relative w-full md:w-64">
          <input 
            type="text" 
            placeholder="Cari pengguna..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none shadow-sm"
          />
          <Search className="w-5 h-5 text-slate-400 absolute left-3 top-3" />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-400">Memuat data pengguna...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-sm">
                  <th className="p-4 font-semibold text-slate-600">ID</th>
                  <th className="p-4 font-semibold text-slate-600">Info Pengguna</th>
                  <th className="p-4 font-semibold text-slate-600">Role</th>
                  <th className="p-4 font-semibold text-slate-600">Tgl Bergabung</th>
                  <th className="p-4 font-semibold text-slate-600 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-slate-400">Tidak ada pengguna yang ditemukan.</td>
                  </tr>
                ) : (
                  filteredUsers.map(user => (
                    <tr key={user.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 text-sm text-slate-400">#{user.id}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-700 font-bold shrink-0">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-700 text-sm">{user.name}</p>
                            <p className="text-slate-500 text-xs">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                          user.role === 'admin' ? 'bg-blue-50 text-blue-700 border border-purple-100' : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}>
                          {user.role === 'admin' ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                          <span className="capitalize">{user.role}</span>
                        </span>
                      </td>
                      <td className="p-4 text-sm text-slate-500">
                        {new Date(user.created_at).toLocaleDateString('id-ID')}
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => handleEdit(user)}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit User"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(user.id)}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Hapus User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-lg text-slate-800">Edit Kredensial Pengguna</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 text-xl font-bold">&times;</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Nama Lengkap</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Akses</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Role Pengguna</label>
                <select 
                  value={formData.role}
                  onChange={e => setFormData({...formData, role: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                  required
                >
                  <option value="user">User</option>
                  <option value="admin">Administrator</option>
                </select>
                <p className="text-xs text-slate-500 mt-2">
                  *Admin memiliki akses penuh ke Dashboard ini. Pastikan Anda tidak salah memilih.
                </p>
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl font-medium transition-colors">Batal</button>
                <button type="submit" className="flex-1 px-4 py-2.5 text-white bg-blue-500 hover:bg-blue-600 rounded-xl font-medium transition-colors">Simpan Perubahan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
