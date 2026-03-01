# Minimalist Pomodoro Timer

![License](https://img.shields.io/badge/license-MIT-blue.svg)

## Deskripsi

**Minimalist Pomodoro Timer** adalah aplikasi manajemen waktu berbasis web yang dirancang dengan antarmuka **Dark Glassmorphism 2.0** yang estetik dan minimalis. Aplikasi ini membantu Anda untuk tetap fokus dan rileks dengan antarmuka yang bebas distraksi.

## Fitur Unggulan

- ✨ **Desain Premium**: Antarmuka kaca gelap (Dark Glassmorphism) yang bersih dipadukan dengan aksen *cyan gradient*.
- ⏱️ **Circular Progress Ring**: Visualisasi waktu berjalan menggunakan representasi cincin (ring) SVG interaktif.
- 💾 **LocalStorage Memory**: Pengaturan waktu Anda (Work, Short Break, Long Break) akan otomatis tersimpan. Tidak perlu takut *refresh* halaman.
- 🏷️ **Dynamic Browser Title**: Cek sisa waktu fokus Anda langsung melalui judul tab browser.
- 🔔 **Notifikasi**: Alarm suara dan getaran (pada perangkat mobile) saat waktu habis dengan pergantian sesi yang otomatis.
- 📱 **Responsif**: Tampilan konsisten di desktop maupun mobile.

## Teknologi

- **Frontend**: HTML5, Modern CSS3 (CSS Variables, SVG Animation, Glass Effect), Vanilla JavaScript (ES6+).
- **Icons**: [Feather Icons](https://feathericons.com/) untuk grafis vector minimalis.
- **Backend / Server**: Node.js & Express (serving static files).

## Cara Menjalankan

1.  **Clone repository**:

    ```bash
    git clone https://github.com/NXRts/Pomodoro_Time.git
    cd Pomodoro_Time
    ```

2.  **Install dependencies**:

    ```bash
    npm install
    ```

3.  **Jalankan server**:

    ```bash
    npm start
    ```

4.  Buka browser dan akses: `http://localhost:3025`

## Struktur Project

- `public/`: Semua logika frontend (HTML, Animasi CSS, JS Timer logic, SVG Icons).
- `index.js`: Server backend sederhana.

---

Dikembangkan ulang dengan fokus estetik oleh **@NXRts**.
