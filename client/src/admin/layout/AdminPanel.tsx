import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { AdminContextProvider } from "@/context/AdminContext";
import Head from "next/head";

const AdminPanel = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Head>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        {/* Main Content */}
        <AdminContextProvider>
          <div className="p-6">{children}</div>
        </AdminContextProvider>
      </div>
    </div>
  );
};

export default AdminPanel;
