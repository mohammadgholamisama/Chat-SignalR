import { useEffect } from 'react';
import { toast } from 'react-toastify';

const NotificationManager = () => {
    useEffect(() => {
        // ابتدا بررسی می‌کنیم که آیا مرورگر از نوتیفیکیشن‌ها پشتیبانی می‌کند یا خیر
        const requestNotificationPermission = async () => {
            // بررسی اینکه آیا مرورگر از نوتیفیکیشن‌ها پشتیبانی می‌کند
            if (!("Notification" in window)) {
                alert("This browser does not support notifications.");
                return;
            }

            // بررسی وضعیت مجوز نوتیفیکیشن
            if (Notification.permission === "granted") {
                console.log("Notifications permission already granted.");
                registerServiceWorker(); // ثبت سرویس ورکر در صورت داشتن مجوز
            } else if (Notification.permission !== "denied") {
                // درخواست مجوز از کاربر
                const permission = await Notification.requestPermission();
                if (permission === "granted") {
                    console.log("Notifications permission granted.");
                    registerServiceWorker(); // ثبت سرویس ورکر در صورت اعطای مجوز
                } else {
                    console.log("Notifications permission denied.");
                }
            } else {
                console.log("Notifications permission has been denied previously.");
                toast.error('دسترسی به اعلان فعال نیست'); // نمایش نوتیفیکیشن موفقیت
            }
        };

        // تابعی برای ثبت Service Worker
        const registerServiceWorker = async () => {
            if ("serviceWorker" in navigator) {
                try {
                    // ثبت سرویس ورکر و دریافت ثبت‌نام
                    const registration = await navigator.serviceWorker.register('/serviceWorker.js');
                    console.log('Service Worker registered with scope:', registration.scope);
                    await subscribeToPushNotifications(registration); // اشتراک در نوتیفیکیشن‌های پوش
                } catch (error) {
                    console.error('Service Worker registration failed:', error); // نمایش خطا در صورت عدم موفقیت
                }
            }
        };

        // دریافت کلید VAPID از سرور
        const getVapidPublicKey = async () => {
            console.log("اجرای تابع getVapidPublicKey");
            try {
                const response = await fetch('https://notification.micapi.ir/api/PushNotification/vapidpublickey');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const publicKey = await response.text(); // دریافت کلید VAPID به صورت متن
                console.log('publicKey: ', publicKey);
                return publicKey; // بازگشت کلید
            } catch (error) {
                console.error('Error fetching VAPID public key:', error);
            }
        };


        // تابعی برای اشتراک در Push Notification
        const subscribeToPushNotifications = async (registration) => {
            const publicKey = await getVapidPublicKey(); // دریافت کلید VAPID
            const existingSubscription = await registration.pushManager.getSubscription(); // بررسی اشتراک‌های موجود
            console.log('existingSubscription: ', existingSubscription);

            // اگر اشتراک موجود باشد، آن را لغو کنید
            if (existingSubscription) {
                await existingSubscription.unsubscribe(); // لغو اشتراک قبلی
                console.log('Previous subscription has been unsubscribed.');
            }

            // ایجاد اشتراک جدید
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(publicKey) // تبدیل کلید به فرمت مورد نیاز
            });
            console.log('اشتراک جدید ساخته شده: ', subscription);

            // آماده‌سازی داده‌های اشتراک
            const subscriptionData = {
                endpoint: subscription.endpoint,
                p256dh: btoa(String.fromCharCode.apply(null, new Uint8Array(subscription.getKey('p256dh')))),
                auth: btoa(String.fromCharCode.apply(null, new Uint8Array(subscription.getKey('auth')))),
                PublicKey: publicKey
            };
            console.log('subscriptionData: ', subscriptionData); // نمایش داده‌های اشتراک

            // ارسال داده‌های اشتراک به سرور
            try {
                await fetch('https://notification.micapi.ir/api/PushNotification/subscribe', {
                    method: 'POST',
                    body: JSON.stringify(subscriptionData),
                    headers: {
                        'Content-Type': 'application/json' // تعیین نوع محتوا
                    }
                });
                console.log("post شد");
            } catch (error) {
                console.log('ارور post: ', error);

            }

            // نمایش پیغام موفقیت‌آمیز
            toast.success('دسترسی به اعلان فعال است'); // نمایش نوتیفیکیشن موفقیت
        };

        // تبدیل Base64 به Uint8Array
        const urlBase64ToUint8Array = (base64String) => {
            const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
            const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
            const rawData = window.atob(base64); // تبدیل Base64 به داده خام
            const outputArray = new Uint8Array(rawData.length);
            for (let i = 0; i < rawData.length; ++i) {
                outputArray[i] = rawData.charCodeAt(i); // تبدیل به Uint8Array
            }
            return outputArray; // بازگشت داده‌های Uint8Array
        };

        // اجرای درخواست نوتیفیکیشن‌ها هنگام بارگذاری صفحه
        requestNotificationPermission(); // درخواست مجوز نوتیفیکیشن
    }, []); // تنها در بارگذاری اولیه اجرا می‌شود


    return null;
};

export default NotificationManager;
