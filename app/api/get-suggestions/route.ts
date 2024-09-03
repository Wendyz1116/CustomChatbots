// using the next.js
import { NextRequest, NextResponse } from "next/server";
// import OpenAI from "openai";
import {
  GET_CHATBOT_BY_ID,
  GET_CHAT_SESSION_MESSAGES,
} from "../../../graphql/queries/queries";
import { serverClient } from "../../../lib/server/serverClient";
// import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  const { chatbot_id } = await req.json();

  try {
    // 1. Get chatbot characteristics
    const { data } = await serverClient.query({
      query: GET_CHATBOT_BY_ID,
      variables: { id: chatbot_id },
      fetchPolicy: "no-cache",
    });

    const chatbot = data.chatbots;

    if (!chatbot) {
      return NextResponse.json({ error: "chatbot not found" }, { status: 404 });
    }

    // Get the list of chatbot characteristics
    const systemPrompt = chatbot.chatbot_characteristics
      .map((characteristic: { content: string }) => characteristic.content)
      .join("+");

    const messages = [
      {
        role: "system",
        name: "system",
        content: `You are a helpful assistant. Based on the key information provided below,
        please list exactly 3 specific suggestions on what a user talking to you can ask.
        Each suggestion should be on a new line, with no numbers or labels.
        
        Here is the key information you need to consider: ${systemPrompt}.
        
        Ensure that each suggestion is clear, distinct, and concise. Provide only the 3
        suggestions that I can copy and paste into a message box exactly as they are. Do
        not include any extra comments, explanations, or labels in the beginning or in between
        the prompts. Just list the 3 questions or prompts.

        For this response only, do not make any jokes. I want this to be very straightfoward
        potential prompts users can give you.
`,
      },
    ];
    
  

    // Use the Groq API for completetion ahh
    const groqResponse = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: "Explain the importance of fast language models",
        },
      ],
      model: "llama3-8b-8192",
    });

    const grogResponseContent = groqResponse?.choices?.[0]?.message?.content

    if (!grogResponseContent) {
      return NextResponse.json(
        { error: "Failed to generate AI response" },
        { status: 500 }
      );
    }

    const suggestions = grogResponseContent.split('\n')
      .map(line => line.trim())
      .filter(line => line !== "");

    // TODO maybe save these suggestions?
    console.log("suggestions", suggestions)

    // Return the AI's suggestions to the client
    return NextResponse.json({
      content: suggestions,
    });

  } catch (error) {
    console.error("error sending message:", error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
