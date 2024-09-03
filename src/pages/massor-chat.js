import Head from "next/head";
import ChatPageMasur from "./components/extras/ChatPageMasur";

export default function massor_chat() {

  return (
    <>
      <Head>
        <title>Chat Page (ماسور)</title>
      </Head>
      <ChatPageMasur masseurId={'1'} userId={'2'} />
    </>
  );
}
