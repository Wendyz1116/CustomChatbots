import { auth } from "@clerk/nextjs/server";
import { serverClient } from "../../../lib/server/serverClient";
import { GET_ALL_CHATBOTS } from "../../../graphql/queries/queries";
import {
  GetChatbotsByUserData,
  GetChatbotsByUserDataVariables,
  Chatbot,
} from "../../../types/types";
import Link from "next/link";
import Avatar from "../../../components/Avatar";

export const dynamic = "force-dynamic";
// force dynamic meaning no cacheing
// with change in value or smt make life easier

// want to keep this a server component
// no touch the client component

async function ViewChatbot() {
  const { userId } = await auth();
  // mean don't show anything
  if (!userId) return;

  // Get chatbot by user
  // since we r on server rn so we can
  // call to the server instead of a use effect
  const { data, errors } = await serverClient.query<GetChatbotsByUserData>({
    query: GET_ALL_CHATBOTS,
  });

  if (errors) {
    console.error("GraphQL errors:", errors);
  }

  // Filter all the chatbots to just the ones made by the user
  const chatbotsByUser = data?.chatbotsList?.filter(
    (chatbot) => chatbot.clerk_user_id === userId
  );

  // Want to sort the chatbot with most recent at top
  const sortedChatbotsByUser: Chatbot[] = [...chatbotsByUser].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <div className="flex-1 pb-20 p-10">
      <div className=" text-xl lg:text-3xl font-bold mb-5">Active Chatbots</div>
      {sortedChatbotsByUser.length === 0 && (
        <div>
          <p> u no make chatbot, click below to make one</p>
          <Link href="/create-chatbot">
            <button className="btn btn-sm btn-primary text-white">
              Create Chatbot
            </button>
          </Link>
        </div>
      )}

      <ul className="flex flex-col space-y-5">
        {sortedChatbotsByUser.map((chatbot) => (
          <Link key={chatbot.id} href={`/edit-chatbot/${chatbot.id}`}>
            <li className="relative p-3 bg-white border rounded-md max-w-3xl">
              <div className="flex items-center space-x-3 mx-2">
                <Avatar
                  seed={chatbot.name}
                  className="w-10 h-10 contain-content"
                />
                <div className="text-lg font-bold">{chatbot.name}</div>
              </div>
              <p className="absolute top-3 right-3 text-xs text-gray-500">
                Created {new Date(chatbot.created_at).toLocaleString()}
              </p>
              <hr className="mt-2" />
              <div className="grid grid-cols-2 gap-10 md:gap-5 p-5">
                <div className="italic text-sm">Characteristics:</div>
                <ul className="text-xs">
                  {!chatbot.chatbot_characteristics.length && (
                    <p>No chara added yet.</p>
                  )}

                  {chatbot.chatbot_characteristics.map((characteristic) => (
                    <li className="list-disc break-words">
                      {characteristic.content}
                    </li>
                  ))}
                </ul>

                {/* Num of sessions, since we're in grid it'll stack*/}
                <div className="italic text-sm">No of Sessions:</div>
                <div className="text-sm">{chatbot.chat_sessions.length}</div>
              </div>
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
}

export default ViewChatbot;
