import { APP_SERVER_URL, APP_SOCKET_URL, makestr } from "@/src/utils/common";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket";
import axios from "axios";
import { getOrders } from "@/src/admin/query/admin";

interface orderType {
  orderId: string;
  user: string;
  sessionId: string;
  address: { name: string; phone: number; area: string };
  customization: {
    noCopies: number;
    printColor: string;
    printOrientation: string;
    deliveryAddress: string;
  };
  grandAmount: number;
  amountBreakdown: {
    pricePerPage: number;
    totalPages: number;
    itemsTotal: number;
    deliveryCharges: number;
    handlingCharges: number;
    grandTotal: number;
  };
  shopId: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
  orderStatus: string;
  mergedPdf: string;
}

type pdfViewType = {
  url: string;
  show: boolean;
};

type partnerTypes = {
  allorders: orderType[];
  pdfdata: pdfViewType;
  controlPdf: (url: string, show: boolean) => void;
};

export const AdminContext = createContext<partnerTypes | undefined>(undefined);

export const AdminContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [allorders, setallorders] = useState<orderType[]>([]);
  const [shopId, setshopId] = useState<string | null>(null);
  const [pdfdata, setpdfdata] = useState<pdfViewType>({ url: "", show: false });

  const { orders } = useSocket("admin");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const shopId = localStorage.getItem("shopId");
      if (shopId) {
        setshopId(shopId);
      }
      getOrders()
        .then((res) => {
          setallorders(res.data.order);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);

  useEffect(() => {
    // console.log("Received orders:", orders); // Debugging
    if (orders?.length > 0) {
      setallorders((prevOrders) => {
        const newOrders = orders.filter(
          (order) => !prevOrders.some((o) => o._id === order._id)
        );
        return [...newOrders, ...prevOrders];
      });
    }
    console.log(allorders);
  }, [orders]);

  const controlPdf = (url: string, show: boolean) => {
    setpdfdata({ url: APP_SOCKET_URL + "/" + url, show: show });
  };

  return (
    <AdminContext.Provider value={{ allorders, pdfdata, controlPdf }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdminContext = (): partnerTypes => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdminContext must be used within a Admin");
  }
  return context;
};
