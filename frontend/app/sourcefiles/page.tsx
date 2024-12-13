import { notFound } from "next/navigation";
import SourceFiles from "../components/source-files";
import { SITE_TEXTS } from "../constants/texts";

async function SourceFilesPage() {
  const useSourceFiles = process.env.USE_SOURCE_FILES;

  if (!useSourceFiles) {
    notFound();
  }

  const res = await fetch(`${process.env.SOURCE_FILES_API}`, {
    // cache resource with given seconds
    next: { revalidate: 5 * 60 },
    headers: {
      "Content-Type": "application/json",
      "X-API-Token": `${process.env.API_TOKEN}`,
    },
  });
  const { files } = await res.json();

  return (
    <main className="w-screen flex justify-center items-center">
      <div className="py-10 space-y-2 lg:space-y-10 w-[90%] lg:w-[60rem]">
        <div>
          <h1 className="text-4xl font-bold main-text-color">Lähdetiedostot</h1>
          <p className="text-lg main-text-color pt-1">
            Alla on listattuna chatbot-ohjelman käyttämät lähdetiedostot.
          </p>
        </div>
        <SourceFiles files={files} />
      </div>
    </main>
  );
}

export const metadata = {
  title: SITE_TEXTS.sourceFilesPage.metaTitle,
};

export default SourceFilesPage;
