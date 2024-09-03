// have the folder called admin with (admin) instead of just admin
// if just admin will create routes of /admin, with () it's like
// and invisible folder
// This layout will only apply the layout to roots under admin

import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import '../globals.css'; 

function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col flex-1 min-h-screen max-h-screen overflow-y-clip">
      {/* Header */}
      <Header />
      {/* flex-1 make it take up all the space */}
      <div className="flex flex-row items-start justify-start h-full w-full">
        {/* Sidebar */}
        <Sidebar/>
        <div className="flex flex-row w-full h-full
        items-center justify-evenly max-w-5xl">
          {/* children */}
          {children}
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
