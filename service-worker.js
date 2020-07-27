self.addEventListener('install', function(e) {
    e.waitUntil(
        caches.open('victor').then(function(cache) {
            return cache.addAll([
                '/scripts/vue.production.js'
            ]);
        })
    );
});

// self.addEventListener('fetch', function(event) {
//     event.respondWith(
//         caches.match(event.request).then(function(response) {
//             return response || fetch(event.request);
//         })
//     );
// });