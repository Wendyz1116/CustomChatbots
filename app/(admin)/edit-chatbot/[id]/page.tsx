"use client";

import { useEffect, useState } from "react";
import { BASE_URL } from "../../../../graphql/apolloClient";
import Link from "next/link";
import Icon from "../../../../components/Icon";
import { useMutation, useQuery } from "@apollo/client";
import { GET_CHATBOT_BY_ID } from "../../../../graphql/queries/queries";
import {
  GetChatbotByIdResponse,
  GetChatbotByIdVariables,
} from "../../../../types/types";
import Avatar from "../../../../components/Avatar";
import Characteristic from "../../../../components/Characteristic";
import {
  ADD_CHARACTERISTIC,
  CREATE_CHATBOT,
  REMOVE_CHATBOT,
} from "../../../../graphql/mutations/mutations";
import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { Copy, Trash2 } from "lucide-react";
import Loading from "../../../../components/Loading";

// the [id] is actually a wildcard
// so this page will show on edit-chatbot/1 or /2 or /#
function EditChatbot({ params: { id } }: { params: { id: string } }) {
  // initialize states
  const [url, setUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [chatbotName, setChatbotName] = useState<string>("");
  const [newCharacteristic, setNewCharacteristic] = useState<string>("");

  const [addCharacteristic] = useMutation(ADD_CHARACTERISTIC, {
    refetchQueries: ["GetChatbotById"],
  });

  // <> is casting the types, limit both the response and the variables to the specific types
  // Get the chatbot by the wildcard id
  const { data, loading, error } = useQuery<
    GetChatbotByIdResponse,
    GetChatbotByIdVariables
  >(GET_CHATBOT_BY_ID, { variables: { id } });

  console.log("dataa", data);

  // Set the chatbot name
  useEffect(() => {
    if (data) {
      setChatbotName(data.chatbots.name);
    }
    // know that data will have a chatbot item w a name
  }, [data]);

  // Handle add button logic
  const handleAddCharacteristic = async (content: string) => {
    try {
      const promise = addCharacteristic({
        variables: {
          chatbotId: Number(id),
          content,
          created_at: new Date().toISOString(),
        },
      });

      await promise;

      // toast.promise(promise, {
      //   loading: "Adding...",
      //   success: "Information added",
      //   error: "Failed ot add info"
      // })

      // Add a toast
    } catch (error) {
      console.error("Failed to add characteristic:", error);
    }
  };

  // Handle copy logic
  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
  };

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => {
        setCopied(false);
      }, 5000); // 5 seconds

      return () => clearTimeout(timer); // Clean up the timer on unmount
    }
  }, [copied]);

  useEffect(() => {
    if (deleted) {
      const timer = setTimeout(() => {
        setDeleted(false);
      }, 5000); // 5 seconds

      return () => clearTimeout(timer); // Clean up the timer on unmount
    }
  }, [deleted]);

  // Set the chatbot url
  useEffect(() => {
    const url = `${BASE_URL}/chatbot/${id}`;
    setUrl(url);
  }, [id]);

  const [deleteChatbot] = useMutation(REMOVE_CHATBOT, {
    refetchQueries: ["GetChatbotById"], // refetch chatbots after deleting
    awaitRefetchQueries: true,
  });

  // Handle delete logic
  const handleDeleteChatbot = async () => {
    const isConfirmed = window.confirm("Are you sure you want to delete this chatbot?")
    if (!isConfirmed) return;

    try {
      await deleteChatbot({ variables: { chatbotId: id } });
    } catch (error) {
      console.error("Error removing chatbot", error);
    }
  };

  if (error) return <div>Error: {error.message}</div>;

  // Loading page
  if (loading) {
    return (
      <div className="mx-auto animate-pin p-10">
        <Loading
          title="Loading Chatbot"
          subtitle="Gathering all the details to get started"
        />
      </div>
    );
  }

  if (!data?.chatbots) return redirect("/view-chatbots");

  return (
    <div className="px-0 md:p-10 h-full overflow-y-auto">
      {/* Share chatbot link section */}
      <div
        className="md:sticky md:top-0 z-50 sm:max-w-sm ml-auto space-y-2
        md:border md:shadow-sm p-5 rounded-b-lg md:rounded-md bg-primary"
      >
        <h2 className="text-base-100 heading-md-bold font-bold">
          Link to Chat
        </h2>
        <p className="text-base-100 body-sm italic">
          Share this link to start a conversation with this chatbot
        </p>
        <div className="w-full min-w-full bg--200 flex items-center space-x-2">
          <Link className="hover:opacity-50 cursor-pointer w-full" href={url}>
            <input
              value={url}
              readOnly
              className="px-1 py-1 rounded-md cursor-pointer w-full bg-base-100"
            />
          </Link>
          <button className="btn btn-sm w-10 bg-primary" onClick={handleCopy}>
            <Copy color="white" />
          </button>
        </div>
      </div>

      {/* Copy toast */}
      <div className="toast toast-center z-50">
        {copied ? (
          <div className="z-50 alert alert-info bg-primary text-base-100
          text-center flex items-center">
            <span>Copied to clipboard</span>
          </div>
        ) : (
          <div></div>
        )}
      </div>

      <div className="toast toast-center z-50">
        {deleted ? (
          <div
            className="flex z-50 alert alert-info bg-primary
          text-white items-center"
          >
            <span>Deleting chatbot</span>
          </div>
        ) : (
          <div></div>
        )}
      </div>

      {/* Main chatbot section */}
      <section className="relative mt-5 p-5 md:p-10 rounded-lg">
        {/* delete button */}
        <div
          className="absolute top-2 right-2 hover:text-red-700
          bg-none text-error rounded-md text-sm font-bold hover:cursor-pointer"
          onClick={() => {
            handleDeleteChatbot();
            setDeleted(true);
          }}
        >
          Delete
        </div>
        <div className="flex flex-col items-center">
          {/* <Avatar seed={chatbotName} /> */}
          {/* TODO 2:15 to have a form that let people update the name */}
          <div className=" text-xl lg:text-3xl font-bold">
            Chatbot name: {chatbotName}
          </div>
        </div>

        <hr className="mt-2" />

        <div className=" text-md lg:text-lg font-bold">
          Here's what your AI chatbot knows...
        </div>
        <p>
          It's equipped with this information to help you during conversations
          with users.
        </p>

        {/* Chatbot characteristic section */}
        <div className="bg-base-300 p-5 rounded-md border mt-5">
          <form
            className="flex flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              handleAddCharacteristic(newCharacteristic);
              setNewCharacteristic("");
            }}
          >
            <input
              type="text"
              placeholder="For example: If a user asks for prices, provide page: www.example.com/pricing"
              value={newCharacteristic}
              onChange={(e) => setNewCharacteristic(e.target.value)}
              className="input input-bordered w-full input-sm bg-base focus-within:outline-none focus-within:border-primary"
            />
            {/* TODO have the input say the curr name */}
            <button
              type="submit"
              className="btn btn-sm bg-primary text-white"
              disabled={!newCharacteristic}
            >
              Add
            </button>
          </form>

          <ul className="flex flex-wrap-reverse gap-5 mt-2">
            {data?.chatbots.chatbot_characteristics.map((characteristic) => (
              <Characteristic
                key={characteristic.id}
                characteristic={characteristic}
              />
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

export default EditChatbot;
