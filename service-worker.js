const CACHE_NAME = "v7";
const ASSETS_TO_CACHE = [
  "/",              // index.html
  "/index.html",
  "/intro.png",
  "/manifest.json",
  "/style.css",
  "/script.js"
];

// 설치 단계 — 캐시 로드
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

// 활성화 단계 — 오래된 캐시 제거
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// fetch 인터셉트 — 온라인 우선, 실패하면 캐시 사용
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
