// importScripts('sw-toolbox.js');

// toolbox.precache([
//   'index.html',
//   'func.js',
//   // 'styles.css',
// ]);


const CACHE = 'network-or-cache-v1';
const timeout = 1000;
// При установке воркера мы должны закешировать часть данных (статику).
self.addEventListener('install', (event) => {
    console.log('Происходит запрос на сервер');
    event.waitUntil(
        caches.open(CACHE).then((cache) => cache.addAll([
            "func.js",
            "images/icon.png",
            "index.html",
            "manifest.json",
            "bluetooth.js",
            "bootstrap.bundle.min.js",
            "bootstrap.min.css",
            "graph.js"
        ])
        ));
});

// при событии fetch, мы и делаем запрос, но используем кэш, только после истечения timeout.
self.addEventListener('fetch', (event) => {
    event.respondWith(fromNetwork(event.request, timeout)
        .catch((err) => {
            console.log(`Error: ${err.message()}`);
            return fromCache(event.request);
        }));
});

// Временно-ограниченный запрос.
function fromNetwork(request, timeout) {
    return new Promise((fulfill, reject) => {
        var timeoutId = setTimeout(reject, timeout);
        console.log('net');
        fetch(request).then((response) => {
            clearTimeout(timeoutId);
            fulfill(response);
        }, reject);
    });
}

function fromCache(request) {
    console.log('Cache');
    // Открываем наше хранилище кэша (CacheStorage API), выполняем поиск запрошенного ресурса.
    // Обратите внимание, что в случае отсутствия соответствия значения Promise выполнится успешно, но со значением `undefined`
    return caches.open(CACHE).then((cache) =>
        cache.match(request).then((matching) =>
            matching || Promise.reject('no-match')
        ));
}
