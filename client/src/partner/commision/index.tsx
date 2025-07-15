// PartnerCommissionList.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import { APP_SERVER_URL } from "@/src/utils/common";
import PartnerPanel from "../layout/PartnerPanel";

const PartnerCommissionList = () => {
  return (
    <PartnerPanel>
      <Content />
    </PartnerPanel>
  );
};

const Content = () => {
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCommissions = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        APP_SERVER_URL + "/api/v1/partner/commisions",
        {
          params: { fromDate, toDate, status, page, limit: 10 },
          headers: { token: localStorage.getItem("atoken") },
        }
      );
      //   console.log(res);
      setCommissions(res.data.commissions);
      setTotalPages(res.data.totalPages);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCommissions();
  }, [page, fromDate, toDate, status]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h2 className="text-xl font-bold mb-4">Commission Summary</h2>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="border p-2 rounded"
          placeholder="From Date"
        />
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className="border p-2 rounded"
          placeholder="To Date"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Status</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
        </select>
        <button
          onClick={() => {
            setPage(1);
            fetchCommissions();
          }}
          className="bg-blue-600 text-white rounded px-4 py-2"
        >
          Apply Filters
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow rounded">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="p-3 text-left">Shop</th>
              <th className="p-3 text-left">Order</th>
              <th className="p-3 text-left">Total (AED)</th>
              <th className="p-3 text-left">Commission</th>
              <th className="p-3 text-left">Payable</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center p-4">
                  Loading...
                </td>
              </tr>
            ) : commissions.length ? (
              commissions.map((e: any) => (
                <tr key={e._id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{e.shopId?.shopName || e.shopId?._id}</td>
                  <td className="p-3 uppercase">#{e.orderId.orderId}</td>
                  <td className="p-3 text-blue-500">
                    {e.totalAmount.toFixed(2)}
                  </td>
                  <td className="p-3 text-red-500">
                    -{e.commissionAmount.toFixed(2)}
                  </td>
                  <td className="p-3 text-green-500">
                    {e.payableAmount.toFixed(2)}
                  </td>
                  <td className="p-3 capitalize font-medium text-gray-700">
                    {e.status}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center p-4 text-gray-500">
                  No commission records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-6">
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

export default PartnerCommissionList;
