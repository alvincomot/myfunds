import { Link } from 'react-router-dom';

const Register = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Daftar Akun Baru</h2>
        <p className="text-slate-500 mb-8">Halaman ini sedang dalam tahap pengembangan.</p>
        <Link to="/login" className="text-indigo-600 font-medium hover:underline">
          Kembali ke Login
        </Link>
      </div>
    </div>
  );
};
export default Register;
