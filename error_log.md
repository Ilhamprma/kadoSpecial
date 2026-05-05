# Log Masalah & Solusi (Error Log)

Dokumen ini berisi catatan singkat mengenai kesalahan/masalah (*error*) yang ditemui selama proses pengembangan dan bagaimana cara menyelesaikannya.

---

### 1. `vite` command not recognized (Server tidak bisa jalan)
- **Masalah:** Saat menjalankan `npm run dev`, terminal menampilkan error bahwa perintah `vite` tidak dikenali.
- **Penyebab:** Folder `node_modules` rusak atau terhapus setelah membersihkan struktur proyek (_boilerplate_) Vite sebelumnya.
- **Solusi:** Menghapus folder `node_modules` lama yang tersisa, lalu menjalankan `npm install` ulang secara menyeluruh, serta mematikan terminal/proses lama (`kill-port`) jika port menyangkut.

### 2. Tampilan *Blank* (Putih Kosong) tanpa Error di Konsol Browser
- **Masalah:** Laman web berhasil diakses (`http://localhost:5173`) tetapi tampilannya hanya layar putih kosong, dan *DevTools Console* di browser tidak menunjukkan error apa-apa.
- **Penyebab:** Ada *error* kompilasi TypeScript (seperti *import* ikon yang salah dari `lucide-react`) yang membuat _Hot Module Replacement_ (HMR) Vite gagal me-*render* komponen React secara diam-diam.
- **Solusi:** Melihat langsung pesan *error* dari *compiler* melalui terminal dengan menjalankan `npm run build` atau `npx tsc --noEmit`, lalu memperbaiki error yang ditunjuk satu per satu.

### 3. Error Kompilasi `lucide-react`
- **Masalah:** Build gagal dengan keterangan ikon tidak ditemukan.
- **Penyebab:** Terjadi kesalahan penulisan nama ikon yang di-*import* (menggunakan `RocketLaunch`, padahal namanya di library adalah `Rocket`).
- **Solusi:** Mengubah import ikon dengan nama yang valid: `import { Target, Rocket, ShieldCheck } from 'lucide-react';`.

### 4. JSX Parsing Error ("Unexpected token `>`")
- **Masalah:** Komentator/Terminal Vite menampilkan *error parsing* saat membaca file komponen (contoh: `Hero.tsx`).
- **Penyebab:** Penggunaan karakter kurung siku (seperti simbol *greater-than* `>`) secara langsung (*raw text*) di dalam elemen JSX (`<p>`). JSX bingung mengira itu adalah penutup _tag_ HTML.
- **Solusi:** Melakukan *escape character* pada simbol tersebut dengan mengubah karakter `>` menjadi format entitas HTML `&gt;`.
