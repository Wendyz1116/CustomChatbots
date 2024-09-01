import React from "react";
import { ChatbotCharacteristic } from "../types/types";

function Characteristic({
  characteristic,
}: {
  characteristic: ChatbotCharacteristic;
}) {
  return (
    <li className="bg-white p-8 border rounded-md">
      {characteristic.content}
      {/* <button className="btn btn-lg h-3 w-2 absolute top-1 right-1 bg-red-500">
        X
      </button> */}
      {/* 2:22 TODO onclick to remove the characteristic or deletet the chatbot */}
    </li>
  );
}

export default Characteristic;
