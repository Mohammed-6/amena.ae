import { Bell, User } from "lucide-react";

const Header = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
  return (
    <div className="bg-white shadow-md p-4 flex justify-between items-center">
      <button onClick={toggleSidebar} className="text-blue-900">
        ☰
      </button>
      <div className="flex space-x-4 items-center">
        <Bell className="w-6 h-6 text-gray-700 cursor-pointer" />
        <User className="w-6 h-6 text-gray-700 cursor-pointer" />
      </div>
    </div>
  );
};

export default Header;
