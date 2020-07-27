self.addEventListener('install', function(e) {
    e.waitUntil(
        caches.open('victor').then(function(cache) {
            return cache.addAll([
                '/scripts/vue.production.js',
                '/fonts/Lato-Black.ttf',
                '/fonts/Lato-Bold.ttf',
                '/fonts/Lato-Black.ttf',
                '/fonts/Lato-Light.ttf'
            ]);
        })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
            return response || fetch(event.request);
        })
    );
});