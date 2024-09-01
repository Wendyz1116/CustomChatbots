import Link from "next/link";
import Avatar from "./Avatar";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

function Header() {
  return (
    <header className="bg-white w-full shadow-sm text-gray-800 flex justify-between p-5">
      {/* Take it backe to /route or home */}
      <Link href="/" className="flex items-center text-4xl font-thin">
        {/* Avatar */}
        <Avatar seed="hello world" className="mx-2" />
        <div className="space-y-2 mx-2 flex flex-col">
          <div className="text-md font-bold">Custom Chatbots</div>
          <div className="text-sm font-thin">
            Your Customizable AI Chat Agent
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
    </header>
  );
}

export default Header;
