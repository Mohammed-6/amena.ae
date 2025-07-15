import { useEffect, useState } from "react";
import PartnerPanel from "../layout/PartnerPanel";
import { Filter, Search, ExternalLink, FileText, Eye, X } from "lucide-react";
import { usePartnerContext } from "@/context/PartnerContext";
import { APP_CURRENCY, APP_SERVER_URL } from "@/src/utils/common";
import { format } from "date-fns";
import { formatDistanceToNow } from "date-fns";
import { enGB } from "date-fns/locale";
import PdfViewer from "./pdfViewer";
import { sendToDelivery } from "../query/partner";
import { toast } from "react-toastify";

const Orders = () => {
  return (
    <PartnerPanel>
      <OrderTable />
    </PartnerPanel>
  );
};

interface CardProps {
  title: string;
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, children }) => {
  return (
    <div className="bg-white shadow-xl rounded-2xl p-6">
      <div className="border-b border-gray-200 pb-3 mb-5 text-xl font-semibold text-gray-800">
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

  const { allorders, controlPdf, pdfdata, udpateAllOrders } =
    usePartnerContext();

  const filteredOrders: any = [];
  const closefilter = () => setshowfilter(false);

  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);

    const formattedDate = format(date, "dd/MM/yyyy", { locale: enGB });
    const relativeTime = formatDistanceToNow(date, { addSuffix: true });

    return `${formattedDate} • ${relativeTime}`;
  };

  const togglePdf = (pdf: string) => {
    controlPdf(pdf, true);
  };

  const handleSendToDelivery = async (orderId: string) => {
    try {
      await sendToDelivery(orderId);

      toast.success("Order sent to delivery!");

      // Remove from current list
      const updatedOrders = allorders.filter((o: any) => o.orderId !== orderId);
      // Update state manually if needed (depends how context works)
      udpateAllOrders(updatedOrders);
    } catch (error) {
      console.error("Delivery Error:", error);
      toast.error("Failed to send to delivery.");
    }
  };

  return (
    <Card title="Orders">
      <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute top-3.5 left-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search orders"
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl flex items-center gap-2"
          onClick={() => setshowfilter(true)}
        >
          <Filter className="w-5 h-5" /> Filter
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="min-w-full bg-white text-sm text-gray-700">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-500 uppercase text-xs">
              <th className="py-4 px-4">Order</th>
              <th className="py-4 px-4">Date</th>
              <th className="py-4 px-4">Customer</th>
              <th className="py-4 px-4">Phone</th>
              <th className="py-4 px-4">Details</th>
              <th className="py-4 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {allorders.length > 0 ? (
              allorders.map((order, i) => (
                <tr
                  key={i}
                  className="border-t border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-4 px-4 font-semibold text-gray-800 uppercase">
                    #{order.orderId}
                  </td>
                  <td className="py-4 px-4">{formatDate(order.createdAt)}</td>
                  <td className="py-4 px-4">{order.address.name}</td>
                  <td className="py-4 px-4">{order.address.phone}</td>
                  <td className="py-4 px-4">
                    {order.amountBreakdown.totalPages} pages,{" "}
                    {order.customization.printColor === "bw" ? "B&W" : "Color"},{" "}
                    {order.customization.printOrientation}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex gap-2">
                      <button
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-2 py-1 rounded flex items-center gap-1"
                        onClick={() => togglePdf(order.mergedPdf)}
                      >
                        <Eye className="w-4 h-4" /> View
                      </button>
                      <a
                        href={`${APP_SERVER_URL}/${order.mergedPdf}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded flex items-center gap-1"
                      >
                        <ExternalLink className="w-4 h-4" /> Open
                      </a>
                      <button
                        className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded flex items-center gap-1"
                        onClick={() => handleSendToDelivery(order.orderId)}
                      >
                        <FileText className="w-4 h-4" /> Send to Delivery
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="text-center p-4 text-gray-500">
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
  const { pdfdata } = usePartnerContext();
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-11/12 h-5/6 overflow-hidden">
        <PdfViewer pdfUrl={pdfdata.url} />
      </div>
    </div>
  );
};

const OrderFilterSidebar = ({ onClose }: { onClose: () => void }) => {
  const [dateRange, setDateRange] = useState("2025-03-16 ~ 2025-03-23");
  const [status, setStatus] = useState("all");
  const [paymentMethods, setPaymentMethods] = useState<string[]>([]);

  const togglePaymentMethod = (method: string) => {
    setPaymentMethods((prev) =>
      prev.includes(method)
        ? prev.filter((m) => m !== method)
        : [...prev, method]
    );
  };

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h4 className="text-xl font-semibold text-gray-800">Filter</h4>
        <button onClick={onClose} className="text-gray-400 hover:text-black">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1">Date Range</label>
          <input
            type="text"
            readOnly
            value={dateRange}
            className="w-full border p-2 rounded-md bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Order Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border p-2 rounded-md bg-gray-100"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Payment Methods
          </label>
          <div className="space-y-2">
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
        <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-md">
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default Orders;
