// 서비스 워커 설치 단계
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('v1').then((cache) => {
      return cache.addAll([
        '/',  // 홈 화면
        '/index.html',  // 인덱스 HTML
        '/style.css',  // 스타일 시트
        '/script.js',  // 자바스크립트 파일
        '/manifest.json',  // manifest 파일
        '/icons/icon-192x192.png',  // 192x192 아이콘
        '/icons/icon-512x512.png',  // 512x512 아이콘
      ]);
    })
  );
});

// 서비스 워커 활성화 후 캐시된 파일로 요청 처리
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // 캐시된 응답이 있으면 그 응답을 사용하고, 없으면 네트워크에서 가져옴
      return cachedResponse || fetch(event.request);
    })
  );
});
