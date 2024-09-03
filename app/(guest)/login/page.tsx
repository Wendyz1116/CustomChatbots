// Done somewhere before 3:39
import { SignIn } from "@clerk/nextjs";
import Avatar from "../../../components/Avatar";
import Icon from "../../../components/Icon";

function login() {
  return (
    <div className="flex flex-1 py-10 md:py-0 flex-row justify-center items-center
    bg-primary">
      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-12 gap-4">
        <div
          className="flex flex-col items-center justify-center space-y-5
          text-base-100"
        >
          <Icon name="bot-message-square" className="h-24 w-24" />

          <div className="text-center">
            <h1 className="text-3xl font-bold">Custom Chatbots</h1>
            <h2 className="text-lg">
              Create Your Own Customizable AI Chatbot!
            </h2>
            <h3 className="my-5 text-md font-bold">Sign in to get started</h3>{" "}
          </div>
        </div>
        <div className="flex flex-row items-center justify-center">
          <SignIn
            routing="hash"
            fallbackRedirectUrl="/"
            appearance={{
              elements: {
                cardBox: "w-96 md:w-88",
                card: "h-76",
                footerAction: "h-12 items-center",
                formButtonPrimary: "bg-secondary hover:bg-primary",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default login;
