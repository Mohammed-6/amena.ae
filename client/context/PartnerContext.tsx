import { APP_SERVER_URL } from "@/src/utils/common";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket";
import { getOrders } from "@/src/partner/query/partner";

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
  udpateAllOrders: (orders: orderType[]) => void;
};

export const PartnerContext = createContext<partnerTypes | undefined>(
  undefined
);

export const PartnerContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [allorders, setallorders] = useState<orderType[]>([]);
  const [shopId, setshopId] = useState<string | null>(null);
  const [pdfdata, setpdfdata] = useState<pdfViewType>({ url: "", show: false });

  const { orders } = useSocket("shop", shopId!);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const shopId = localStorage.getItem("shopId");
      if (shopId) {
        setshopId(shopId);
      }
      getOrders(shopId as string)
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
    setpdfdata({ url: APP_SERVER_URL + "/" + url, show: show });
  };

  const udpateAllOrders = (orders: orderType[]) => {
    setallorders(orders);
  };

  return (
    <PartnerContext.Provider
      value={{ allorders, pdfdata, controlPdf, udpateAllOrders }}
    >
      {children}
    </PartnerContext.Provider>
  );
};

export const usePartnerContext = (): partnerTypes => {
  const context = useContext(PartnerContext);
  if (!context) {
    throw new Error("useOnboardingContext must be used within a OnBoarding");
  }
  return context;
};
