import React, { useEffect, useState } from "react";
import {
  Map,
  PackageCheck,
  LogOut,
  Home,
  User,
  ChevronRight,
  MapPin,
  Pencil,
  Trash2,
  X,
  Check,
  Loader,
  Receipt,
  CircleAlert,
} from "lucide-react";
import { AddEditAddress, Layout as PageLayout } from "../layout";
import { useFileContext } from "@/context/FileUploadContext";
import { useRouter } from "next/router";
import { getCustomerOrder } from "../query/front";
import { toast } from "react-toastify";

const menuItems = [
  { name: "My Addresses", icon: <Map className="w-4 h-4" />, key: "addresses" },
  {
    name: "My Orders",
    icon: <PackageCheck className="w-4 h-4" />,
    key: "orders",
  },
  {
    name: "Logout",
    icon: <LogOut className="w-4 h-4 text-red-500" />,
    key: "logout",
  },
];

const AddressPage = () => {
  return (
    <>
      <PageLayout>
        <Content />
      </PageLayout>
    </>
  );
};
const Content = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("addresses");
  const { editProfileAddress } = useFileContext();

  useEffect(() => {
    if (router.query.slug !== undefined && router.query.slug !== "") {
      if (router.query.slug === "addresses") {
        setActiveTab("addresses");
      } else if (router.query.slug === "orders") {
        setActiveTab("orders");
      }
    }
  }, [router.query.slug]);

  const setShowLogout = () => {
    setActiveTab("addresses");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "addresses":
        return (
          <div className="p-4">
            <AddressTab />
          </div>
        );
      case "orders":
        return <CustomerOrders />;
      case "logout":
        // handle logout logic here
        return (
          <div className="p-4 text-red-500">
            <MakeLouout />
          </div>
        );
      default:
        return null;
    }
  };
  interface Order {
    orderId: string;
    createdAt: string;
    amountBreakdown: {
      grandTotal: number;
    };
    orderStatus: string;
  }

  const CustomerOrders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      const fetchOrders = async () => {
        try {
          const res = await getCustomerOrder();
          setOrders(res.data.orders);
        } catch (err) {
          toast.error("Failed to load orders.");
        } finally {
          setLoading(false);
        }
      };
      fetchOrders();
    }, []);

    if (loading) {
      return (
        <div className="flex items-center justify-center h-32 text-gray-500">
          <Loader className="animate-spin w-6 h-6 mr-2" /> Loading orders...
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-32 text-red-500">
          <CircleAlert className="w-5 h-5 mr-2" /> {error}
        </div>
      );
    }

    return (
      <div className="max-w-3xl mx-auto px-4 py-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Receipt className="w-5 h-5" /> Your Orders
        </h2>
        {orders.length === 0 ? (
          <p className="text-gray-500">You have no orders yet.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.orderId}
                className="border p-4 rounded-lg shadow-sm bg-white"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600 uppercase">
                    Order ID: <strong>{order.orderId}</strong>
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString("en-GB")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700 font-medium">
                    Status: {order.orderStatus}
                  </span>
                  <span className="font-bold">
                    AED {order.amountBreakdown.grandTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const add = () => {
    const data = {
      _id: "",
      user: "",
      addressType: "home",
      addressLine1: "",
      addressLine2: "",
      area: "",
      landmark: "",
      location: { type: "Point", coordinates: [25.2048, 55.2708] },
      name: "",
      phone: 0,
    };
    editProfileAddress(data);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 p-5 hidden md:block">
        <div className="flex items-center gap-3 mb-8">
          <User className="w-6 h-6 text-green-600" />
          <h2 className="text-lg font-semibold text-gray-800">My Account</h2>
        </div>
        <nav className="flex flex-col gap-y-2">
          {menuItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`flex items-center justify-between px-4 py-2 rounded-lg text-sm transition cursor-pointer hover:bg-gray-100 ${
                activeTab === item.key
                  ? "bg-green-100 text-green-800"
                  : "text-gray-700"
              }`}
            >
              <span className="flex items-center gap-2">
                {item.icon}
                {item.name}
              </span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-5">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-100">
            {/* <h3 className="text-lg font-semibold text-gray-800 capitalize">
              {activeTab.replace(/([A-Z])/g, " $1")}
            </h3> */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-800 capitalize">
                  {" "}
                  {activeTab.replace(/([A-Z])/g, " $1")}
                </h2>
              </div>
              <div>
                {activeTab === "addresses" && (
                  <button
                    className="text-white bg-green-600 rounded px-3 py-2"
                    onClick={add}
                  >
                    Add Address
                  </button>
                )}
              </div>
            </div>
          </div>
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

const AddressTab = () => {
  const {
    listaddress,
    loadAddresslist,
    isProfileAddressEdit,
    user,
    editProfileAddress,
    DeleteAddress,
  } = useFileContext();
  const [showeditaddress, setshoweditaddress] = useState<boolean>(false);
  const [pageToDelete, setPageToDelete] = useState<any>(null);

  useEffect(() => {
    if (user !== "") {
      loadAddresslist();
    }
  }, [user]);

  const edit = (address: any) => {
    setshoweditaddress(true);
    editProfileAddress(address);
  };

  const handleDelete = () => {
    DeleteAddress(pageToDelete._id);
    setPageToDelete(null);
  };
  return (
    <>
      {isProfileAddressEdit && <AddEditAddress />}
      {pageToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-2 text-red-600">
              Confirm Deletion
            </h3>
            <p className="text-sm text-gray-700 mb-4">
              Are you sure you want to delete this address:{" "}
              <span className="font-semibold text-black">
                {pageToDelete.addressType}
              </span>
              ?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setPageToDelete(null)}
                className="flex items-center gap-1 px-3 py-1.5 border rounded text-gray-600 hover:text-black hover:border-black"
              >
                <X className="w-4 h-4" /> Cancel
              </button>
              <button
                onClick={() => handleDelete()}
                className="flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white rounded hover:bg-red-700"
              >
                <Check className="w-4 h-4" /> Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
      <ul className="space-y-4">
        {listaddress.map((address, k) => (
          <li
            key={k}
            className="flex justify-between items-center border rounded p-4 hover:bg-gray-50 transition"
          >
            <div>
              <h3 className="text-md font-semibold capitalize">
                {address.addressType}
              </h3>
              <p className="text-sm text-gray-500">
                {[
                  address.addressLine1,
                  address.addressLine2,
                  address.area,
                  address.landmark,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                className="text-blue-600 hover:text-blue-800"
                onClick={() => edit(address)}
              >
                <Pencil className="w-5 h-5" />
              </button>
              <button
                onClick={() => setPageToDelete(address)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

const MakeLouout = () => {
  const { toogleLogoutconfirm } = useFileContext();
  useEffect(() => {
    toogleLogoutconfirm();
  }, []);
  return <></>;
};

export default AddressPage;
