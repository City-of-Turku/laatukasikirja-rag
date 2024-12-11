import { notFound } from "next/navigation";
import ChangeEntry from "../components/change-entry";

async function ChangeLog() {
  const useChangeLog = process.env.USE_CHANGELOG;

  if (!useChangeLog) {
    notFound();
  }

  const res = await fetch(`${process.env.CHANGE_LOG_API}`, {
    // cache resource with given seconds
    next: { revalidate: 5 * 60 },
    headers: {
      "Content-Type": "application/json",
      "X-API-Token": `${process.env.API_TOKEN}`,
    },
  });
  const { change_log } = await res.json();

  return (
    <main className="w-screen flex justify-center items-center">
      <div className="py-10 space-y-2 lg:space-y-10 w-[90%] lg:w-[60rem]">
        <h1 className="text-4xl font-bold main-text-color">Muutoshistoria</h1>
        {change_log.map((entry: any) => (
          <ChangeEntry key={entry.id} entry={entry} />
        ))}
      </div>
    </main>
  );
}

export const metadata = {
  title: "Laatukäsikirja-Bot | Muutoshistoria",
};

export default ChangeLog;
