# 🏫 School Inventory Management System (Backend API)

Backend RESTful API untuk sistem manajemen inventaris sekolah (Peminjaman & Pengembalian Barang). Dibangun menggunakan Node.js, Express, dan MongoDB dengan menerapkan sistem *Role-Based Access Control* (RBAC), dokumentasi interaktif Swagger, serta pencatatan log aktivitas sistem.

---

## 🚀 Fitur Utama
- **Autentikasi & Otorisasi**: Sistem keamanan berbasis JWT (JSON Web Token) dengan peran (*roles*) ganda: **Admin** dan **User**.
- **Manajemen Barang (Items)**: CRUD data barang lengkap dengan pengelolaan stok secara real-time.
- **Sistem Peminjaman (Loans)**: 
  - Pengajuan peminjaman barang oleh *User*.
  - Verifikasi (Setujui/Tolak) oleh *Admin* yang otomatis memotong stok barang.
  - Fitur pengembalian barang (*Return*) yang otomatis mengembalikan jumlah stok ke sistem.
- **Activity Log**: Pencatatan riwayat aktivitas pengguna dan integrasi sistem eksternal.
- **Dokumentasi API**: Terintegrasi penuh dengan Swagger UI.

---

## 💻 Teknologi yang Digunakan
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB & Mongoose (ODM)
- **Autentikasi**: JSON Web Token (JWT) & bcryptjs
- **Dokumentasi**: Swagger JSDoc / Swagger UI Express

---

## 📂 Struktur Proyek
```text
project-root/
│
├── controller/        # Logika bisnis (item, loan, auth, activityLog)
├── model/             # Skema database Mongoose
├── routes/            # Pengaturan endpoint API
├── middleware/        # Middleware autentikasi, otorisasi, & penanganan error
├── util/              # Fungsi bantu (AppError, catchAsync, dll)
├── .env               # Environment variables (lokal)
├── .gitignore         # Daftar file yang diabaikan oleh Git
├── server.js # Titik masuk aplikasi (Entry point)
└── README.md          # Dokumentasi proyek