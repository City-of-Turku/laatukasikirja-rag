import { auth } from "@/auth";
import ChatSection from "./components/chat-section";

export default async function Home() {
  const session = await auth();

  return (
    <main className="w-screen flex justify-center items-center">
      <div className="py-10 space-y-2 lg:space-y-10 w-[90%] lg:w-[60rem]">
        <h1 className="text-4xl font-bold main-text-color">
          Laatukäsikirja-chatbot, testiversio
        </h1>
        <div className="h-[65vh] flex">
          {process.env.USE_TUNNISTAMO && !session ? (
            <p className="main-text-color text-lg">
              Tervetuloa käyttämään Laatukäsikirja chatbottia. Aloita käyttö
              kirjautumalla ensin sisään.
            </p>
          ) : (
            <ChatSection />
          )}
        </div>
      </div>
    </main>
  );
}
