import Head from "next/head";
import ChatPage from "./components/extras/ChatPage";

export default function Home() {

  return (
    <>
      <Head>
        <title>Chat Page (مشتری)</title>
      </Head>
      <ChatPage masseurId={'1'} userId={'2'} />
    </>
  );
}
