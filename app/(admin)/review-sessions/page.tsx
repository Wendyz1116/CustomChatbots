// Server component
import { auth } from "@clerk/nextjs/server";
import { serverClient } from "../../../lib/server/serverClient";
import { GET_ALL_CHATBOTS } from "../../../graphql/queries/queries";
import { Chatbot, GetChatbotsByUserData } from "../../../types/types";
import ChatBotSessions from "../../../components/ChatBotSessions";

async function ReviewSessions() {
  // authentication check
  // since this is a server component, we can do
  // top level async/await
  const { userId } = await auth();
  if (!userId) return;

  // TODO 2:57 add typecasting
  // const {
  //   data: { chatbotsByUser },
  // } = await serverClient.query({
  //   query: GET_USER_CHATBOTS,
  //   variables: { userId: userId },
  // });
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

  // const chatbotsByUser = data?.chatbotsList?.filter(
  //   (chatbot) => chatbot.clerk_user_id === userId
  // );

  // Sort the chatbot by the users
  // Set up an asending order
  // but all the chatbots with chats at the top
  const sortedChatbotsByUser: Chatbot[] = chatbotsByUser.map((chatbot) => ({
    ...chatbot,
    chat_sessions: [...chatbot.chat_sessions].sort(
      (a, b) =>
        // sort in ascending order
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    ),
  }));

  return (
    <div className="flex-1 px-10">
      <div className="text-xl lg:text-3xl font-bold mt-10">Chat Sessions</div>
      <div className="mb-5">
        Review all the chat sessions the chatbots have had with your customers.
      </div>
      <ChatBotSessions chatbots={sortedChatbotsByUser} />
    </div>
  );
}

export default ReviewSessions;
