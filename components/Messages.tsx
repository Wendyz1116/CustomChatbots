"use client";
import { UserCircle } from "lucide-react";
// client cause as user type
// it's scroll down, so need a window
import { Message } from "../types/types";
import Avatar from "./Avatar";
import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function Messages({
  messages,
  chatbotName,
  containerStyles = "",
}: {
  messages: Message[];
  chatbotName: string;
  containerStyles?: string;
}) {
  // TODO 3:26 have text scroll to bottom
  // const ref = useRef
  // console.log("messages", messages)
  // if on review page, see time stamp
  //  TODO 3:18

  console.log("message", messages);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  });
  return (
    <div
      className={`${containerStyles} flex-1 flex flex-col overflow-y-auto
      space-y-10 pt-4 px-5 bg-base-20 rounded-md`}
    >
      {messages.map((message) => {
        const isSender = message.sender !== "user";
        return (
          <div
            key={message.id}
            className={`chat ${isSender ? "chat-start" : "chat-end"} relative`}
          >
            {/* STYLE TODO 3:20 add style for the messages*/}
            {/* TODO 3:24/3:26 download react markdowns and for tables */}

            <div
              className={`chat-image avatar w-8 ${!isSender && "w-12 -mr-4"}`}
            >
              {isSender ? (
                <Avatar
                  seed={chatbotName}
                  className="h-12 w-12 bg-base-100 rounded-full border-2"
                />
              ) : (
                <UserCircle className="text-primary" />
              )}
            </div>

            <div
              className={`chat-bubble bg-accent rounded-xl ${
                isSender
                  ? "chat-bubble-primary bg-secondary"
                  : "chat-bubble-secondary bg-base-200"
              }
              `}
            >
              <div>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  className="break-words"
                  components={{
                    ul: ({ node, ...props }) => (
                      <ul
                        {...props}
                        className="list-disc list-inside ml-4 mb-4"
                      />
                    ),
                    ol: ({ node, ...props }) => (
                      <ol
                        {...props}
                        className="list-decimal list-inside ml-4 mb-4"
                      />
                    ),
                    h1: ({ node, ...props }) => (
                      <h1 {...props} className="text-xl font-bold mb-4" />
                    ),
                    h2: ({ node, ...props }) => (
                      <h2 {...props} className="text-lg font-bold mb-4" />
                    ),
                    h3: ({ node, ...props }) => (
                      <h3 {...props} className="text-sm font-bold mb-4" />
                    ),

                    table: ({ node, ...props }) => (
                      <table
                        {...props}
                        className="table-auto text-base-100 overflow-x-scroll border-separate border-2 rounded-sm border-spacing-4 border-white
                      my-5"
                      />
                    ),
                    th: ({ node, ...props }) => (
                      <th {...props} className="text-left underline" />
                    ),
                    p: ({ node, ...props }) => (
                      <p
                        {...props}
                        className={`whitespace-break-spaces my-2 ${
                          message.content === "Thinking..." && "animate-pulse"
                        } ${isSender ? " text-base-100" : "text-base-content"}`}
                      />
                    ),

                    a: ({ node, ...props }) => (
                      <a
                        {...props}
                        target="_blank"
                        className="font-bold underline hover:text-primary"
                        rel="noopener noreferrer"
                      />
                    ),
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            </div>

            <p className="absolute -bottom-5 body-xs-muted">
              sent {new Date(message.created_at).toLocaleString()}
            </p>
          </div>
        );
      })}

      <div ref={ref} />
    </div>
  );
}

export default Messages;
