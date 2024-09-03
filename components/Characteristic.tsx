// to have a mutation it needs to be a client component
"use client";
import { REMOVE_CHARACTERISTIC } from "../graphql/mutations/mutations";
import { ChatbotCharacteristic } from "../types/types";
import { useMutation } from "@apollo/client";
import { X, Copy } from "lucide-react";

function Characteristic({
  characteristic,
}: {
  characteristic: ChatbotCharacteristic;
}) {
  // Set the mutation
  const [removeCharacteristic] = useMutation(
    REMOVE_CHARACTERISTIC,
    // Make it refetch all the queries that "GetChatbotById"
    { refetchQueries: ["GetChatbotById"] }
  );

  // Handle delete logic
  // TODO3 add fade out animate to show it being deleted
  const handleRemoveCharacteristic = async () => {
    try {
      console.log("removing", characteristic.id);
      // Call remove characteristic with the characteristic
      // id of the characteristic we want to delete
      await removeCharacteristic({
        variables: { charactertisticId: characteristic.id },
      });
    } catch (error) {
      console.error("error removing characteristic", error);
    }
  };
  return (
    <li
      className="bg-base-100 p-2 border relative rounded-lg w-full"
      key={characteristic.id}
    >
      {characteristic.content}
      <div
        className="absolute top-1 right-1 bg-none w-3 h-3
        text-error hover:text-red-700 hover:cursor-pointer"
        onClick={() => {
          handleRemoveCharacteristic();
        }}
      >
        <X className="w-3 h-3" color="rgb(185 28 28)" />
      </div>
    </li>
  );
}

export default Characteristic;
