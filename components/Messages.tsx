"use client";
// client cause as user type
// it's scroll down, so need a window
import { Message } from "../types/types";


function Messages({
  messages,
  chatbotName,
}: {
  messages: Message[];
  chatbotName: string;
}) {
  // TODO 3:26 have text scroll to bottom
  // const ref = useRef
  // console.log("messages", messages)
  // if on review page, see time stamp
  //  TODO 3:18

  console.log("message", messages)

  return (
    <div className="flex-1 flex flex-col overflow-y-auto space-y-10 py-20
    px-5 bg-white rounded-md">
      {messages.map((message) => {
        const isSender = message.sender !== "user";
        console.log("message key", message.id)
        return (
          <div
            key={message.id}
            className={`chat ${isSender ? "chat-start" : "chat-end"} relative`}
          >
            {/* STYLE TODO 3:20 add style for the messages*/}
            {/* TODO 3:24 download react markdowns and for tables */}
            <div className="chat-bubble bg-accent">{message.content}</div>
          </div>
        );
      })}
    </div>
  );
}

export default Messages;
