/*
 * Estrategia: RED PRIMERO. El caché es solo respaldo sin conexión.
 * - Cada carga con conexión revalida con el servidor (cache:'no-cache' => 304 liviano si no hubo cambios).
 * - Si la red tarda más de TIMEOUT_MS o falla, responde con el caché.
 * - El contenido nuevo NO depende de cambiar este archivo: no hace falta subir versión al publicar.
 *   Solo editá ASSETS si agregás o quitás archivos.
 */
var CACHE = 'westley';
var TIMEOUT_MS = 4000;
var ASSETS = [
  './',
  'index.html',
  'app.js',
  'styles.css',
  'manifest.json',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/icon-maskable-512.png',
  'icons/icon-maskable-640.png',
  'icons/apple-touch-icon.png'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (cache) {
      // Uno por uno: si falta un archivo, no falla toda la instalación. 'reload' ignora el caché HTTP.
      return Promise.all(ASSETS.map(function (url) {
        return cache.add(new Request(url, { cache: 'reload' })).catch(function () {});
      }));
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      var old = keys.filter(function (k) { return k !== CACHE; });
      return Promise.all(old.map(function (k) { return caches.delete(k); }))
        .then(function () { return self.clients.claim(); })
        .then(function () {
          if (!old.length) return; // primera instalación: nada que refrescar
          // Había una versión anterior: recarga las pestañas abiertas para dejarlas en la versión nueva.
          return self.clients.matchAll({ type: 'window' }).then(function (list) {
            return Promise.all(list.map(function (c) {
              return c.navigate(c.url).catch(function () {});
            }));
          });
        });
    })
  );
});

function fromCache(req) {
  return caches.match(req, { ignoreSearch: true }).then(function (hit) {
    return hit || (req.mode === 'navigate' ? caches.match('index.html') : undefined);
  });
}

function networkFirst(e) {
  var req = e.request;
  return new Promise(function (resolve) {
    var done = false;
    function finish(res) { if (!done) { done = true; resolve(res); } }

    var timer = setTimeout(function () {
      fromCache(req).then(function (hit) { if (hit) finish(hit); });
    }, TIMEOUT_MS);

    fetch(req, { cache: 'no-cache' }).then(function (res) {
      clearTimeout(timer);
      if (res.ok) {
        var copy = res.clone();
        var put = caches.open(CACHE).then(function (c) { return c.put(req, copy); }).catch(function () {});
        try { e.waitUntil(put); } catch (_) {}
        finish(res);
      } else {
        fromCache(req).then(function (hit) { finish(hit || res); });
      }
    }).catch(function () {
      clearTimeout(timer);
      fromCache(req).then(function (hit) { finish(hit || Response.error()); });
    });
  });
}

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(networkFirst(e));
});
