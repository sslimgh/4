/* 헬로 모모 아일랜드 앱
   게임 파일(index.html)은 크기가 커서 한 번 받아 두고 다음부터는 바로 열어요.
   index.html을 새로 올릴 때는 아래 번호를 하나 올려 주세요 (예: v2 → v3). 그래야 학생 휴대폰도 새 버전을 받아요. */
const CACHE = 'momo-app-v13';
const SHELL = ['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'icon-maskable-512.png', 'apple-touch-icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL.map(u => new Request(u, { cache: 'reload' })))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request, u = new URL(req.url);
  if (req.method !== 'GET' || u.origin !== location.origin) return;   // 구글 서버로 가는 기록 요청은 건드리지 않아요
  if (u.pathname.endsWith('/sw.js')) return;
  const isPage = req.mode === 'navigate' || u.pathname.endsWith('/') || u.pathname.endsWith('index.html');
  // 저장해 둔 것을 먼저 쓰고, 없으면 인터넷에서 받아 저장
  e.respondWith(
    caches.open(CACHE).then(c => c.match(isPage ? 'index.html' : req, { ignoreSearch: true }).then(hit => hit || fetch(req).then(r => {
      if (r && r.ok && !isPage) c.put(req, r.clone());
      if (r && r.ok && isPage && u.search === '') c.put('index.html', r.clone());
      return r;
    })))
  );
});
