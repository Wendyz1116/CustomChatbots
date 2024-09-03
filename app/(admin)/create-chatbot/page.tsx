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
    <div className="flex flex-col w-full items-center justify-center md:flex-row md:space-x-10 p-2 h-full">
      <div className="space-y-2 flex items-center justify-center flex-col">
        <h1 className="heading-lg">Create a new chatbot!</h1>
        <p className="body-xs-muted text-center my-4">
          Create a new chatbot to personalize your conversations with customers.
          <br />
          Provide specialized assistance and support tailored to their needs.
        </p>
        <form className="flex flex-row" onSubmit={handleSubmit}>
          <input
            type="text"
            required
            onChange={(e) => setName(e.target.value)}
            placeholder="Chatbot name"
            className="input input-bordered w-full input-sm focus-within:outline-none focus-within:border-primary"
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
        <p className="body-xs-muted text-gray-300 mt-4">Example: Customer Support Chatbot</p>
      </div>
    </div>
  );
}

export default CreateChatbot;
