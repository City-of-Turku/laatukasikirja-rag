import { auth } from "@/auth";
import ChatSection from "./components/chat-section";

export default async function Home() {
  const session = await auth()

  return (
    <main className="w-screen flex justify-center items-center">
      <div className="py-10 space-y-2 lg:space-y-10 w-[90%] lg:w-[60rem]">
        <h1 className="text-4xl font-bold">Rakennussääntelyn AI-apuri</h1>
        <div className="h-[65vh] flex">
        {process.env.USE_TUNNISTAMO && !session ? (
          <p className="text-lg">Tervetuloa käyttämään Turun kaupungin rakennussääntelyn AI-apuria. Aloita käyttö kirjautumalla ensin sisään.</p>
        ) : (
          <ChatSection />
        )}
        </div>
      </div>
    </main>
  );
}
