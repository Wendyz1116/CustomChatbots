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
import { ADD_CHARACTERISTIC, CREATE_CHATBOT } from "../../../../graphql/mutations/mutations";
import { useUser } from "@clerk/nextjs";

// the [id] is actually a wildcard
// so edit-chatbot/1 or /2 or /#
function EditChatbot({ params: { id } }: { params: { id: string } }) {
  const [url, setUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [chatbotName, setChatbotName] = useState<string>("");
  const [newCharacteristic, setNewCharacteristic] = useState<string>("");

  const [addCharacteristic] = useMutation(ADD_CHARACTERISTIC, {
    refetchQueries: ["GetChatbotById"],
  });

  // <> is casting the types, limit both the response and the variables to the specific types
  const { data, loading, error } = useQuery<
    GetChatbotByIdResponse,
    GetChatbotByIdVariables
  >(GET_CHATBOT_BY_ID, { variables: { id } });

  console.log("dataa", data);
  useEffect(() => {
    if (data) {
      setChatbotName(data.chatbots.name);
    }
    // know that data will have a chatbot item w a name
  }, [data]);

  const handelAddCharacteristic = async (content: string) => {
    try {
      console.log("adding", content, id, new Date().toISOString() );
      const promise = addCharacteristic({
        variables: {
          chatbotId: Number(id),
          content,
          created_at: new Date().toISOString()
        },
      });

      await promise;
      console.log("after await", data);

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
    const url = `${BASE_URL}/chatbot/${id}`;
    setUrl(url);
  }, [id]);

  return (
    <div className="px-0 md:p-10">
      <div
        className="md:sticky md:top-0 z-50 sm:max-w-sm ml-auto space-y-2
    md:border md:shadow-sm p-5 rounded-b-lg md:rounded-md bg-primary"
      >
        <h2 className="text-white text-sm font-bold">Link to Chat</h2>
        <p className="text-white text-sm italic">
          Share this link to start a convo with this chatbot
        </p>
        <div className="w-full min-w-full bg--200 flex items-center space-x-2">
          <Link
            className="hover:opacity-50 cursor-pointer w-full"
            href={url}
          >
            <input
              value={url}
              readOnly
              className="px-1 py-1 rounded-md cursor-pointer w-full"
            />
          </Link>
          <button className="btn btn-sm w-10 bg-gray-700" onClick={handleCopy}>
            <Icon name="copy" className="text-white h-3 w-3" />
          </button>
        </div>
      </div>
      <div className="toast toast-center z-50">
        {copied ? (
          <div className="z-50 alert alert-info bg-primary text-white">
            <span>Copied to clipboard</span>
          </div>
        ) : (
          <div></div>
        )}
      </div>
      <section className="relative mt-5 bg-white p-5 md:p-10 rounded-lg">
        {/* delete button */}
        <button className="btn btn-sm absolute top-2 right-2 h-8 w-5 bg-red-500 text-white">
          X
        </button>
        <div className="flex flex-col items-center">
          {/* <Avatar seed={chatbotName} /> */}
          {/* TODO 2:15 to have a form that let people update the name */}
          <div className=" text-xl lg:text-3xl font-bold">
            Chatbot name: {chatbotName}
          </div>
        </div>
        <div className=" text-md lg:text-lg font-bold">
          Here's what your AI chatbot knows...
        </div>
        <p>
          It's equipped with this info to assist you in your convos with your
          customers and users
        </p>
        <div className="bg-gray-300 p-5 rounded-mb mt-5">
          <form
            className="flex flex-col md:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              handelAddCharacteristic(newCharacteristic);
              setNewCharacteristic("");
            }}
          >
            <input
              type="text"
              placeholder="For example: If user ask for prices, provide page: www.ex.com/pricing"
              value={newCharacteristic}
              onChange={(e) => setNewCharacteristic(e.target.value)}
              className="input input-bordered w-full input-sm bg-inherit focus-within:outline-none focus-within:border-primary"
            />
            {/* TODO have the input say the curr name */}
            <button
              type="submit"
              className="btn btn-sm bg-primary text-white"
              disabled={!newCharacteristic}
            >
              Add
              {/* TODO 2:36 adding button not working */}
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
