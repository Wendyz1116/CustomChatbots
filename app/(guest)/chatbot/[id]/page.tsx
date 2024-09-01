"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import startNewChat from "../../../../lib/server/startNewChat";
import { GetChatbotByIdResponse, Message } from "../../../../types/types";
import {
  GET_CHATBOT_BY_ID,
  GET_MESSAGE_BY_CHAT_SESSION_ID,
} from "../../../../graphql/queries/queries";
import { useQuery } from "@apollo/client";
import Messages from "../../../../components/Messages";
// NOTE ?? what is post css
// zod is a validation library
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
  FormField,
} from "@/components/ui/form";

// Form scheme that determine what will be in the message
const formSchema = z.object({
  message: z.string().min(2, "ur message is too short"),
});

function ChatbotPage({ params: { id } }: { params: { id: string } }) {
  // id: the current Chatbot's id
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const [chatId, setChatId] = useState(0);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  // Use "useForm" to create a form instance
  // resolver connect the schema to the form object
  // to use it connect it to shadcn ui form component
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  const { data: chatBotData } = useQuery<GetChatbotByIdResponse>(
    GET_CHATBOT_BY_ID,
    { variables: { id } }
  );

  console.log("Chat id", chatId);
  // TODO 3:56 Typecase
  const {
    loading: loadingQuery,
    error,
    data,
  } = useQuery(GET_MESSAGE_BY_CHAT_SESSION_ID, {
    variables: { id: chatId },
    skip: !chatId,
    // Skip it if there's no chatId
  });
  if (error) {
    console.log(error);
  }

  useEffect(() => {
    console.log("chat id 2", chatId);
    console.log("data", data);
    if (data) {
      setMessages(data.chat_sessions.messages);
    }
    // could also do ??
    // setMessages(data?.chat_sessions.messages);
  }, [data]);

  // Handle popup name submit
  const handleFormSubmit = async (e: React.FormEvent) => {
    console.log("submittingg");
    e.preventDefault();
    setLoading(true);

    // StartNewChat is a function in lib/server
    // where we start new chat session for a guest
    const chatId = await startNewChat(name, email, Number(id));

    setChatId(chatId);
    setLoading(false);
    setIsOpen(false);
  };

  // handle text submit
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);

    const { message: formMessage } = values;
    const message = formMessage;
    form.reset();

    //TODO 4:06 prompt fill out name again
    // TODO handle empty message

    // TODO 4:08 optimistic user message

    // Optimistically update the UI with the user's message
    const userMessage: Message = {
      id: Date.now(),
      content: message,
      created_at: new Date().toISOString(),
      chat_session_id: chatId,
      sender: "user",
    };

    //...And show loading state for AI response
    const loadingMessage: Message = {
      id: Date.now() + 1,
      content: "Thinking...",
      created_at: new Date().toISOString(),
      chat_session_id: chatId,
      sender: "ai",
    };

    setMessages((prevMessages) => [
      ...prevMessages,
      userMessage,
      loadingMessage,
    ]);

    // ])
    // actuall api call for response
    try {
      console.log("going to api call")
      // Make post request to an endpoint
      const response = await fetch("/api/send-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          chat_session_id: chatId,
          chatbot_id: id,
          content: message,
        }),

        // get track of text/result that get back
      });
      console.log("getting result")
      const result = await response.json();
      console.log("res", result)
      // Replacing the loading message with the AI response
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === loadingMessage.id
            ? { ...msg, content: result.content, id: result.id }
            : msg
        )
      );
    } catch (error) {
      console.log("error")
      console.error("error", error);
    }
  }
  return (
    <div>
      {/* Dialog will stay open if isOpen is true */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleFormSubmit}>
            <DialogHeader>
              <DialogTitle>Lets help you out!</DialogTitle>
              <DialogDescription>
                I just need a few details to get started.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center gap-y-4 py-4">
              <div className="flex items-center w-full flex-row gap-x-4">
                <label
                  className="input font-semibold
                  focus-within:outline-none focus-within:border-primary"
                >
                  Name
                </label>
                <input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  placeholder="Jane Doe"
                  className="input rounded-sm input-sm fill-white bg-white w-full border-2 p-2 border-gray-500 focus-within:border-accent"
                />
              </div>
              <div className="flex items-center w-full flex-row gap-x-4">
                <label
                  className="input font-semibold
                  focus-within:outline-none focus-within:border-primary"
                >
                  Email
                </label>
                <input
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="text"
                  placeholder="Jane@gmail.com"
                  className="input rounded-sm input-sm bg-white w-full border-2 p-2 border-gray-500 focus-within:border-accent"
                />
              </div>
            </div>
            <DialogFooter>
              <button
                type="submit"
                disabled={!name || !email || loading}
                className="btn btn-sm w-full text-sm rounded-sm mt-2 py-2 bg-primary text-white"
                // STYLE TODO make it gray when disabled?
              >
                {loading ? "Loading..." : "Continue"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div>
        {/* STYLE TODO 3:54 Chatbot Header */}
        <div>{chatBotData?.chatbots.name}</div>
        <Messages
          messages={messages}
          chatbotName={chatBotData?.chatbots.name || "n/a"}
        />

        <Form {...form}>
          <form
            className="flex items-start sticky bottom-0 z-50 space-x-4
          drop-shadow-lg p-4 bg-gray-100 rounded-md"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="message"
              // how the elem get rendered
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel hidden>Message</FormLabel>
                  <FormControl>
                    <input
                      placeholder="Type a message..."
                      {...field}
                      className="p-8"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <button type="submit" className="btn btn-sm">
              {" "}
              send{" "}
            </button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default ChatbotPage;
