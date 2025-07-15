// AdminShopView.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import { MapPin, Phone, Printer, Globe, Clock, Check, X } from "lucide-react";
import { APP_SERVER_URL } from "@/src/utils/common";
import AdminPanel from "../layout/AdminPanel";
import Link from "next/link";

const AdminShopView = () => {
  return (
    <>
      <AdminPanel>
        {/* <OrderTable /> */}
        <Content />
      </AdminPanel>
    </>
  );
};

const Content = () => {
  const [shops, setShops] = useState([]);

  const fetchShops = async () => {
    const res = await axios.get(APP_SERVER_URL + "/api/admin/all-shops", {
      headers: { token: localStorage.getItem("atoken") },
    });
    setShops(res.data);
  };

  const toggleShopStatus = async (id: string, currentStatus: boolean) => {
    await axios.patch(
      `${APP_SERVER_URL}/api/admin/shop-status/${id}`,
      {
        status: !currentStatus,
      },
      { headers: { token: localStorage.getItem("atoken") } }
    );
    fetchShops();
  };

  useEffect(() => {
    fetchShops();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h2 className="text-xl font-semibold mb-4">Shops</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {shops.map((shop: any) => (
          <div
            key={shop._id}
            className="bg-white rounded shadow p-5 flex flex-col gap-2"
          >
            <h3 className="text-lg font-bold text-blue-700">{shop.shopName}</h3>
            <div className="text-sm text-gray-600 flex items-center gap-2">
              <MapPin className="w-4 h-4" /> {shop.serviceArea}
            </div>
            <div className="text-sm text-gray-600 flex items-center gap-2">
              <Phone className="w-4 h-4" /> {shop.phone}
            </div>
            <div className="text-sm text-gray-600 flex items-center gap-2">
              <Globe className="w-4 h-4" />{" "}
              <a href={shop.website} target="_blank" className="underline">
                {shop.website}
              </a>
            </div>
            <div className="text-sm text-gray-600 flex items-center gap-2">
              <Printer className="w-4 h-4" /> {shop.printerDetails?.brand}{" "}
              {shop.printerDetails?.model}
            </div>
            <div className="text-xs text-gray-500">
              <strong>Rate:</strong> B/W AED {shop.printerDetails?.bwRate},
              Color AED {shop.printerDetails?.colorRate}
            </div>
            <div className="text-sm text-gray-500">
              <Clock className="w-4 h-4 inline-block" /> Opens:{" "}
              {Object.keys(shop.openingHours)
                .map(
                  (day) =>
                    `${day.slice(0, 3)}: ${shop.openingHours[day].open}-${
                      shop.openingHours[day].close
                    }`
                )
                .join(", ")}
            </div>
            <div className="flex items-center gap-x-4">
              <div className="mt-2">
                <button
                  onClick={() => toggleShopStatus(shop._id, shop.staus)}
                  className={`px-4 py-1 rounded text-white text-sm ${
                    shop.staus
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {shop.staus ? (
                    <>
                      <X className="inline-block w-4 h-4 mr-1" /> Disable
                    </>
                  ) : (
                    <>
                      <Check className="inline-block w-4 h-4 mr-1" /> Enable
                    </>
                  )}
                </button>
              </div>
              <div className="mt-2">
                <Link
                  href={`/admin/shop/${shop._id}`}
                  className="px-4 py-1 rounded text-white text-smbg-green-600 bg-green-600 hover:bg-green-700"
                >
                  Edit
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminShopView;
