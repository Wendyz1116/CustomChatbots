// rep /home page
// page.tsx only under admin cause noone should
// rly be coming to this home page unless
// they're trying to set up a chatbot/an admin

import Link from "next/link";

export default function Home() {
  return (
    <main className="p-8 mt-8 h-full overflow-y-hidden w-full space-y-4">
      <h1 className="text-4xl">
        Welcome to{" "}
        <span className="text-primary font-bold">Custom Chatbots</span>!
      </h1>
      <p className="body-sm">
        Explore a world of possibilities with our platform, where you can create
        and deploy personalized AI chatbots to suit your needs.
      </p>
      <p className="body-sm">
        Design chatbots that enhance customer support with thoughtful, customized responses and
        detailed information. Build engaging experiences that reflect your
        personal brand through unique personal stories and advice. Craft
        friendly bots that share favorite tips, recommend products, or interact
        with fans in real-time. 
      </p>
      <p className="body-sm">
        Whether you're looking to elevate customer interactions, offer specialized
        advice, or enrich connections, Custom
        Chatbots makes it simple and enjoyable to bring your ideas to life with
        advanced AI technology.
      </p>
      <Link href="/create-chatbot">
        <button className="btn btn-sm rounded-md bg-secondary text-base-100 mt-4">
          Let's create a custom chatbot!
        </button>
      </Link>
    </main>
  );
}
