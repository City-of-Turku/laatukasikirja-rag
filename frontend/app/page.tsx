import { auth } from "@/auth";
import ChatSection from "./components/chat-section";

export default async function Home() {
  const session = await auth()

  return (
    <main className="w-screen flex justify-center items-center">
      <div className="py-10 space-y-2 lg:space-y-10 w-[90%] lg:w-[60rem]">
        <h1 className="text-4xl font-bold text-white">Laatukäsikirja-chatbot</h1>
        <div className="h-[65vh] flex">
          {session ? <ChatSection /> : (
            <p className="text-white text-lg">Tervetuloa käyttämään Laatukäsikirja chatbottia. Aloita käyttö kirjautumalla ensin sisään.</p>
            )}
        </div>
      </div>
    </main>
  );
}
