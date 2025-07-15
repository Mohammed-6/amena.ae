// EditShopDetails.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import { APP_SERVER_URL } from "@/src/utils/common";
import AdminPanel from "../layout/AdminPanel";
import { toast } from "react-toastify";

const EditShopDetails = () => {
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
  const [selectedShop, setSelectedShop] = useState<any>(null);
  const [formData, setFormData] = useState({
    shopName: "",
    phone: "",
    website: "",
    serviceArea: "",
    printerDetails: {
      brand: "",
      model: "",
      bwRate: "",
      colorRate: "",
    },
  });

  const fetchShops = async () => {
    const res = await axios.get(APP_SERVER_URL + "/api/admin/all-shops", {
      headers: { token: localStorage.getItem("atoken") },
    });
    setShops(res.data);
  };

  const handleSelect = (shop: any) => {
    setSelectedShop(shop._id);
    setFormData({
      shopName: shop.shopName,
      phone: shop.phone,
      website: shop.website,
      serviceArea: shop.serviceArea,
      printerDetails: shop.printerDetails || {
        brand: "",
        model: "",
        bwRate: "",
        colorRate: "",
      },
    });
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    if (name in formData.printerDetails) {
      setFormData({
        ...formData,
        printerDetails: {
          ...formData.printerDetails,
          [name]: value,
        },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await axios.put(
      APP_SERVER_URL + `/api/admin/shops/${selectedShop}`,
      formData,
      { headers: { token: localStorage.getItem("atoken") } }
    );
    fetchShops();
    toast.success("Shop updated successfully");
  };

  useEffect(() => {
    fetchShops();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h2 className="text-xl font-bold mb-6">Edit Shop Details</h2>

      {/* Shop Selector */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">Select Shop</label>
        <select
          className="w-full p-2 border rounded"
          onChange={(e) => {
            const shop = shops.find((s: any) => s._id === e.target.value);
            if (shop) handleSelect(shop);
          }}
        >
          <option value="">-- Select --</option>
          {shops.map((shop: any) => (
            <option key={shop._id} value={shop._id}>
              {shop.shopName}
            </option>
          ))}
        </select>
      </div>

      {selectedShop && (
        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-white p-4 rounded shadow"
        >
          <div>
            <label className="block text-sm font-medium">Shop Name</label>
            <input
              type="text"
              name="shopName"
              value={formData.shopName}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Website</label>
            <input
              type="text"
              name="website"
              value={formData.website}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Service Area</label>
            <input
              type="text"
              name="serviceArea"
              value={formData.serviceArea}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Brand</label>
              <input
                type="text"
                name="brand"
                value={formData.printerDetails.brand}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Model</label>
              <input
                type="text"
                name="model"
                value={formData.printerDetails.model}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">
                B/W Rate (AED)
              </label>
              <input
                type="text"
                name="bwRate"
                value={formData.printerDetails.bwRate}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">
                Color Rate (AED)
              </label>
              <input
                type="text"
                name="colorRate"
                value={formData.printerDetails.colorRate}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Update Shop
          </button>
        </form>
      )}
    </div>
  );
};

export default EditShopDetails;
