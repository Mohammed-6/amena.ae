// AdminFileUploads.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, CalendarDays, File, Loader, Eye } from "lucide-react";
import { APP_SERVER_URL } from "@/src/utils/common";
import { format } from "date-fns";
import { formatDistanceToNow } from "date-fns";
import { enGB } from "date-fns/locale";
import { toast } from "react-toastify";
import AdminPanel from "../layout/AdminPanel";

const AdminFileUploads = () => {
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
  const [uploads, setUploads] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);

    const formattedDate = format(date, "dd/MM/yyyy", { locale: enGB });
    const relativeTime = formatDistanceToNow(date, { addSuffix: true });

    return ` • ${relativeTime}`;
  };

  const fetchUploads = async () => {
    setLoading(true);
    try {
      const res = await axios.get(APP_SERVER_URL + "/api/admin/file-uploads", {
        params: {
          fromDate,
          toDate,
          page,
          limit: 3,
        },
        headers: { token: localStorage.getItem("atoken") },
      });
      setUploads(res.data.uploads);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error("Error loading uploads", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteByDate = async () => {
    if (!fromDate || !toDate) return alert("Select both dates");
    if (
      !confirm(
        `Are you sure you want to delete uploads from ${fromDate} to ${toDate}? This will delete files permanently.`
      )
    )
      return;

    try {
      await axios.delete(APP_SERVER_URL + "/api/admin/file-uploads", {
        data: { fromDate, toDate },
      });
      toast.success("Deleted successfully");
      fetchUploads();
    } catch (error) {
      toast.error("Failed to delete uploads");
    }
  };

  useEffect(() => {
    fetchUploads();
  }, [page, fromDate, toDate]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <File className="w-5 h-5" /> Uploaded Files
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="text-sm font-medium flex items-center gap-1">
            <CalendarDays className="w-4 h-4" /> From
          </label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div>
          <label className="text-sm font-medium flex items-center gap-1">
            <CalendarDays className="w-4 h-4" /> To
          </label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div className="flex items-end">
          <button
            onClick={deleteByDate}
            className="bg-red-600 text-white w-full p-2 rounded-md flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" /> Delete Range
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center text-gray-500">
          <Loader className="w-6 h-6 animate-spin mx-auto" /> Loading...
        </div>
      ) : (
        <div className="space-y-3">
          {uploads.map((file: any) => (
            <div
              key={file._id}
              className="border p-4 rounded bg-white shadow flex items-center justify-between hover:shadow-md transition"
            >
              <div className="flex items-center gap-4">
                <File className="w-6 h-6 text-blue-500" />
                <div>
                  <div className="font-semibold text-gray-800">
                    {file.originalFilename}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(file.createdAt).toLocaleString()}
                    {formatDate(file.createdAt)}
                  </div>
                </div>
              </div>
              <a
                href={`${APP_SERVER_URL}/${file.fileThumbnail}`}
                target="_blank"
                className="text-blue-600 hover:underline flex items-center gap-1"
              >
                <Eye className="w-4 h-4" /> View
              </a>
            </div>
          ))}

          {/* Pagination */}
          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
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
      )}
    </div>
  );
};

export default AdminFileUploads;
