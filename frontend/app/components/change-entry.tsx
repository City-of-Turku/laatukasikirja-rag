type ChangeEntryProps = {
  entry: {
    id: Number;
    timestamp: string;
    changes: string[];
  };
};

function ChangeEntry({ entry }: ChangeEntryProps) {
  const { timestamp, changes } = entry;
  const entryDatetime = new Date(timestamp).toLocaleDateString("fi-FI", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="main-text-color">
      <p className="text-lg">{entryDatetime}</p>
      <ul className="list-disc">
        {changes.map((change, index) => (
          <li className="ml-4" key={index}>
            <p>{change}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ChangeEntry;
