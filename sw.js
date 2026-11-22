/* ทำให้ติดตั้งเป็นแอปได้ + เปิดหน้าแอปได้เร็วแม้เน็ตช้า (ข้อมูลจริงยังมาจากระบบออนไลน์เสมอ) */
const C = 'anesstock-shell-v5';
const SHELL = ['./', 'index.html', 'config.js', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png', 'favicon.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(C).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (u.origin !== location.origin || e.request.method !== 'GET') return; // ระบบหลัก (Google) ไม่แตะ
  // ดึงของใหม่ก่อน ถ้าออฟไลน์ค่อยใช้ของที่เก็บไว้
  e.respondWith(fetch(e.request).then(r => { const cp = r.clone(); caches.open(C).then(c => c.put(e.request, cp)); return r; }).catch(() => caches.match(e.request).then(r => r || caches.match('index.html'))));
});
