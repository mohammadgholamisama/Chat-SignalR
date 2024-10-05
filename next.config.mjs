import withPWA from '@ducanh2912/next-pwa';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  // سایر تنظیمات Next.js
};

// پیکربندی PWA
const pwaConfig = {
  dest: 'public', // پوشه‌ای که فایل‌های PWA در آن قرار می‌گیرند
  swSrc: 'public/serviceWorker.js', // نام فایل سرویس ورکر سفارشی شما
  register: true, // فعال‌سازی ثبت سرویس ورکر
  skipWaiting: true, // برای اطمینان از اینکه سرویس ورکر جدید فوراً فعال می‌شود
  disable: process.env.NODE_ENV === 'development', // غیرفعال کردن در محیط توسعه
};

export default withPWA(pwaConfig)(nextConfig);
