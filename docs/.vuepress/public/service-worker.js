/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "404.html",
    "revision": "5b8c6b4545b85d8e55c7462850e965da"
  },
  {
    "url": "about/index.html",
    "revision": "ea7809d9c6a0dd195cded68fe4ebdbdd"
  },
  {
    "url": "assets/css/0.styles.6d35fd04.css",
    "revision": "6d129e6445bb9762a89cddc57a8c9d67"
  },
  {
    "url": "assets/img/search.83621669.svg",
    "revision": "83621669651b9a3d4bf64d1a670ad856"
  },
  {
    "url": "assets/js/10.5a6adf80.js",
    "revision": "fc5d73fedcb3d0d61560c2102e95cb20"
  },
  {
    "url": "assets/js/11.97406a6e.js",
    "revision": "f0c2ed87c3e5322b32aa3fd77b9ce66d"
  },
  {
    "url": "assets/js/2.67a2d02b.js",
    "revision": "3ce8d27f8bb01e866e3d36f3a4a141b9"
  },
  {
    "url": "assets/js/3.12e4626c.js",
    "revision": "6a07b9441954eb4668cea1e7d6134553"
  },
  {
    "url": "assets/js/4.f2217cc4.js",
    "revision": "c50a84fbe475a57078ce4210a3ed63ea"
  },
  {
    "url": "assets/js/5.1ce3a36b.js",
    "revision": "a828b87d981b6ceb3b0dbfc5f36656fc"
  },
  {
    "url": "assets/js/6.e41c98aa.js",
    "revision": "e90a1f902ac98b776f9e3ae81475d29a"
  },
  {
    "url": "assets/js/7.a7169d5e.js",
    "revision": "46a1e55d82308b35755eccea9afcbda5"
  },
  {
    "url": "assets/js/8.5e0900db.js",
    "revision": "1defe2f557dcedb0f5f1856365cb76a6"
  },
  {
    "url": "assets/js/9.fd13fd35.js",
    "revision": "4aff10dcfb9e8fa8c6bcf4d11d947c3b"
  },
  {
    "url": "assets/js/app.2c9f3307.js",
    "revision": "9c35f445ad55417a29b60c793a32216b"
  },
  {
    "url": "icons/icon-128x128.png",
    "revision": "693e33e25d101d3d5df3e1245573fe0f"
  },
  {
    "url": "icons/icon-144x144.png",
    "revision": "c97bb5ba981c9575c146fc61ce2da09d"
  },
  {
    "url": "icons/icon-152x152.png",
    "revision": "1cc45a9e867fd1d8e991a0ea8e428bd8"
  },
  {
    "url": "icons/icon-192x192.png",
    "revision": "de13bb00261e0487532be118bc210761"
  },
  {
    "url": "icons/icon-384x384.png",
    "revision": "442b07ffa35e43358ca72a316de5aaff"
  },
  {
    "url": "icons/icon-512x512.png",
    "revision": "42c72b204eb373b3dd00389a7f323d80"
  },
  {
    "url": "icons/icon-72x72.png",
    "revision": "85c832a7776db7788f9ed7ec9850ac78"
  },
  {
    "url": "icons/icon-96x96.png",
    "revision": "dffcfffec0be9f54461b29e9e2a9f7ad"
  },
  {
    "url": "index.html",
    "revision": "34a1cc4d658f7e8e5d1421858a200ddf"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
addEventListener('message', event => {
  const replyPort = event.ports[0]
  const message = event.data
  if (replyPort && message && message.type === 'skip-waiting') {
    event.waitUntil(
      self.skipWaiting().then(
        () => replyPort.postMessage({ error: null }),
        error => replyPort.postMessage({ error })
      )
    )
  }
})
