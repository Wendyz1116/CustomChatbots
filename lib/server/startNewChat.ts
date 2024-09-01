import { gql } from "@apollo/client";
import client from "../../graphql/apolloClient";
import {
  INSERT_CHAT_SESSION,
  INSERT_GUEST,
  INSERT_MESSAGE,
} from "../../graphql/mutations/mutations";

//
async function startNewChat(
  guestName: string,
  guestEmail: string,
  chatbotId: number
) {
  // Function create chat session btw guest and chatbot

  console.log("starting chat with", guestName, guestEmail, chatbotId);
  try {
    // 1. Create a new guest entry
    // TODO 3:49 insert message type
    // NOTE fig out what String "!" means, is it req?
    // Client side mutation
    // TODO could put mutaiton in the mutation folder
    const guestResult = await client.mutate({
      mutation: INSERT_GUEST,
      variables: {
        created_at: new Date().toISOString(),
        name: guestName,
        email: guestEmail,
      },
    });
    const guestId = guestResult.data.insertGuests.id;
    console.log("guestId", guestId)

    // 2. Initialize a new chat session
    const chatSessionResult = await client.mutate({
      mutation: INSERT_CHAT_SESSION,
      variables: {
        created_at: new Date().toISOString(),
        chatbot_id: chatbotId,
        guest_id: guestId,
      },
    });
    const chatSessionId = chatSessionResult.data.insertChat_sessions.id;
    console.log("chatSessionId", chatSessionId)
    // 3. Insert initial message (optional)
    // Welcome, how can i help

    await client.mutate({
      mutation: INSERT_MESSAGE,
      variables: {
        created_at: new Date().toISOString(),
        chat_session_id: chatSessionId,
        sender: "ai",
        // TODO maybe change to dynamic message we want to send in backend
        content: `Welcome ${guestName}\n How can I assist you today?`,
      },
    });

    console.log("chat session successfully started");
    return chatSessionId;
  } catch (error) {
    console.log("ahhh")
    console.error("Error starting chat session", error);
  }
}

export default startNewChat;
