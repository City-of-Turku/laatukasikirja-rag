import { Loader2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { ToolData } from ".";
import { Button } from "../button";
import ChatActions from "./chat-actions";
import ChatMessage from "./chat-message";
import { ChatHandler } from "./chat.interface";
import { useClientConfig } from "./hooks/use-config";

export default function ChatMessages(
  props: Pick<
    ChatHandler,
    "messages" | "isLoading" | "reload" | "stop" | "append"
  >,
) {
  const { backend } = useClientConfig();
  const [starterQuestions, setStarterQuestions] = useState<string[]>();

  const scrollableChatContainerRef = useRef<HTMLDivElement>(null);
  const messageLength = props.messages.length;
  const lastMessage = props.messages[messageLength - 1];

  const scrollToBottom = () => {
    if (scrollableChatContainerRef.current) {
      scrollableChatContainerRef.current.scrollTop =
        scrollableChatContainerRef.current.scrollHeight;
    }
  };

  const isLastMessageFromAssistant =
    messageLength > 0 && lastMessage?.role !== "user";
  const showReload =
    props.reload && !props.isLoading && isLastMessageFromAssistant;
  const showStop = props.stop && props.isLoading;

  // `isPending` indicate
  // that stream response is not yet received from the server,
  // so we show a loading indicator to give a better UX.
  const isPending = props.isLoading && !isLastMessageFromAssistant;

  useEffect(() => {
    scrollToBottom();
  }, [messageLength, lastMessage]);

  useEffect(() => {
    if (!starterQuestions) {
      fetch(`${backend}/fastapi/api/chat/config`)
        .then((response) => response.json())
        .then((data) => {
          if (data?.starterQuestions) {
            setStarterQuestions(data.starterQuestions);
          }
        })
        .catch((error) => console.error("Error fetching config", error));
    }
  }, [starterQuestions, backend]);

  // build a map of message id to artifact version
  const artifactVersionMap = useMemo(() => {
    const map = new Map<string, number | undefined>();
    let versionIndex = 1;
    props.messages.forEach((m) => {
      m.annotations?.forEach((annotation) => {
        if (
          typeof annotation === "object" &&
          annotation != null &&
          "type" in annotation &&
          annotation.type === "tools"
        ) {
          const data = annotation.data as ToolData;
          if (data?.toolCall?.name === "artifact") {
            map.set(m.id, versionIndex);
            versionIndex++;
          }
        }
      });
    });
    return map;
  }, [props.messages]);

  return (
    <div
      className="flex-1 w-full rounded-xl bg-white p-4 shadow-xl relative overflow-y-auto"
      ref={scrollableChatContainerRef}
    >
      <div className="flex flex-col gap-5 divide-y">
        {props.messages.map((m, i) => {
          const isLoadingMessage = i === messageLength - 1 && props.isLoading;
          return (
            <ChatMessage
              key={m.id}
              chatMessage={m}
              isLoading={isLoadingMessage}
              append={props.append!}
              isLastMessage={i === messageLength - 1}
              artifactVersion={artifactVersionMap.get(m.id)}
            />
          );
        })}
        {isPending && (
          <div className="flex justify-center items-center pt-10">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        )}
      </div>
      {(showReload || showStop) && (
        <div className="flex justify-end py-4">
          <ChatActions
            reload={props.reload}
            stop={props.stop}
            showReload={showReload}
            showStop={showStop}
          />
        </div>
      )}
      {!messageLength && starterQuestions?.length && props.append && (
        <div className="absolute bottom-6 left-0 w-full">
          <div className="grid grid-cols-2 gap-2 mx-20">
            {starterQuestions.map((question, i) => (
              <Button
                variant="outline"
                key={i}
                onClick={() =>
                  props.append!({ role: "user", content: question })
                }
              >
                {question}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
