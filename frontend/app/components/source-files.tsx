"use client";

import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

type sourceFile = {
  file_name: string;
  url: string;
};

type sourceFilesProps = {
  files: sourceFile[];
};

function SourceFiles({ files }: sourceFilesProps) {
  const [filteredFiles, setFilteredFiles] = useState(files);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setFilteredFiles(
      files.filter((file) =>
        file.file_name.toLowerCase().includes(search.toLowerCase()),
      ),
    );
  }, [search, files]);

  return (
    <div>
      <div className="pb-2">
        <Label
          className="main-text-color text-lg"
          htmlFor="source-files-search-input"
        >
          Hae tiedostoja nimellä
        </Label>
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          id="source-files-search-input"
          className="rounded-xl text-lg"
        ></Input>
      </div>
      <div className="flex bg-white rounded-xl">
        <ul className="text-lg p-4 divide-y-2 divide-dashed break-all">
          {filteredFiles.length > 0 ? (
            filteredFiles.map((file: sourceFile) => (
              <li key={file.file_name} className="pb-1">
                {file.file_name}
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 visited:text-purple-600 underline pl-2"
                >
                  Avaa ⤓
                </a>
              </li>
            ))
          ) : (
            <p className="text-gray-500">Hakutuloksia ei löytynyt</p>
          )}
        </ul>
      </div>
    </div>
  );
}

export default SourceFiles;
