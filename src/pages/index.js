import Head from "next/head";
import Login from "@/components/extras/Login";
import NotificationManager from "@/components/shared/NotificationManager";

export default function Home() {

  return (
    <>
      <Head>
        <title>ورود به حساب کاربری</title>
      </Head>
      <Login />
      <NotificationManager /> {/* مدیریت نوتیفیکیشن‌ها */}
    </>
  );
}
