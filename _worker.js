export default {
  async fetch(request) {
    // 1. Ambil URL asli dari permintaan
    const url = new URL(request.url);

    // 2. Ekstrak URL target dari path.
    // Contoh: dari "/https://example.com/file", kita ambil "https://example.com/file"
    let targetUrlString = url.pathname.slice(1);

    // Jika path kosong (hanya mengakses root), berikan pesan cara penggunaan
    // Gunakan dengan format: https://nama-proyek.pages.dev/URL_TARGET
    if (targetUrlString === "") {
      return new Response(
        "Mau Ngapain Bro", {
          status: 400,
          headers: { 'Content-Type': 'text/plain' },
        }
      );
    }
    
    // Tambahkan kembali query string jika ada (misal: ?token=xyz)
    if (url.search) {
      targetUrlString += url.search;
    }

    // Validasi sederhana apakah string yang diekstrak adalah URL yang valid
    if (!targetUrlString.startsWith('http://') && !targetUrlString.startsWith('https://')) {
        return new Response('URL target tidak valid. Harus diawali dengan http:// atau https://', { status: 400 });
    }

    // 3. Siapkan header yang akan dikirim ke server tujuan (Vision+)
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36',
      'Referer': 'https://visionplus.id',
      'Origin': 'https://visionplus.id',
    };

    // 4. Lakukan permintaan ke URL target dengan header kustom
    const response = await fetch(targetUrlString, { headers });

    // 5. Buat respons baru untuk dikirim ke browser
    const newResponse = new Response(response.body, response);

    // 6. Tambahkan header CORS agar browser tidak memblokir konten
    newResponse.headers.set('Access-Control-Allow-Origin', '*');
    newResponse.headers.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
    newResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Range');
    newResponse.headers.set('Access-Control-Expose-Headers', 'Content-Length, Content-Range');

    return newResponse;
  },
};