import { APP_SOCKET_URL } from "@/src/utils/common";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = APP_SOCKET_URL;

export const useSocket = (userType: "shop" | "admin", shopId?: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const newSocket = io(SOCKET_URL);

    newSocket.on("connect", () => {
      console.log("Connected to server");
      if (userType === "shop" && shopId) {
        newSocket.emit("registerShop", shopId);
      } else if (userType === "admin") {
        newSocket.emit("registerAdmin");
      }
    });

    newSocket.on("orderReceived", (order) => {
      console.log("New order received:", order);
      setOrders((prevOrders) => [order, ...prevOrders]);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [userType, shopId]);

  return { socket, orders };
};
