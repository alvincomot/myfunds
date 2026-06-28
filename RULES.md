# Pedoman Pengembangan (Developer Rules)

File ini berisi aturan ketat yang WAJIB diikuti oleh AI Assistant (Antigravity) selama membantu pengembangan proyek ini.

## Aturan Git (Version Control)
- **DILARANG KERAS** menggunakan `git add .` atau `git add -A` atau `git commit -a`.
- Setiap kali akan melakukan *commit*, AI wajib melakukan `git add` hanya pada spesifik path file yang baru saja diubah. (Contoh: `git add frontend/src/pages/Dashboard.jsx`).
- Gunakan bahasa Inggris yang baku dan profesional dengan format *Conventional Commits* (seperti `feat:`, `fix:`, `style:`, `refactor:`) untuk setiap pesan *commit*.

## Aturan Kode (Coding Guidelines)
- (Tambahkan aturan arsitektur, misalnya: "Gunakan Tailwind CSS untuk styling", "Jangan gunakan sembarang library tanpa izin", dll).

## Aturan Lainnya
- (Tambahkan aturan lain yang Anda inginkan di sini).
