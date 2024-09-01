// using the next.js
import { NextRequest, NextResponse } from "next/server";
// import OpenAI from "openai";
import {
  GET_CHATBOT_BY_ID,
  GET_CHAT_SESSION_MESSAGES,
} from "../../../graphql/queries/queries";
import { serverClient } from "../../../lib/server/serverClient";
// import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { ChevronsLeftRightEllipsisIcon } from "lucide-react";
import { INSERT_MESSAGE } from "../../../graphql/mutations/mutations";
import { type } from "os";
import Groq from "groq-sdk";

// this is on the server so it's safe to expose it
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  const { chat_session_id, chatbot_id, content, name } = await req.json();

  console.log(
    `message from session ${chat_session_id}: ${content} (chatbot: ${chatbot_id})`
  );

  try {
    // 1. Fetch chatbot characteristic
    // Need the the characteristic to tell the
    // Open AI chatbot first. ex: you know
    // these things about this topic
    // so when they answer the prompt,
    // they will be will informed give an answer
    const { data } = await serverClient.query({
      query: GET_CHATBOT_BY_ID,
      variables: { id: chatbot_id },
      fetchPolicy: "no-cache",
    });

    const chatbot = data.chatbots;

    if (!chatbot) {
      return NextResponse.json({ error: "chatbot not found" }, { status: 404 });
    }
    console.log(chatbot);

    // 2. Fetch previous messages
    // We could past this in everytime, but the chat could get too big
    // Better to offload it to the back end
    // Just for safeguarding, since it kept cacheing smt
    // TODO add typecasting
    const { data: messagesData } = await serverClient.query({
      query: GET_CHAT_SESSION_MESSAGES,
      variables: { id: chat_session_id },
      fetchPolicy: "no-cache",
    });

    console.log("message data", data);
    const previousMessages = messagesData.chat_sessions.messages;
    // OpenAi expect data in a certain format
    // Need to change the message data into format it can understand
    console.log("prev", previousMessages);

    const formattedPreviousMessages = previousMessages.map((message) => ({
      role: message.sender === "ai" ? "system" : "user",
      name: message.sender === "ai" ? "system" : name,
      content: message.content,
    }));
    console.log("formated", formattedPreviousMessages);

    // Combine characteristics into a prompt
    const systemPrompt = chatbot.chatbot_characteristics
      .map((c) => c.content)
      .join("+");

    console.log("prompt", systemPrompt);

    const messages: ChatCompletionMessageParam[] = [
      {
        role: "system",
        // name: "system",
        content: `You are a helpful assistant talking to ${name}. If a generic question
        is asked which is not relevant or in the same scope or domain as the points in
        mentioned in the key information section, kindly inform the user theyre only 
        allowed to search for the specified content. Use Emoji's where possible. Here
        is some key information that you need to be aware of, these are elements you
        may be asked about: ${systemPrompt}`,
      },
      ...formattedPreviousMessages,
      {
        role: "user",
        name: name,
        content: content,
      },
    ];

    // Use the completetion api

    const groqResponse = await groq.chat.completions.create({
      messages: messages,
      model: "llama3-8b-8192",
    });

    const aiResponse = groqResponse?.choices?.[0]?.message?.content;

    // send the message to OpenAI's completions API
    // const openaiResponse = await openai.chat.completions.create({
    //   messages: messages,
    //   model: "gpt-3.5-turbo",
    // });
    if (!aiResponse) {
      return NextResponse.json(
        { error: "Failed to generate AI response" },
        { status: 500 }
      );
    }
    // Save the user's message in the database
    await serverClient.mutate({
      mutation: INSERT_MESSAGE,
      variables: { created_at: new Date().toISOString(), chat_session_id, content, sender: "user" },
    });
    // Save the AI's response in the database
    const aiMessageResult = await serverClient.mutate({
      mutation: INSERT_MESSAGE,
      variables: { created_at: new Date().toISOString(), chat_session_id, content: aiResponse, sender: "ai" },
    });

    console.log(aiMessageResult)

    // Return the AI's response to the client
    return NextResponse.json({
      id: aiMessageResult.data.insertMessages.id,
      content: aiResponse,
    });
  } catch (error) {
    console.error("error sending message:", error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
