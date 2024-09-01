// client component
"use client";

import { useEffect, useState } from "react";
import { Chatbot } from "../types/types";
import Avatar from "./Avatar";
import Link from "next/link";
import ReactTimeago from "react-timeago";

function ChatBotSessions({ chatbots }: { chatbots: Chatbot[] }) {
  const [sortedChatbots, setSortedChatbots] = useState<Chatbot[]>(chatbots);

  useEffect(() => {
    const sortedArray = [...chatbots].sort(
      (a, b) => b.chat_sessions.length - a.chat_sessions.length
    );
    setSortedChatbots(sortedArray);
    console.log("in sessions", sortedArray);
  }, [chatbots]);

  return (
    <div className="bg-white rounded-md">
      {sortedChatbots.map((chatbot) => {
        const hasSessions = chatbot.chat_sessions.length > 0;
        console.log("sessions", chatbot.chat_sessions);
        return (
          <div className="collapse collapse-arrow">
            <input type="radio" name="my-accordion" />
            <div className="collapse-title flex justify-center items-center my-2 space-x-3 mx-2 mr-2">
              <Avatar
                seed={chatbot.name}
                className="w-10 h-10 contain-content"
              />
              {/* STYLE TODO fig out the spacing to make it look better  */}

              <div className="flex flex-1 justify-between space-x-4 pr-5">
                <div className="text-lg">{chatbot.name}</div>
                <div className="text-lg font-bold">
                  {chatbot.chat_sessions.length} sessions
                </div>
              </div>
            </div>
            {/* Content of the Accordion */}
            <div className="collapse-content">
              <div className="space-y-5 p-5 bg-base rounded-md">
                {chatbot.chat_sessions.map((session) => (
                  <Link
                    href={`/review-sessions/${session.id}`}
                    key={session.id}
                    className="relative p-10 bg-primary text-white rounded-md block"
                  >
                    <p className="text-lg font-bold">
                      {session.guests?.name || "Anonymous"}
                    </p>
                    <p className="text-sm font-light">
                      {session.guests?.email || "No email provided"}
                    </p>
                    <p className="absolute top-5 right-5 text-sm">
                      <ReactTimeago date={new Date(session.created_at)} />
                    </p>
                  </Link>
                ))}
              </div>
            </div>
            <hr className="mt-2" />
          </div>
        );
      })}
    </div>
  );
}

export default ChatBotSessions;
