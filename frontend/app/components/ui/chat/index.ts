import { JSONValue } from "ai";
import ChatInput from "./chat-input";
import ChatMessages from "./chat-messages";

export { type ChatHandler } from "./chat.interface";
export { ChatInput, ChatMessages };

export enum MessageAnnotationType {
  IMAGE = "image",
  DOCUMENT_FILE = "document_file",
  SOURCES = "sources",
  EVENTS = "events",
  TOOLS = "tools",
  SUGGESTED_QUESTIONS = "suggested_questions",
  AGENT_EVENTS = "agent",
}

export type ImageData = {
  url: string;
};

export type DocumentFileType = "csv" | "pdf" | "txt" | "docx";
export const DOCUMENT_FILE_TYPES: DocumentFileType[] = [
  "csv",
  "pdf",
  "txt",
  "docx",
];

export type DocumentFile = {
  id: string;
  name: string; // The uploaded file name in the backend
  size: number; // The file size in bytes
  type: DocumentFileType;
  url: string; // The URL of the uploaded file in the backend
  refs?: string[]; // DocumentIDs of the uploaded file in the vector index
};

export type DocumentFileData = {
  files: DocumentFile[];
};

export type SourceNode = {
  id: string;
  metadata: Record<string, unknown>;
  score?: number;
  text: string;
  url: string;
};

export type SourceData = {
  nodes: SourceNode[];
};

export type EventData = {
  title: string;
};

export type AgentEventData = {
  agent: string;
  text: string;
};

export type ToolData = {
  toolCall: {
    id: string;
    name: string;
    input: {
      [key: string]: JSONValue;
    };
  };
  toolOutput: {
    output: JSONValue;
    isError: boolean;
  };
};

export type SuggestedQuestionsData = string[];

export type AnnotationData =
  | ImageData
  | DocumentFileData
  | SourceData
  | EventData
  | AgentEventData
  | ToolData
  | SuggestedQuestionsData;

export type MessageAnnotation = {
  type: MessageAnnotationType;
  data: AnnotationData;
};

const ENV_THRESHOLD = process.env.NEXT_PUBLIC_NODE_SCORE_THRESHOLD
const NODE_SCORE_THRESHOLD = ENV_THRESHOLD ? parseFloat(ENV_THRESHOLD) : 0.25;

export function getAnnotationData<T extends AnnotationData>(
  annotations: MessageAnnotation[],
  type: MessageAnnotationType,
): T[] {
  return annotations.filter((a) => a.type === type).map((a) => a.data as T);
}

export function getSourceAnnotationData(
  annotations: MessageAnnotation[],
): SourceData[] {
  const data = getAnnotationData<SourceData>(
    annotations,
    MessageAnnotationType.SOURCES,
  );
  if (data.length > 0) {
    const sourceData = data[0] as SourceData;
    if (sourceData.nodes) {
      sourceData.nodes = preprocessSourceNodes(sourceData.nodes);
    }
  }
  return data;
}

function preprocessSourceNodes(nodes: SourceNode[]): SourceNode[] {
  // Filter source nodes has lower score
  nodes = nodes
    .filter((node) => (node.score ?? 1) > NODE_SCORE_THRESHOLD)
    .filter((node) => node.url && node.url.trim() !== "")
    .sort((a, b) => (b.score ?? 1) - (a.score ?? 1))
    .map((node) => {
      // remove trailing slash for node url if exists
      node.url = node.url.replace(/\/$/, "");
      return node;
    });
  return nodes;
}
