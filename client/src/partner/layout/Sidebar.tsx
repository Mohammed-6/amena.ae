import {
  Home,
  Settings,
  Users,
  LogOut,
  Menu,
  NotebookPen,
  ShoppingBag,
  Store,
} from "lucide-react";
import Link from "next/link";

const Sidebar = ({
  isOpen,
  toggleSidebar,
}: {
  isOpen: boolean;
  toggleSidebar: () => void;
}) => {
  const logout = () => {
    if (typeof window !== undefined) {
      localStorage.removeItem("partnerId");
      window.location.replace("/partner/login");
    }
  };
  return (
    <div
      className={`bg-blue-900 text-white ${
        isOpen ? "w-64" : "w-20"
      } transition-all h-screen p-4 relative`}
    >
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute top-4 right-[-15px] bg-blue-600 p-2 rounded-full"
      >
        <Menu className="w-5 h-5 text-white" />
      </button>

      <h2
        className={`text-xl font-bold mb-6 text-center ${
          isOpen ? "block" : "hidden"
        }`}
      >
        Partner
      </h2>

      {/* Navigation Links */}
      <ul className="space-y-4">
        <li className="flex items-center space-x-2 p-2 rounded hover:bg-blue-700 cursor-pointer">
          <Home className="w-5 h-5" />
          {isOpen && <span>Dashboard</span>}
        </li>
        <li className="flex items-center space-x-2 p-2 rounded hover:bg-blue-700 cursor-pointer">
          <Link href={"/partner/orders"}>
            <div className="flex items-center gap-x-2">
              <div>
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>{isOpen && <span>Orders</span>}</div>
            </div>
          </Link>
        </li>
        <li className="flex items-center space-x-2 p-2 rounded hover:bg-blue-700 cursor-pointer">
          <Link href={"/partner/shop"}>
            <div className="flex items-center gap-x-2">
              <div>
                <Store className="w-5 h-5" />
              </div>
              <div>{isOpen && <span>Store</span>}</div>
            </div>
          </Link>
        </li>
        <li
          className="flex items-center space-x-2 p-2 rounded hover:bg-red-700 cursor-pointer mt-10"
          onClick={logout}
        >
          <LogOut className="w-5 h-5" />
          {isOpen && <span>Logout</span>}
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
