const version = 1;
const appCacheName = `jjrr-cache-v${version}`;
const urlsToCache = [
  './',
  'index.html',
  'restaurant.html',
  'manifest.json',
  'data/restaurants.json',
  'build/js/app.js',
  'build/js/dbhelper.js',
  'build/js/main.js',
  'build/js/restaurant_info.js',
  'build/css/main.css',
  'assets/icons/favicon.ico',
  '//fonts.googleapis.com/css?family=Source+Sans+Pro:400,700'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(appCacheName).then(function(cache) {
      console.log('Service Worker installed');
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('activate', function(event) {
  //console.log('Activating new service worker...');
  event.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (appCacheName.indexOf(key) === -1) {
          return caches.delete(key);
        }
      }));
    })
  );
});

self.addEventListener('fetch', function(event) {
  //console.log('Handling fetch event for', event.request.url);

  if (event.request.method === 'GET') {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      if (response) {
        //console.log('Found response in cache:', response);
        return response;
      }
      //console.log('No response found in cache. About to fetch from network...');

      return fetch(event.request).then(function(response) {
        //console.log('Response from network is:', response);
        return response;
      }).catch(function(error) {
        //console.error('Fetching failed:', error);
        throw error;
      });
    })
  );
  }

});
