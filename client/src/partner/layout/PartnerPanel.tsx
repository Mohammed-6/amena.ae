import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { PartnerContextProvider } from "@/context/PartnerContext";
import Head from "next/head";

const PartnerPanel = ({ children }: { children: React.ReactNode }) => {
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
        <PartnerContextProvider>
          <div className="p-6">{children}</div>
        </PartnerContextProvider>
      </div>
    </div>
  );
};

export default PartnerPanel;
