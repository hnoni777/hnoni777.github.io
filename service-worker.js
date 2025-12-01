// ⭐ 캐시 버전 v2
const CACHE_NAME = "v2";

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll([
                "./",
                "./index.html",
                "./manifest.json",
                "./icon-192.png",
                "./icon-512.png"
            ]);
        })
    );
    self.skipWaiting(); // 새 버전 즉시 활성화
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys
                    .filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))  // ⭐ v2 외 모든 캐시 삭제
            );
        })
    );
    self.clients.claim(); // 모든 탭에 새 SW 즉시 적용
});

self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});
