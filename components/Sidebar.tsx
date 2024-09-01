import Link from "next/link";
import React from "react";
import Icon from "./Icon";

function Sidebar() {
  return (
    <div className="bg-white w-full lg:w-52 text-white p-5">
      <ul className="gap-5 flex lg:flex-col">
        <li className="flex-1 items-center">
          <Link
            href="/create-chatbot"
            className="hover:opacity-50 flex flex-col
            text-center lg-text-left lg:flex-row items-center
            gap-2 p-5 rounded-md bg-primary justify-start"
          >
            <Icon name="bot-message-square" className="h-3 w-5 lg:h-5 lg:w-7" />
            <div className="hidden md:inline items-center w-full">
              <p className="text-md">Create</p>
              <p className="text-xs font-extralight">New Chatbot</p>
            </div>
          </Link>
        </li>
        <li className="flex-1 items-center">
          <Link
            href="/view-chatbots"
            className="hover:opacity-50 flex flex-col
            text-center lg-text-left lg:flex-row items-center
            gap-2 p-5 rounded-md bg-primary justify-start"
          >
            <Icon name="pencil-line" className="h-3 w-5 lg:h-5 lg:w-7" />
            <div className="hidden md:inline items-center w-full">
              <p className="text-md">Edit</p>
              <p className="text-xs font-extralight">Chatbots</p>
            </div>
          </Link>
        </li>
        <li className="flex-1 items-center">
          <Link
            href="/review-sessions"
            className="hover:opacity-50 flex flex-col
            text-center lg-text-left lg:flex-row items-center
            gap-2 p-5 rounded-md bg-primary justify-start"
          >
            <Icon name="search" className="h-3 w-5 lg:h-5 lg:w-7" />
            <div className="hidden md:inline items-center w-full">
              <p className="text-md">View</p>
              <p className="text-xs font-extralight">Sessions</p>
            </div>
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
