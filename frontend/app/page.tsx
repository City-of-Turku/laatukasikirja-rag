import ChatSection from "./components/chat-section";

export default function Home() {
  return (
    <main className="w-screen flex justify-center items-center">
      <div className="py-10 space-y-2 lg:space-y-10 w-[90%] lg:w-[60rem]">
        <h1 className="text-4xl font-bold">Laatukäsikirja-chatbot</h1>
        <div className="h-[65vh] flex">
          <ChatSection />
        </div>
      </div>
    </main>
  );
}
