// AdminPartnerPayouts.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import { APP_SERVER_URL } from "@/src/utils/common";
import AdminPanel from "../layout/AdminPanel";
import { Loader } from "lucide-react";

const AdminPartnerPayouts = () => {
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
  const [earnings, setEarnings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [shop, setShop] = useState("");
  const [status, setStatus] = useState("");
  const [shops, setShops] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchShops = async () => {
    const res = await axios.get(APP_SERVER_URL + "/api/admin/shops", {
      headers: { token: localStorage.getItem("atoken") },
    });
    setShops(res.data.shop);
  };

  const fetchEarnings = async () => {
    setLoading(true);
    const res = await axios.get(
      APP_SERVER_URL + "/api/admin/partner-earnings",
      {
        params: {
          fromDate,
          toDate,
          shopId: shop,
          status,
          page,
          limit: 10,
        },
        headers: { token: localStorage.getItem("atoken") },
      }
    );
    setEarnings(res.data.earnings);
    setTotalPages(res.data.totalPages);
    setLoading(false);
  };

  const markAsPaid = async (id: string) => {
    await axios.patch(
      APP_SERVER_URL + `/api/admin/partner-earnings/${id}/pay`,
      {},
      { headers: { token: localStorage.getItem("atoken") } }
    );
    fetchEarnings();
  };

  useEffect(() => {
    fetchShops();
  }, []);

  useEffect(() => {
    fetchEarnings();
  }, [page, shop, status]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h2 className="text-xl font-bold mb-4">Partner Earnings & Payouts</h2>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium">From Date</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">To Date</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Shop</label>
          <select
            value={shop}
            onChange={(e) => setShop(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="">All</option>
            {shops.map((s: any) => (
              <option key={s._id} value={s._id}>
                {s.shopName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
          </select>
        </div>
      </div>

      <div className="mb-4 text-right">
        <button
          onClick={() => {
            setPage(1);
            fetchEarnings();
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Apply Filters
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="p-3 text-left">Shop</th>
              <th className="p-3 text-left">Order</th>
              <th className="p-3 text-left">Total (AED)</th>
              <th className="p-3 text-left">Commission</th>
              <th className="p-3 text-left">Payable</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-4">
                  <Loader className="w-6 h-6 animate-spin mx-auto" /> Loading...
                </td>
              </tr>
            ) : earnings.length > 0 ? (
              earnings.map((e: any) => (
                <tr key={e._id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{e.shopId?.shopName || e.shopId?._id}</td>
                  <td className="p-3">#{e.orderId.orderId}</td>
                  <td className="p-3">{e.totalAmount.toFixed(2)}</td>
                  <td className="p-3">{e.commissionAmount.toFixed(2)}</td>
                  <td className="p-3">{e.payableAmount.toFixed(2)}</td>
                  <td className="p-3">
                    {e.status === "paid" ? (
                      <span className="text-green-600 font-semibold">Paid</span>
                    ) : (
                      <span className="text-yellow-600 font-semibold">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="p-3">
                    {e.status === "pending" && (
                      <button
                        onClick={() => markAsPaid(e._id)}
                        className="bg-blue-600 text-white text-xs px-3 py-1 rounded hover:bg-blue-700"
                      >
                        Mark as Paid
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center p-4">
                  No earnings found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-4 mt-6">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page <= 1}
          className="px-3 py-1 bg-gray-200 rounded"
        >
          Prev
        </button>
        <span className="text-sm">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={page >= totalPages}
          className="px-3 py-1 bg-gray-200 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AdminPartnerPayouts;
