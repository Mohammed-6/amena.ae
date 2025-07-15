import { orderType, useFileContext } from "@/context/FileUploadContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { APP_CURRENCY, APP_SERVER_URL, Preloader } from "../utils/common";
import axios from "axios";
import { toast } from "react-toastify";
import { PackageCheck, ReceiptText, Truck } from "lucide-react";

const Thankyou = () => {
  return (
    <>
      <Content />
    </>
  );
};

const Content = () => {
  const router = useRouter();
  const [orderdetails, setorderdetails] = useState<orderType>();
  const [showloader, setshowloader] = useState<boolean>(true);

  useEffect(() => {
    async function getorderDetails() {
      try {
        if (
          router.query.orderid &&
          typeof router.query.orderid === "string" &&
          router.query.orderid.trim() !== ""
        ) {
          await axios
            .get(APP_SERVER_URL + `/api/view-order/${router.query.orderid}`, {
              headers: {
                "Content-Type": "application/json",
                clientId: localStorage.getItem("clientId"),
                sessionId: localStorage.getItem("sessionId"),
              },
            })
            .then((res) => {
              //   console.log(res.data);
              // toast.success(res.data);
              setorderdetails(res.data.order);
              setshowloader(false);
            })
            .catch((error) => {
              // console.log(error);
              toast.error(error.response.data.message);
            });
        }
      } catch (error: any) {
        toast.error("Something went wrong!");
        console.error("Upload error", error);
      }
    }
    getorderDetails();
  }, [router.isReady]);
  return (
    <>
      {showloader && <Preloader />}
      <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-md text-center">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-500 text-white flex items-center justify-center rounded-full text-xl">
              ✔
            </div>
          </div>
          <h2 className="text-lg sm:text-xl font-semibold mb-2">
            Thank you for your purchase
          </h2>
          <p className="text-gray-600 text-sm mb-4">
            We've received your order and it will be shipped in 13 minutes.
          </p>
          <p className="text-gray-500 text-sm">
            Your order number is{" "}
            <span className="font-semibold uppercase">
              #{router.query.orderid}
            </span>
          </p>

          {orderdetails && (
            <div className="mt-6 border-t pt-4">
              <h3 className="text-base sm:text-lg font-semibold mb-3">
                Order Summary
              </h3>

              {/* Order details row */}
              <div className="flex justify-between items-center text-sm text-gray-600 border-b pb-2">
                <div>
                  {orderdetails.amountBreakdown.totalPages} pages,{" "}
                  {orderdetails.customization.printColor === "bw"
                    ? "Black & White"
                    : "Color"}
                  ,{" "}
                  <span className="first-letter:uppercase">
                    {orderdetails.customization.printOrientation}
                  </span>
                </div>
                <span>
                  {APP_CURRENCY}
                  {orderdetails.amountBreakdown.itemsTotal}
                </span>
              </div>

              {/* Delivery Charges */}
              <div className="flex justify-between items-center text-sm text-gray-600 mt-2">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-gray-500" />
                  <span>Delivery Charges</span>
                </div>
                <span>
                  {APP_CURRENCY}
                  {orderdetails.amountBreakdown.deliveryCharges ?? "0.00"}
                </span>
              </div>

              {/* Handling Charges */}
              <div className="flex justify-between items-center text-sm text-gray-600 mt-1">
                <div className="flex items-center gap-2">
                  <PackageCheck className="w-4 h-4 text-gray-500" />
                  <span>Handling Charges</span>
                </div>
                <span>
                  {APP_CURRENCY}
                  {orderdetails.amountBreakdown.handlingCharges ?? "0.00"}
                </span>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center font-bold text-gray-800 border-t pt-3 mt-4 text-base">
                <div className="flex items-center gap-2">
                  <ReceiptText className="w-5 h-5 text-gray-700" />
                  <span>Total</span>
                </div>
                <span>
                  {APP_CURRENCY}
                  {orderdetails.amountBreakdown.grandTotal}
                </span>
              </div>
            </div>
          )}

          <Link
            href="/"
            className="inline-block mt-6 px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-300"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </>
  );
};

export default Thankyou;
