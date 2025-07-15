// AdminShopCommissionView.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import { APP_SERVER_URL } from "@/src/utils/common";
import { toast } from "react-toastify";
import AdminPanel from "../layout/AdminPanel";

const AdminShopCommissionView = () => {
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
  const [commissions, setCommissions] = useState([]);
  const [Shops, setShops] = useState([]);
  const [formData, setFormData] = useState({
    shopId: "",
    commissionRate: "",
  });

  const fetchData = async () => {
    const [commissionRes, ShopRes] = await Promise.all([
      axios.get(APP_SERVER_URL + "/api/admin/commissions", {
        headers: { token: localStorage.getItem("atoken") },
      }),
      axios.get(APP_SERVER_URL + "/api/admin/shops", {
        headers: { token: localStorage.getItem("atoken") },
      }),
    ]);
    setCommissions(commissionRes.data);
    setShops(ShopRes.data.shop);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await axios.post(APP_SERVER_URL + "/api/admin/commissions", formData, {
        headers: { token: localStorage.getItem("atoken") },
      });
      fetchData();
      setFormData({ shopId: "", commissionRate: "" });
      toast.success("Commision updated");
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h2 className="text-xl font-bold mb-4">Shop Commission Management</h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow p-4 rounded mb-6 space-y-4"
      >
        <div>
          <label className="block text-sm font-medium">Select Shop</label>
          <select
            name="shopId"
            value={formData.shopId}
            onChange={(e) =>
              setFormData({ ...formData, shopId: e.target.value })
            }
            className="w-full border p-2 rounded"
            required
          >
            <option value="">-- Choose Shop --</option>
            {Shops.map((p: any) => (
              <option key={p._id} value={p._id}>
                {p.shopName || p.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">
            Commission Rate (%)
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            max="100"
            name="commissionRate"
            value={formData.commissionRate}
            onChange={(e) =>
              setFormData({ ...formData, commissionRate: e.target.value })
            }
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Commission
        </button>
      </form>

      <h3 className="text-lg font-semibold mb-2">Current Commission List</h3>
      <div className="bg-white shadow rounded p-4 space-y-2">
        {commissions.map((c: any) => (
          <div key={c._id} className="border-b pb-2 flex justify-between">
            <div>
              <div className="font-semibold">
                {c.shopId?.shopName || "Unnamed Shop"}
              </div>
              <div className="text-sm text-gray-500">
                Rate: {c.commissionRate}%
              </div>
            </div>
            <span className="text-sm text-gray-400">
              Shop ID: {c.shopId?._id}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminShopCommissionView;
