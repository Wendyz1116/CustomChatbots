"use client";

import { FormEvent, useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import startNewChat from "../../../../lib/server/startNewChat";
import { GetChatbotByIdResponse, Message } from "../../../../types/types";
import {
  GET_CHATBOT_BY_ID,
  GET_MESSAGE_BY_CHAT_SESSION_ID,
} from "../../../../graphql/queries/queries";
import { useQuery } from "@apollo/client";
import Messages from "../../../../components/Messages";
import { useForm } from "react-hook-form";
import Avatar from "../../../../components/Avatar";
import ChatbotIntroScreen from "../../../../components/ChatbotIntroScreen";
import Icon from "../../../../components/Icon";
import Loading from "../../../../components/Loading";
import { ArrowUp, Sparkles } from "lucide-react";

function ChatbotPage({ params: { id } }: { params: { id: string } }) {
  // id: the current Chatbot's id
  const [suggestionPage, setSuggestionPage] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [signInPopup, setSignInPopup] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [chatId, setChatId] = useState(0);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageValue, setMessageValue] = useState<string>("");
  const { user } = useUser();

  // TODO1 add loading chatbot
  // TODO2 add return to suggestion, or have it pop up
  useEffect(() => {
    const initiateChat = async () => {
      if (user) {
        setLoggedIn(true);
        console.log(user);
        setLoading(true);
        const chatId = await startNewChat(name, email, Number(id));
        setChatId(chatId);
        setLoading(false);
      } else {
        setSignInPopup(true);
        setSuggestionPage(true);
      }
    };
    initiateChat();
  }, [user]);

  // Use "useForm" to create a form instance
  // resolver connect the schema to the form object
  // to use it connect it to shadcn ui form component

  // Query to get the specific chatbot
  const { loading: loadingChatbot, data: chatbotData } =
    useQuery<GetChatbotByIdResponse>(GET_CHATBOT_BY_ID, { variables: { id } });
  const chatbotName = chatbotData?.chatbots.name;

  // TODO 3:56 Add Types
  // Get old messages using the session chatId
  const {
    loading: loadingQuery,
    error,
    data,
  } = useQuery(GET_MESSAGE_BY_CHAT_SESSION_ID, {
    variables: { id: chatId },
    // Skip it if there's no chatId
    skip: !chatId,
  });

  if (error) {
    console.error("Could not retrieve the messages", error);
  }

  // Fill the messages with any previous message
  // in the session
  useEffect(() => {
    if (data?.chat_sessions) {
      setMessages(data.chat_sessions.messages);
    }
  }, [data]);

  useEffect(() => {
    const getSuggestion = async (chatbotId: string) => {
      // Make an API call to get suggestions
      try {
        const response = await fetch("/api/get-suggestions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chatbot_id: chatbotId,
          }),
        });
        const result = await response.json();
        setSuggestions(result.content);
      } catch (error) {
        console.error("Error getting suggestions", error);
      }
    };
    console.log("in suggestions", chatbotName, suggestionPage);
    if (suggestionPage && !(suggestions.length > 0) && chatbotData) {
      getSuggestion(id);
    } else {
      console.log("suggestions", suggestions);
    }
  }, [chatbotData, suggestionPage]);

  useEffect(() => {
    console.log(loggedIn, chatId);
  }, [loggedIn]);
  // Put this after all hooks so it won't change
  // the number of rendered hooks each time
  // Loading screen section when waiting of chatbot
  if (loadingChatbot) {
    console.log("loading", loadingChatbot, chatId);
    return (
      <div>
        <Loading title="Welcome" subtitle="Connecting you to your chatbot" />
      </div>
    );
  }

  // Handle name submit on login popup logic
  const handleUserSubmit = async () => {
    console.log("starting chat", name, email);
    setLoading(true);

    // StartNewChat is a function in lib/server
    // Start new chat session for a guest
    const chatId = await startNewChat(name, email, Number(id));

    setLoggedIn(true);

    setChatId(chatId);
    setLoading(false);
    console.log("log", loggedIn, chatId);
  };

  // Handle suggestion click logic
  const handleSuggestionSelection = (suggestion: string) => {
    setMessageValue((pastMessage) => `${pastMessage} ${suggestion}`);
  };

  // Handle text submit logic
  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    // If user is not logged in, the login dialog will pop up
    if (!user && !chatId) {
      setSignInPopup(true);
    } else {
      setLoading(true);

      // const { message: formMessage } = e.target.value;
      const message = messageValue;
      setMessageValue("");

      //TODO 4:06 prompt fill out name again
      // TODO handle empty message

      // TODO 4:08 optimistic user message

      // Update the UI with the user's message
      const userMessage: Message = {
        id: Date.now(),
        content: message,
        created_at: new Date().toISOString(),
        chat_session_id: chatId,
        sender: "user",
      };

      // Show loading state for AI response
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

      // actual api call for response
      try {
        console.log("going to api call");
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

          // keep track of text/result that get back
        });
        console.log("getting result");
        const result = await response.json();
        console.log("res", result);
        // Replacing the loading message with the AI response
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === loadingMessage.id
              ? { ...msg, content: result.content, id: result.id }
              : msg
          )
        );
      } catch (error) {
        console.error("error", error);
      }
    }
  }

  return (
    <div className="h-full w-full">
      {/* Login popup to sign the user in */}
      {/* Dialog will stay open if user is not logged in, */}
      {/* when loggedIn is false */}
      <Dialog
        open={signInPopup && !loggedIn}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setSignInPopup(false);
          }
        }}
      >
        <DialogContent className="bg-base-100 text-base-content">
          <DialogTitle>
            <div></div>
          </DialogTitle>
          <form
            onSubmit={(e) => {
              handleUserSubmit();
              e.preventDefault();
            }}
            className=""
          >
            <div className="flex flex-col items-center space-y-4">
              <div className="flex flex-col items-center">
                <h2 className="heading-md-bold">I'm excited to talk to you!</h2>
                <p className="body-xs">
                  I just need a few details to get started.
                </p>
              </div>
              <h2 className="heading-md-bold">Sign in to get started!</h2>
              <div className="btn btn-sm w-32 bg-secondary text-base-100 hover:bg-primary">
                <SignedIn>
                  {/* a wraper that will show this component if signed in */}
                  <UserButton />
                </SignedIn>
                <SignedOut>
                  <SignInButton />
                </SignedOut>
              </div>

              <div className="flex items-center w-full my-8">
                <hr className="mt-1 border-primary border w-full" />
                <p className="body-sm mx-2">or</p>
                <hr className="mt-1 border-primary border w-full" />
              </div>

              <h2 className="heading-md-bold">Continue as a guest</h2>

              <div className="flex flex-col items-start w-full">
                <label className="body-xs">Name</label>
                <input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  placeholder="Jane Doe"
                  className="input rounded-sm input-sm bg-base-100 w-full
                  p-2 border-b-gray-500 focus-within:outline-none
                  focus-within:border-0 focus-within:border-b-primary focus-within:border-b-2"
                />
                <label className="body-xs mt-4">Email</label>
                <input
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="text"
                  placeholder="Jane@gmail.com"
                  className="input rounded-sm input-sm bg-base-100 w-full
                  p-2 border-b-gray-500 focus-within:outline-none              
                  focus-within:border-0 focus-within:border-b-primary
                  focus-within:border-b-2"
                />
              </div>
              <button
                type="submit"
                disabled={!name || !email || loading}
                className="btn btn-sm w-32 bg-secondary text-base-100 hover:bg-primary"
              >
                {loading ? "Loading..." : "Continue"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <div
        className={`w-full h-full max-h-screen flex flex-col items-center
        justify-center overflow-y-clip`}
      >
        {!loggedIn ? (
          /* Introduction screen section */
          <div className={`flex-1 flex items-center justify-center`}>
            <div className="p-4 flex flex-col items-center">
              <h2 className="heading-md">Start your conversation with:</h2>
              <h1 className="heading-lg">{chatbotName}</h1>
              <Avatar seed={chatbotName || "custom chatbot"} />
              <ChatbotIntroScreen
                suggestions={suggestions}
                onSuggestionSelection={handleSuggestionSelection}
              />
            </div>
          </div>
        ) : (
          /* Messages section */
          <div
            className={`w-full h-full max-h-screen flex flex-col items-center
            justify-center overflow-y-clip`}
          >
            <div className={`w-full flex flex-col h-full`}>
              {/* Chatbot header section */}
              <div className="w-full bg-base-100 max-h-16 mt-8 p-2 items-center justify-between flex flex-row border-b-2 border-primary">
                <div className="items-center space-x-4 flex flex-row ">
                  <Avatar
                    seed={chatbotName || "custom chatbot"}
                    className="w-8 h-8"
                  />
                  <div className="flex flex-col items-start">
                    <h2 className="heading-md-bold">{chatbotName}</h2>
                    <p className="body-xs-muted">Typically replies instantly</p>
                  </div>
                </div>
                <div className="dropdown dropdown-bottom dropdown-end">
                  <div tabIndex={0} role="button" className="">
                    <Sparkles
                      className="h-5 w-5"
                      color={`${"black"}`}
                      strokeWidth={2}
                    />
                  </div>
                  <ul
                    tabIndex={0}
                    className="dropdown-content menu bg-base-100 rounded-box z-[1]
                    w-80 mt-4 p-4 shadow-lg border border-base-300"
                  >
                    <h2 className="body-sm font-bold">
                      Some prompt suggestions!
                    </h2>
                    {suggestions.map((suggestion) => {
                      return (
                        <li
                          className="btn btn-sm my-2 h-full bg-base-200 body-sm"
                          key={suggestion}
                          onClick={() => {
                            handleSuggestionSelection(suggestion);
                          }}
                        >
                          {suggestion}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto mb-28">
                <Messages
                  containerStyles={`w-full`}
                  messages={messages}
                  chatbotName={chatbotName || "n/a"}
                />
              </div>
            </div>
          </div>
        )}

        {/* Submit message section */}
        <form
          className="flex items-end justify-end sticky
          bottom-0 z-50 space-x-4 drop-shadow-xs border-t-2
          border-primary p-2 bg-base-200 w-full"
          onSubmit={onSubmit}
        >
          <label
            className="input input-bordered flex items-center gap-2 input-md
              focus-within:outline-none focus-within:border-primary rounded-xl
              w-full bg-base-100"
          >
            <input
              type="text"
              required
              value={messageValue}
              onChange={(e) => setMessageValue(e.target.value)}
              placeholder={`Message ${chatbotName}`}
              className="grow"
            />
            {/* TODO fix up arrow */}
            <button
              type="submit"
              className="btn btn-xs rounded-full bg-primary text-base-100 h-8 w-8"
              disabled={!messageValue}
            >
              <ArrowUp className="h-3 w-3" color="black" strokeWidth={2} />
            </button>
          </label>
        </form>
      </div>
    </div>
  );
}

export default ChatbotPage;
