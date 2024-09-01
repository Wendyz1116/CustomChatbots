"use client";
// since we're makeing name a state now,
// or we're using state

import { useUser } from "@clerk/nextjs";
import Avatar from "../../../components/Avatar";
import { FormEvent, useState } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_CHATBOT } from "../../../graphql/mutations/mutations";
import { useRouter } from "next/navigation";
import { constants } from "buffer";
//      className="flex flex-col items-center justify-center md:flex-row md:space-x-10 p-2 rounded-md m-10"

function CreateChatbot() {
  // use clerk useUser hook
  const { user } = useUser();
  const [name, setName] = useState("");
  const router = useRouter();
 
  // id is the users taht we r making the chatbot for
  // user? mean dk if exists
  // from this we get the mutation function creatChatbot
  // and the data/loading/error
  const [createChatbot, { data, loading, error }] = useMutation(
    CREATE_CHATBOT,
    {
      variables: {
        clerk_user_id: user?.id,
        name,
        created_at: new Date().toISOString(), // Current timestamp
      },
    }
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const data = await createChatbot();
      setName("");
      // data.data.insertChatbots.id this is what comes back
      // form createChatbot call
      console.log("data", data)
      router.push(`/edit-chatbot/${data.data.insertChatbots.id}`);
    } catch (error) {
      console.log(error);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col w-full items-center justify-center md:flex-row md:space-x-10 p-2">
      <div className="space-y-2 flex items-center justify-center flex-col rounded-md mx-10 p-5 bg-white">
        <Avatar seed="create-chatbot" />
        <div className=" text-xl lg:text-3xl font-bold">Create</div>
        <div className="font-light">
          Create a new chatbot to assist you in your conversations with your
          customers.
        </div>
        <form className="flex flex-col md:flex-row " onSubmit={handleSubmit}>
          <input
            type="text"
            required
            onChange={(e) => setName(e.target.value)}
            placeholder="Chatbot Name..."
            className="input input-bordered w-full input-sm bg-inherit focus-within:outline-none focus-within:border-primary"
          />
          {/* TODO have the input say the curr name */}
          <button
            type="submit"
            disabled={loading || !name}
            className="btn btn-sm bg-primary text-white"
          >
            {loading ? "Creating Chatbot..." : "Create Chatbot"}
          </button>
        </form>
        <p className="text-gray-300 mt-5">Example: Customer Support Chatbot</p>
      </div>
    </div>
  );
}

export default CreateChatbot;
