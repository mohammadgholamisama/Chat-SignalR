// نصب سرویس ورکر
self.addEventListener('install', function (event) {
    console.log('Service Worker installing.');

    // کش کردن منابع برای PWA
    event.waitUntil(
        caches.open('pwa-cache').then((cache) => {
            return cache.addAll([
                // '/',
                '/favicon.ico',
            ]);
        })
    );

    // این خط باعث می‌شود که سرویس ورکر بلافاصله فعال شود و منتظر بستن تب‌های قدیمی نماند
    self.skipWaiting();
});

// فعال‌سازی سرویس ورکر
self.addEventListener('activate', function (event) {
    console.log('Service Worker activating.');

    // فعال کردن سرویس ورکر برای همه کلاینت‌های موجود
    event.waitUntil(clients.claim());
});

// // مدیریت کش و درخواست‌ها برای PWA
// self.addEventListener('fetch', function (event) {
//     event.respondWith(
//         caches.match(event.request).then(function (response) {
//             return response || fetch(event.request);
//         })
//     );
// });

// مدیریت Push Notification
self.addEventListener('push', function (event) {
    const data = event.data ? event.data.json() : {};
    console.log('Push event data:', data);

    const options = {
        body: data.body || 'New notification!',
        icon: data.icon || '/favicon.ico', // آیکون نوتیفیکیشن
        badge: '/favicon.ico', // نشان‌گر کوچک برای نوتیفیکیشن
        data: {
            url: '/' // URLی که هنگام کلیک کاربر باز می‌شود
        }
    };

    event.waitUntil(
        self.registration.showNotification(data.title || 'New Notification', options)
    );
});

// مدیریت کلیک بر روی نوتیفیکیشن
self.addEventListener('notificationclick', function (event) {
    const notification = event.notification;
    const action = event.action;

    if (action === 'close') {
        notification.close();
    } else {
        clients.openWindow(notification.data.url || '/');
        notification.close();
    }
});
