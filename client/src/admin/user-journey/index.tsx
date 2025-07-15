// React: AdminUserJourney.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import { CalendarDays, BarChart3 } from "lucide-react";
import { APP_SERVER_URL } from "@/src/utils/common";
import AdminPanel from "../layout/AdminPanel";
import { formatDate } from "../orders";

const AdminUserJourney = () => {
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
  const [stats, setStats] = useState({ today: 0, week: 0, month: 0, year: 0 });
  const [journeys, setJourneys] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = async () => {
    const res = await axios.get(APP_SERVER_URL + "/api/admin/user-journey", {
      params: { page, limit: 10 },
      headers: { token: localStorage.getItem("atoken") },
    });
    setStats(res.data.stats);
    setJourneys(res.data.journeys);
    setTotalPages(res.data.totalPages);
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <BarChart3 className="w-5 h-5" /> User Journey Stats
      </h2>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Today" value={stats.today} />
        <StatCard label="This Week" value={stats.week} />
        <StatCard label="This Month" value={stats.month} />
        <StatCard label="This Year" value={stats.year} />
      </div>

      {/* Table */}
      {/* Card View */}
      <div className="grid md:grid-cols-2 gap-4">
        {journeys.map((j: any) => (
          <div
            key={j._id}
            className="bg-white p-4 rounded shadow-sm hover:shadow-md transition"
          >
            <div className="text-sm text-gray-600 mb-2">
              <span className="font-medium text-blue-600">IP:</span> {j.ip}
            </div>
            <div className="text-sm text-gray-600 mb-1">
              <span className="font-medium">Path:</span> {j.pathname}
            </div>
            <div className="text-sm text-gray-500 line-clamp-2 max-w-xl mb-1">
              <span className="font-medium">User Agent:</span> {j.userAgent}
            </div>
            <div className="text-xs text-gray-400">
              <span className="font-medium">Visited:</span>{" "}
              {formatDate(j.timestamp)}
            </div>
          </div>
        ))}
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

const StatCard = ({ label, value }: { label: string; value: number }) => (
  <div className="bg-white p-4 rounded shadow text-center">
    <div className="text-2xl font-bold text-blue-600">{value}</div>
    <div className="text-sm text-gray-600 mt-1">{label}</div>
  </div>
);

export default AdminUserJourney;
