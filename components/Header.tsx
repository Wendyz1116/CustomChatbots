import Link from "next/link";
import Avatar from "./Avatar";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Icon from "./Icon";

function Header() {
  return (
    <div className="w-full h-20 max-h-20 min-h-20 bg-base-200 shadow-sm text-base-content flex justify-between p-4">
      {/* Reroute to the home page at "/" */}
      <Link href="/" className="flex items-center font-thin">
        <Icon name="bot-message-square" className="h-12 w-12"/>
        <div className="space-y-1 mx-2 flex flex-col">
          <div className="text-md font-bold text-base-content">Custom Chatbots</div>
          <div className="text-xs font-thin text-base-content">
            Your Own Customizable AI Chatbots
          </div>
        </div>
      </Link>
      <div className="flex items-center">
        <SignedIn>
          {/* a wraper that will show this component if signed in */}
          <UserButton />
        </SignedIn>
        <SignedOut>
          <SignInButton />
        </SignedOut>
      </div>
    </div>
  );
}

export default Header;
