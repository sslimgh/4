/* 헬로 모모 아일랜드 앱 — 앱 겉모습(아이콘·첫 화면)만 저장해요. 게임 자체는 항상 인터넷에서 새로 불러와요.
   index.html을 고치면 아래 번호를 하나 올려 주세요 (v1 → v2). */
const CACHE = 'momo-app-v1';
const SHELL = ['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'icon-maskable-512.png', 'apple-touch-icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;  // 구글 게임 주소는 건드리지 않음
  // 인터넷 먼저, 안 되면 저장해 둔 것
  e.respondWith(fetch(e.request).then(r => {
    const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {});
    return r;
  }).catch(() => caches.match(e.request).then(r => r || caches.match('index.html'))));
});
