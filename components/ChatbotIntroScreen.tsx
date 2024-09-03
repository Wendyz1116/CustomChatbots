import { useEffect, useState } from "react";

function ChatbotIntroScreen({ suggestions, onSuggestionSelection }) {
  console.log("intro", suggestions);
  return (
    <div className="flex flex-col items-center mx-4">
      {suggestions.length > 0 ? (
        <div className="flex flex-col items-center">
          <h1 className="heading-md-bold mt-4">
            Here are some prompt suggestions!
          </h1>
          {suggestions.map((suggestion) => {
            return (
              <div
                className="btn btn-sm my-2 bg-base-200"
                key={suggestion}
                onClick={() => {
                  console.log(suggestion);
                  onSuggestionSelection(suggestion);
                }}
              >
                {suggestion}
              </div>
            );
          })}
        </div>
      ) : (
        <h1 className="heading-md-bold mt-4 animate-pulse">
          Generating some prompt suggestions for you!
        </h1>
      )}
    </div>
  );
}

export default ChatbotIntroScreen;
