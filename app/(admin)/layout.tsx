// have the folder called admin with (admin) instead of just admin
// if just admin will create routes of /admin, with () it's like
// and invisible folder
// This layout will only apply the layout to roots under admin

import { auth } from "@clerk/nextjs/server";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import '../globals.css'; 
import { redirect } from "next/navigation";

async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const {userId} = await auth();
  if (!userId) {
    return redirect('/login')
  }
  return (
    <div className="flex flex-col flex-1 min-h-screen overflow-y-hidden">
      {/* Header */}
      <Header />
      {/* flex-1 make it take up all the space */}
      <div className="flex flex-row items-start justify-start h-full">
        {/* Sidebar */}
        <Sidebar/>
        <div className="flex flex-row w-full h-full
        items-center justify-evenly max-w-5xl mx-2">
          {/* children */}
          {children}
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
