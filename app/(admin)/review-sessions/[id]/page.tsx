// force-dynamic, page wont be cached
//  want most up to date value

import { GET_CHAT_SESSION_MESSAGES } from "../../../../graphql/queries/queries";
import { serverClient } from "../../../../lib/server/serverClient";
import Messages from "../../../../components/Messages";

// if smo is chating w it, want the current session
export const dynamic = "force-dynamic";

// 3:10 layout
// TODO 3:11 add Typecasting
async function ReviewSession({ params: { id } }: { params: { id: string } }) {
  const {
    data: {
      chat_sessions: {
        id: chatSessionId,
        created_at,
        messages,
        chatbots: { name },
        guests: { name: guestName, email },
      },
    },
  } = await serverClient.query({
    query: GET_CHAT_SESSION_MESSAGES,
    variables: { id: parseInt(id as string) },
  });

  return (
    <div>
      <div className="flex-1 p-10 pb-24">
        <h1 className="text-xl_lg:text-3xl font-semibold">Session Review</h1>
        <div
          className="font-light text-xs text-gray-400 mt-2"
        >
          Started at {new Date(created_at).toLocaleString()}
        </div>
        <div className="font-light mt-2">
          Between {name} &
          <span className="font-bold">
            {guestName} ({email})
          </span>
        </div>
        <hr className="my-10" />
        <Messages
          messages={messages}
          chatSessionId={chatSessionId}
          chatbotName={name}
          guestName={guestName}
        />
      </div>
    </div>
  );
}

export default ReviewSession;
