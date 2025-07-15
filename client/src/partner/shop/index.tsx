import { useEffect, useState } from "react";
import PartnerPanel from "../layout/PartnerPanel";
import axios from "axios";
import { APP_SERVER_URL, Preloader } from "@/src/utils/common";
import { toast } from "react-toastify";
import DraggableMapComponent from "@/src/google/address-locator";

type Shop = {
  _id: string;
  shopName: string;
  address: string;
  phone: number;
  businessLocation: string;
  openingHours: Record<string, { open: string; close: string }>;
  partnerId: string;
  location: any;
};

type Props = {
  shop: Shop;
  userPartnerId: string; // Logged-in partner's ID
};

const shopData = {
  _id: "12345",
  shopName: "Tech Store",
  address: "123 Business Bay, Dubai",
  phone: 971556789012,
  businessLocation: "Dubai",
  location: { type: "Point", coordinates: [25.1808005, 55.2603772] },
  openingHours: {
    Monday: { open: "09:00", close: "18:00" },
    Tuesday: { open: "09:00", close: "18:00" },
    Wednesday: { open: "09:00", close: "18:00" },
    Thursday: { open: "09:00", close: "18:00" },
    Friday: { open: "09:00", close: "18:00" },
    Saturday: { open: "10:00", close: "16:00" },
    Sunday: { open: "Closed", close: "Closed" },
  },
  partnerId: "partner123",
};

const Dashboard = () => {
  return (
    <>
      <PartnerPanel>
        <Content />
      </PartnerPanel>
    </>
  );
};
const Content = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [shop, setshop] = useState<Shop>(shopData);
  const [loading, setloading] = useState<boolean>(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const shopId = localStorage.getItem("shopId");
      setloading(true);
      axios
        .get(APP_SERVER_URL + "/api/v1/partner/get-shop/" + shopId, {
          headers: { token: localStorage.getItem("ptoken") },
        })
        .then((res) => {
          setshop(res.data.shop);
          setloading(false);
        })
        .catch((error) => {
          console.log(error);
          setloading(false);
        });
    }
  }, []);

  const handleChange = (field: keyof Shop, value: any) => {
    setshop((prev) => ({ ...prev, [field]: value }));
  };

  const handleHoursChange = (
    day: string,
    field: "open" | "close",
    value: string
  ) => {
    setshop((prev) => ({
      ...prev,
      openingHours: {
        ...prev.openingHours,
        [day]: { ...prev.openingHours[day], [field]: value },
      },
    }));
  };

  const handleSave = () => {
    console.log("Updated Shop Data:", shop);
    setIsEditing(false);
    updateShop();
    // Here you would call an API to save the changes
  };

  const updateLatLng = (lat: number, lng: number, address: string | null) => {
    // console.log(lat, lng, address);
    const temp = [...shop.location.coordinates];
    temp[0] = lat;
    temp[1] = lng;
    if (address !== null && address !== "") {
      //   updateShopDetails("businessLocation", address);
    }
    setshop((prev) => ({
      ...prev,
      location: { type: "Point", coordinates: temp },
    }));
  };

  const updateShop = () => {
    try {
      setloading(true);
      axios
        .post(
          APP_SERVER_URL + "/api/v1/partner/update-shop/" + shop._id,
          shop,
          {
            headers: { token: localStorage.getItem("ptoken") },
          }
        )
        .then((res) => {
          //   setshop(res.data.shop);
          setloading(false);
          toast.success("Shop updated");
        })
        .catch((error) => {
          console.log(error);
          setloading(false);
          toast.error("Something went wrong");
        });
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">{shop.shopName}</h2>
      {loading && <Preloader />}
      <div className="mb-2">
        <label className="block font-medium">Address:</label>
        {isEditing ? (
          <input
            type="text"
            value={shop.address}
            onChange={(e) => handleChange("address", e.target.value)}
            className="border p-2 w-full rounded-md"
          />
        ) : (
          <p className="text-gray-700">{shop.address}</p>
        )}
      </div>

      <div className="mb-2">
        <label className="block font-medium">Phone:</label>
        {isEditing ? (
          <input
            type="text"
            value={shop.phone}
            onChange={(e) => handleChange("phone", Number(e.target.value))}
            className="border p-2 w-full rounded-md"
          />
        ) : (
          <p className="text-gray-700">{shop.phone}</p>
        )}
      </div>

      <div>
        <div className="w-full h-64">
          {!loading && (
            <DraggableMapComponent
              updateLocation={updateLatLng}
              location={shop.location}
            />
          )}
        </div>
      </div>

      <h3 className="font-semibold mt-4">Opening Hours:</h3>
      {Object.entries(shop.openingHours).map(([day, times]) => (
        <div key={day} className="flex items-center justify-between mt-1">
          <span className="capitalize">{day}:</span>
          {isEditing ? (
            <div className="flex gap-2">
              <input
                type="time"
                value={shop.openingHours[day].open}
                onChange={(e) => handleHoursChange(day, "open", e.target.value)}
                className="border p-1 rounded-md"
              />
              <input
                type="time"
                value={shop.openingHours[day].close}
                onChange={(e) =>
                  handleHoursChange(day, "close", e.target.value)
                }
                className="border p-1 rounded-md"
              />
            </div>
          ) : (
            <span>
              {times.open} - {times.close}
            </span>
          )}
        </div>
      ))}

      <div className="mt-4 flex justify-end">
        {isEditing ? (
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Save
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-gray-500 text-white px-4 py-2 rounded-md"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
