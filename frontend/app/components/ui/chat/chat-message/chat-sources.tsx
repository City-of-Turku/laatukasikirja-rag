import { Check, Copy } from "lucide-react";
import { useMemo } from "react";
import { Button } from "../../button";
import { PreviewCard } from "../../document-preview";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../../hover-card";
import { cn } from "../../lib/utils";
import { useCopyToClipboard } from "../hooks/use-copy-to-clipboard";
import { DocumentFileType, SourceData, SourceNode } from "../index";
import PdfDialog from "../widgets/PdfDialog";

type Document = {
  url: string;
  sources: SourceNode[];
};

export function ChatSources({ data }: { data: SourceData }) {
  const documents: Document[] = useMemo(() => {
    // group nodes by document (a document must have a URL)
    const nodesByUrl: Record<string, SourceNode[]> = {};
    data.nodes.forEach((node) => {
      const key = node.url;
      nodesByUrl[key] ??= [];
      nodesByUrl[key].push(node);
    });

    // convert to array of documents
    return Object.entries(nodesByUrl).map(([url, sources]) => ({
      url,
      sources,
    }));
  }, [data.nodes]);

  if (documents.length === 0) return null;

  return (
    <div className="space-y-2 text-sm">
      <div className="font-semibold text-lg">Lähteet:</div>
      <div className="flex gap-3 flex-wrap">
        {documents.map((document) => {
          return <DocumentInfo key={document.url} document={document} />;
        })}
      </div>
    </div>
  );
}

function SourceInfo({ node, index }: { node?: SourceNode; index: number }) {
  if (!node) return <SourceNumberButton index={index} />;

  const isWide = process.env.NEXT_PUBLIC_USE_LARGE_SOURCE_CARD ? true : false;

  return (
    <HoverCard>
      <HoverCardTrigger
        className="cursor-default"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <SourceNumberButton
          index={index}
          className="hover:text-white hover:bg-primary"
        />
      </HoverCardTrigger>
      <HoverCardContent
        className={isWide ? "w-[1000px] max-w-[calc(100vw-2rem)]" : "w-[400px]"}
      >
        <NodeInfo nodeInfo={node} />
      </HoverCardContent>
    </HoverCard>
  );
}

export function SourceNumberButton({
  index,
  className,
}: {
  index: number;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "text-xs w-5 h-5 rounded-full bg-gray-100 inline-flex items-center justify-center",
        className,
      )}
    >
      {index + 1}
    </span>
  );
}

export function DocumentInfo({
  document,
  className,
}: {
  document: Document;
  className?: string;
}) {
  const { url, sources } = document;
  // Extract filename from URL
  const urlParts = url.split("/");
  const fileName = urlParts.length > 0 ? urlParts[urlParts.length - 1] : url;
  const fileExt = fileName?.split(".").pop() as DocumentFileType | undefined;

  const previewFile = {
    name: fileName,
    type: fileExt as DocumentFileType,
  };

  const DocumentDetail = (
    <div className={`relative ${className}`}>
      <PreviewCard className={"cursor-pointer"} file={previewFile} />
      <div className="absolute bottom-2 right-2 space-x-2 flex">
        {sources.map((node: SourceNode, index: number) => (
          <div key={node.id}>
            <SourceInfo node={node} index={index} />
          </div>
        ))}
      </div>
    </div>
  );

  if (url.endsWith(".pdf")) {
    // open internal pdf dialog for pdf files when click document card
    return <PdfDialog documentId={url} url={url} trigger={DocumentDetail} />;
  }
  // open external link when click document card for other file types
  return <div onClick={() => window.open(url, "_blank")}>{DocumentDetail}</div>;
}

function NodeInfo({ nodeInfo }: { nodeInfo: SourceNode }) {
  const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 1000 });

  const pageNumber =
    // XXX: page_label is used in Python, but page_number is used by Typescript
    (nodeInfo.metadata?.page_number as number) ??
    (nodeInfo.metadata?.page_label as number) ??
    null;

  const isTall = process.env.NEXT_PUBLIC_USE_LARGE_SOURCE_CARD ? true : false;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="font-semibold">
          {pageNumber ? `Sivulla ${pageNumber}:` : "Sisältö:"}
        </span>
        {nodeInfo.text && (
          <Button
            onClick={(e) => {
              e.stopPropagation();
              copyToClipboard(nodeInfo.text);
            }}
            size="icon"
            variant="ghost"
            className="h-12 w-12 shrink-0"
          >
            {isCopied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>

      {nodeInfo.text && (
        <pre
          className={
            isTall
              ? "max-h-[300px] overflow-auto whitespace-pre-line"
              : "max-h-[200px] overflow-auto whitespace-pre-line"
          }
        >
          &ldquo;{nodeInfo.text}&rdquo;
        </pre>
      )}
    </div>
  );
}
