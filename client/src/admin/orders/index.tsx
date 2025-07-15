import { useEffect, useState } from "react";
import {
  Binoculars,
  FileText,
  Filter,
  MapPin,
  Phone,
  Search,
  User,
} from "lucide-react";
import { useAdminContext } from "@/context/AdminContext";
import { APP_CURRENCY, APP_SERVER_URL } from "@/src/utils/common";
import PdfViewer from "./pdfViewer";
import AdminPanel from "../layout/AdminPanel";
import { format } from "date-fns";
import { formatDistanceToNow } from "date-fns";
import { enGB } from "date-fns/locale";
import { toast } from "react-toastify";

export const formatDate = (isoDate: string) => {
  const date = new Date(isoDate);

  const formattedDate = format(date, "dd/MM/yyyy", { locale: enGB });
  const relativeTime = formatDistanceToNow(date, { addSuffix: true });

  return ` • ${relativeTime}`;
};

const Orders = () => {
  return (
    <>
      <AdminPanel>
        {/* <OrderTable /> */}
        <AdminOrders />
      </AdminPanel>
    </>
  );
};

interface CardProps {
  title: string;
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, children }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-4">
      <div className="border-b border-gray-100 pb-2 mb-4 font-semibold text-lg">
        {title}
      </div>
      <div>{children}</div>
    </div>
  );
};

const OrderTable: React.FC = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [showfilter, setshowfilter] = useState<boolean>(false);

  const { allorders, controlPdf, pdfdata } = useAdminContext();

  //   const filteredOrders = orders.filter((order) => {
  //     return (
  //       (search === "" ||
  //         order.details.toLowerCase().includes(search.toLowerCase())) &&
  //       (status === "" || order.status === status) &&
  //       (fromDate === "" || new Date(order.date) >= new Date(fromDate)) &&
  //       (toDate === "" || new Date(order.date) <= new Date(toDate))
  //     );
  //   });
  const filteredOrders: any = [];
  const closefilter = () => {
    setshowfilter(false);
  };
  const formatDate = (isoDate: string) => {
    return new Date(isoDate).toLocaleDateString("en-GB"); // "10/08/2022"
  };

  const tooglePdf = (pdf: string) => {
    controlPdf(pdf, true);
  };

  return (
    <Card title="Orders">
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <span className="w-full flex relative">
            <input
              className="border border-gray-200 px-2 rounded-xl input-md h-12 focus:ring-primary focus-within:ring-primary focus-within:border-primary focus:border-primary"
              placeholder="Search"
              type="text"
            />
          </span>
          <button
            className="text-white bg-slate-600 px-3 py-2.5 rounded-xl"
            onClick={() => setshowfilter(true)}
          >
            <span className="flex gap-1 items-center justify-center">
              <span className="text-lg">
                <Filter className="w-6 h-6" />
              </span>
              <span>Filter</span>
            </span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b-2 border-gray-100 text-gray-400 text-sm font-semibold">
              <th className="py-4">Order</th>
              <th className="py-4">Date</th>
              <th className="py-4">Customer</th>
              <th className="py-4">Phone</th>
              <th className="py-4">Area</th>
              <th className="py-4">Status</th>
              <th className="py-4">Total</th>
              <th className="py-4">Order Details</th>
              <th className="py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {allorders.length > 0 ? (
              allorders.map((order, i) => (
                <tr key={i} className="text-center text-sm text-gray-500">
                  <td className="border-b-2 border-gray-100 py-4">
                    <div className="uppercase font-bold text-black">
                      #{order.orderId}
                    </div>
                  </td>
                  <td className="border-b-2 border-gray-100 py-4">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="border-b-2 border-gray-100 py-4">
                    {order.address.name}
                  </td>
                  <td className="border-b-2 border-gray-100 py-4">
                    {order.address.phone}
                  </td>
                  <td className="border-b-2 border-gray-100 py-4">
                    {order.address.area}
                  </td>
                  <td className="border-b-2 border-gray-100 py-4">
                    {order.orderStatus}
                  </td>
                  <td className="border-b-2 border-gray-100 py-4 font-bold text-black">
                    {APP_CURRENCY}
                    {order.amountBreakdown.grandTotal}
                  </td>
                  <td className="border-b-2 border-gray-100 py-4">
                    {order.amountBreakdown.totalPages} pages,{" "}
                    {order.customization.printColor === "bw"
                      ? "Black & White"
                      : "Color"}
                    ,{""}&nbsp;
                    <span className="first-letter:uppercase">
                      {order.customization.printOrientation}
                    </span>
                  </td>
                  <td className="border-b-2 border-gray-100 py-4">
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                      onClick={() => tooglePdf(order.mergedPdf)}
                    >
                      View
                    </button>
                    <button className="bg-red-500 text-white px-2 py-1 rounded">
                      Cancel
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center p-4 text-gray-500">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {showfilter && <OrderFilterSidebar onClose={closefilter} />}
      {pdfdata.show && <ViewPDF />}
    </Card>
  );
};

const ViewPDF = () => {
  const { pdfdata } = useAdminContext();
  return (
    <>
      <div className="fixed inset-0 bg-black/50">
        <div className="w-xl">
          <PdfViewer pdfUrl={pdfdata.url} />
        </div>
      </div>
    </>
  );
};

const OrderFilterSidebar = ({ onClose }: { onClose: () => void }) => {
  const [dateRange, setDateRange] = useState("2025-03-16 ~ 2025-03-23");
  const [status, setStatus] = useState("all");
  const [paymentMethods, setPaymentMethods] = useState<string[]>([
    "Credit card",
    "Debit card",
    "Paypal",
    "Stripe",
    "Cash",
  ]);

  const togglePaymentMethod = (method: string) => {
    setPaymentMethods((prev) =>
      prev.includes(method)
        ? prev.filter((m) => m !== method)
        : [...prev, method]
    );
  };

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-lg p-6 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-semibold">Filter</h4>
        <button onClick={onClose} className="text-gray-500 hover:text-black">
          &times;
        </button>
      </div>
      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Product price
          </label>
          <input
            type="text"
            readOnly
            value={dateRange}
            className="w-full border p-2 rounded-md bg-gray-100 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            Product status
          </label>
          <select
            className="w-full border p-2 rounded-md bg-gray-100"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Product type</label>
          <div className="flex flex-col gap-2">
            {["Credit card", "Debit card", "Paypal", "Stripe", "Cash"].map(
              (method) => (
                <label key={method} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={paymentMethods.includes(method)}
                    onChange={() => togglePaymentMethod(method)}
                    className="mr-2"
                  />
                  {method}
                </label>
              )
            )}
          </div>
        </div>
      </div>
      <button className="mt-6 bg-blue-500 text-white p-3 rounded-md w-full hover:bg-blue-600">
        Query
      </button>
    </div>
  );
};

export default Orders;

// React Component: AdminOrders.tsx
import axios from "axios";
import {
  CalendarDays,
  Store,
  Receipt,
  Loader,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import axiosInstance from "../query/axiosInstance";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [shops, setShops] = useState([]);
  const [shopId, setShopId] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.post(
        "/api/admin/get-orders",
        {},
        {
          params: {
            shopId,
            fromDate,
            toDate,
            customerName,
            page,
          },
          headers: { token: localStorage.getItem("atoken") },
        }
      );
      setOrders(res.data.orders);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error("Failed to load orders", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchShops = async () => {
    try {
      const res = await axiosInstance.get("/api/admin/shops", {
        headers: { token: localStorage.getItem("atoken") },
      });
      setShops(res.data.shop);
    } catch (err) {
      console.error("Failed to load shops");
    }
  };

  useEffect(() => {
    fetchShops();
    fetchOrders();
  }, [shopId, fromDate, toDate, customerName, page]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Receipt className="w-5 h-5" /> Admin Orders
      </h2>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="text-sm font-medium flex items-center gap-1">
            <Store className="w-4 h-4" /> Shop
          </label>
          <select
            value={shopId}
            onChange={(e) => setShopId(e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            <option value="">All Shops</option>
            {shops.map((shop: any) => (
              <option key={shop._id} value={shop._id}>
                {shop.shopName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium flex items-center gap-1">
            <CalendarDays className="w-4 h-4" /> From Date
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
            <CalendarDays className="w-4 h-4" /> To Date
          </label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div>
          <label className="text-sm font-medium flex items-center gap-1">
            <User className="w-4 h-4" /> Customer Detail
          </label>
          <input
            type="text"
            placeholder="Name | Area | Address Line"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div className="flex items-end">
          <button
            onClick={fetchOrders}
            className="bg-blue-600 text-white w-full p-2 rounded-md flex items-center justify-center gap-2"
          >
            <Filter className="w-4 h-4" /> Apply Filters
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center text-gray-500">
          <Loader className="w-6 h-6 animate-spin mx-auto" /> Loading orders...
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order: any) => (
            <div
              key={order._id}
              className="border rounded-md p-4 bg-white shadow-sm"
            >
              <div className="flex justify-between text-sm">
                <span className="uppercase font-bold">
                  Order ID: {order.orderId}
                </span>
                <span>
                  {new Date(order.createdAt).toLocaleString()}
                  {formatDate(order.createdAt)}
                </span>
              </div>
              <div className="text-gray-700 mt-1">
                {order.amountBreakdown.totalPages} pages -{" "}
                {order.customization.printColor} - {order.orderStatus}
              </div>
              <div className="mt-1 text-sm text-gray-500">
                <b>Shop:</b> {order.shop?.shopName ?? "-"} | <b>Area:</b>{" "}
                {order.shop?.serviceArea ?? "-"} | <b>Phone:</b>{" "}
                {order.shop?.phone ?? "-"}
              </div>
              <div className="mt-1 text-sm text-gray-500 flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />{" "}
                  {order.address?.name ?? "-"}
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />{" "}
                  {order.address?.phone ?? "-"}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />{" "}
                  {order.address?.area ?? "-"}
                </div>
              </div>
              <div className="font-semibold text-right mt-1">
                AED {order.amountBreakdown.grandTotal.toFixed(2)}
              </div>
              {order.mergedPdf && (
                <div className="mt-2 text-sm flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-500" />
                  <a
                    href={`${APP_SERVER_URL}/${order.mergedPdf}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    View Attachment
                  </a>
                </div>
              )}
            </div>
          ))}

          {/* Pagination */}
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              className="p-2 bg-gray-100 rounded disabled:opacity-50"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <span className="text-sm">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="p-2 bg-gray-100 rounded disabled:opacity-50"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
