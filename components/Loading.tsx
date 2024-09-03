import React from "react";
import Icon from "./Icon";

function Loading({title, subtitle}) {
// TODO2 Add different loading messages to show the process
  return (
    <div className="flex flex-col items-center">
      <h1 className="heading-lg">{title}</h1>
      <h2 className="heading-md">{subtitle}</h2>
      <span className="loading loading-dots loading-lg text-primary mt-2"></span>
    </div>
  );
}

export default Loading;
