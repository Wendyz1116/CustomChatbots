import Link from "next/link";
import React from "react";
import Icon from "./Icon";

function ClientSidebar() {
  return (
    <div className="w-52 h-full bg-base-200">
      <ul className="gap-5 flex flex-col w-full mt-4">
        <li className="flex-1 items-start">
          <Link
            href="/create-chatbot"
            className="hover:bg-secondary flex
            text-left flex-row items-start p-1 mx-2 rounded-md justify-start"
          >
            <Icon name="bot-message-square" className="h-5 w-7" />
            {/* <div className="hidden md:inline items-center w-full"> */}

            <div className="text-xs">New Chatbot</div>
          </Link>
        </li>
        <li className="flex-1 items-center">
          <Link
            href="/view-chatbots"
            className="hover:bg-secondary flex
            text-left flex-row items-start p-1 mx-2 rounded-md justify-start"
          >
            <Icon name="pencil-line" className="h-5 w-7" />
            <div className="text-xs">Edit Chatbots</div>
          </Link>
        </li>
        <li className="flex-1 items-center">
          <Link
            href="/review-sessions"
            className="hover:bg-secondary flex
            text-left flex-row items-start p-1 mx-2 rounded-md justify-start"
          >
            <Icon name="search" className="h-5 w-7" />
            <div className="text-xs">View Sessions</div>
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default ClientSidebar;
