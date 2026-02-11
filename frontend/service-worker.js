self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("respawn-cache").then((cache) => {
      return cache.addAll([
        "./",
        "./index.html",
        "./192x192.png",
        "./512x512.png"
      ]);
    })
  );
});
