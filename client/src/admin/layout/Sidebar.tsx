import {
  Home,
  Settings,
  Users,
  LogOut,
  Menu,
  NotebookPen,
  Rss,
  LayoutPanelTop,
  FileText,
  Receipt,
  BarChart3,
  Store,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

const Sidebar = ({
  isOpen,
  toggleSidebar,
}: {
  isOpen: boolean;
  toggleSidebar: () => void;
}) => {
  const router = useRouter();
  const currentPath = router.pathname;
  const [showFinanceMenu, setShowFinanceMenu] = useState(false);

  const navItems = [
    { href: "/admin", icon: <Home className="w-5 h-5" />, label: "Dashboard" },
    {
      href: "/admin/user",
      icon: <Users className="w-5 h-5" />,
      label: "Users",
    },
    {
      href: "/admin/onboarding",
      icon: <NotebookPen className="w-5 h-5" />,
      label: "Onboarding",
    },
    {
      href: "/admin/orders",
      icon: <Receipt className="w-5 h-5" />,
      label: "Orders",
    },
    {
      href: "/admin/file-uploads",
      icon: <FileText className="w-5 h-5" />,
      label: "File Uploads",
    },
    {
      href: "/admin/user-journey",
      icon: <BarChart3 className="w-5 h-5" />,
      label: "User Journey",
    },
    {
      href: "/admin/shop",
      icon: <Store className="w-5 h-5" />,
      label: "Stores",
    },
    { href: "/admin/blog", icon: <Rss className="w-5 h-5" />, label: "Blog" },
    {
      href: "/admin/seo-page",
      icon: <LayoutPanelTop className="w-5 h-5" />,
      label: "SEO Page",
    },
    {
      href: "/admin/settings",
      icon: <Settings className="w-5 h-5" />,
      label: "Settings",
    },
  ];

  return (
    <div
      className={`bg-blue-950 text-white shadow-md flex flex-col justify-between transition-all duration-300 ${
        isOpen ? "w-64" : "w-20"
      } h-screen p-4 relative`}
    >
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute top-4 right-[-15px] bg-blue-700 p-2 rounded-full shadow-md"
      >
        <Menu className="w-5 h-5 text-white" />
      </button>

      {/* Header */}
      <div>
        <h2
          className={`text-2xl font-semibold mb-8 text-center tracking-wide ${
            isOpen ? "block" : "hidden"
          }`}
        >
          Admin
        </h2>

        {/* Navigation Links */}
        <ul className="space-y-3">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 p-2 rounded-md transition ${
                  currentPath === item.href
                    ? "bg-blue-800"
                    : "hover:bg-blue-800"
                }`}
              >
                {item.icon}
                {isOpen && <span>{item.label}</span>}
              </Link>
            </li>
          ))}

          {/* Finance Dropdown */}
          <li>
            <button
              onClick={() => setShowFinanceMenu(!showFinanceMenu)}
              className="flex items-center w-full gap-3 p-2 rounded-md hover:bg-blue-800 transition"
            >
              <Receipt className="w-5 h-5" />
              {isOpen && (
                <div className="flex items-center justify-between w-full">
                  <span>Finance</span>
                  <ChevronDown
                    className={`w-4 h-4 transform transition-transform duration-200 ${
                      showFinanceMenu ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </div>
              )}
            </button>
            {showFinanceMenu && isOpen && (
              <ul className="ml-6 mt-1 space-y-2">
                <li>
                  <Link
                    href="/admin/commision/partner-commision"
                    className={`block px-2 py-1 rounded-md hover:bg-blue-800 text-sm ${
                      currentPath === "/admin/commissions" ? "bg-blue-800" : ""
                    }`}
                  >
                    Commissions
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin/commision/payout"
                    className={`block px-2 py-1 rounded-md hover:bg-blue-800 text-sm ${
                      currentPath === "/admin/payout" ? "bg-blue-800" : ""
                    }`}
                  >
                    Partner Payouts
                  </Link>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </div>

      {/* Logout */}
      <div className="mt-8">
        <button className="flex items-center gap-3 p-2 rounded-md w-full text-left hover:bg-red-700 transition">
          <LogOut className="w-5 h-5" />
          {isOpen && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
