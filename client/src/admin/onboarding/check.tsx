import React, { useEffect, useState } from "react";
import AdminPanel from "../layout/AdminPanel";
import {
  getOnboardingPartner,
  getPartnerApproved,
  getPartnerReject,
} from "../query/admin";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { onboardingTypes } from "@/context/OnboardingContext";
import { APP_SERVER_URL } from "@/src/utils/common";
import { ExternalLink } from "lucide-react";

interface PartnerDetailsProps {
  data: any;
}

const PartnerOnboardingDetails = () => {
  return (
    <>
      <AdminPanel>
        <Content />
      </AdminPanel>
    </>
  );
};
const Content = () => {
  const router = useRouter();
  const [data, setdata] = useState<onboardingTypes | undefined>(undefined);
  const [reason, setreason] = useState<string>("");

  useEffect(() => {
    // if (!router.isReady) return;
    if (localStorage.getItem("atoken") !== null) {
      getPartner();
    }
  }, [router.isReady]);

  const getPartner = () => {
    getOnboardingPartner(router.query.id as string)
      .then((res) => {
        console.log(res.data);
        if (res.data?.onboarding !== null) {
          setdata(res.data?.onboarding);
        }
      })
      .catch((error) => {
        if (error?.response.data.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Something went wrong");
        }
      });
  };

  const partnerApproved = () => {
    getPartnerApproved(router.query.id as string, reason)
      .then((res) => {
        console.log(res.data);
        if (res.data?.onboarding !== null) {
          //   setdata({...data, adminApproved: true!});
          toast.success("Partner approved!");
        }
      })
      .catch((error) => {
        if (error?.response.data.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Something went wrong");
        }
      });
  };

  const partnerReject = () => {
    getPartnerReject(router.query.id as string, reason)
      .then((res) => {
        console.log(res.data);
        if (res.data?.onboarding !== null) {
          //   setdata({...data, adminApproved: true!});
          toast.success("Partner rejected!");
        }
      })
      .catch((error) => {
        if (error?.response.data.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Something went wrong");
        }
      });
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setreason(e.target.value);
  };
  return (
    <div className="container mx-auto p-6 relative">
      <h1 className="text-2xl font-semibold mb-4">
        Partner Onboarding Details
      </h1>

      {/* Company Details */}
      <div className="bg-gray-100 p-4 rounded-lg mb-4">
        <h2 className="text-xl font-semibold mb-2">Company Details</h2>
        <p>
          <strong>Name:</strong> {data?.companyDetails.companyName}
        </p>
        <p>
          <strong>Owner:</strong> {data?.companyDetails.ownerName}
        </p>
        <p>
          <strong>Email:</strong> {data?.companyDetails.ownerEmail}
        </p>
        <p>
          <strong>Phone:</strong> {data?.companyDetails.ownerPhone}
        </p>
      </div>

      {/* Company Certificate */}
      <div className="mb-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <a
              href={`${APP_SERVER_URL}/${data?.companyDetails.tradeLicense?.path}`}
              target="__blank"
              className="bg-sky-600 px-3 rounded-lg py-2 text-md flex items-center text-white gap-x-2 w-fit"
            >
              Trade Licence
              <ExternalLink className="w-6 h-6 text-white" />
            </a>
          </div>
          <div>
            <a
              href={`${APP_SERVER_URL}/${data?.companyDetails.vatCertificate?.path}`}
              target="__blank"
              className="bg-sky-600 px-3 rounded-lg py-2 text-md flex items-center text-white gap-x-2 w-fit"
            >
              VAT Certificate
              <ExternalLink className="w-6 h-6 text-white" />
            </a>
          </div>
        </div>
      </div>

      {/* Shop Details */}
      <div className="bg-gray-100 p-4 rounded-lg mb-4">
        <h2 className="text-xl font-semibold mb-2">Shop Details</h2>
        <p>
          <strong>Name:</strong> {data?.shopDetails.shopName}
        </p>
        <p>
          <strong>Address:</strong> {data?.shopDetails.address}
        </p>
        <p>
          <strong>Phone:</strong> {data?.shopDetails.phone}
        </p>
        <p>
          <strong>Website:</strong>{" "}
          <a
            href={data?.shopDetails.website}
            className="text-blue-600 underline"
          >
            {data?.shopDetails.website}
          </a>
        </p>
        <p>
          <strong>Business Location:</strong>{" "}
          {data?.shopDetails.businessLocation}
        </p>
        <p>
          <strong>Service Area:</strong> {data?.shopDetails.serviceArea}
        </p>
      </div>

      {/* Shop Photos */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Shop Photos</h2>
        <div className="grid grid-cols-2 gap-4">
          {data?.shopDetails.shopPhotos.map((photo: any, index: number) => (
            <img
              key={index}
              src={`${APP_SERVER_URL}/${photo.path}`}
              alt="Shop"
              className="w-full h-40 object-cover rounded-lg"
            />
          ))}
        </div>
      </div>

      {/* Printer Details */}
      <div className="bg-gray-100 p-4 rounded-lg mb-4">
        <h2 className="text-xl font-semibold mb-2">Printer Details</h2>
        <p>
          <strong>Printer Name:</strong> {data?.printerDetails.printerName}
        </p>
        <p>
          <strong>Brand:</strong> {data?.printerDetails.brand}
        </p>
        <p>
          <strong>Model:</strong> {data?.printerDetails.model}
        </p>
        <p>
          <strong>Color Speed:</strong> {data?.printerDetails.colorRate} Rate
        </p>
        <p>
          <strong>B/W Speed:</strong> {data?.printerDetails.bwRate} Rate
        </p>
        <p>
          <strong>Connectivity:</strong>{" "}
          {data?.printerDetails.connectivity.join(", ")}
        </p>
      </div>

      {/* Bank Details */}
      <div className="bg-gray-100 p-4 rounded-lg mb-4">
        <h2 className="text-xl font-semibold mb-2">Bank Details</h2>
        <p>
          <strong>Bank Name:</strong> {data?.bankDetails.bankName}
        </p>
        <p>
          <strong>Account Holder:</strong> {data?.bankDetails.accountHolder}
        </p>
        <p>
          <strong>Account Number:</strong> {data?.bankDetails.accountNumber}
        </p>
        <p>
          <strong>IBAN:</strong> {data?.bankDetails.iban}
        </p>
        <p>
          <strong>Branch:</strong> {data?.bankDetails.branch}
        </p>
        <p>
          <strong>Swift Code:</strong> {data?.bankDetails.swiftCode}
        </p>
      </div>
      {!data?.adminApproved && (
        <div>
          <label className="text-sm font-bold">Reason</label>
          <textarea
            className="w-full rounded-md border border-gray-300 bg-white text-sm p-1"
            rows={3}
            onChange={handleChange}
            placeholder="Enter reason"
          ></textarea>
        </div>
      )}
      {/* Approval Buttons */}
      <div className="w-full bg-white p-4 shadow-md flex justify-between rounded-lg">
        <button
          className={`${
            data?.adminApproved ? "bg-gray-300" : "bg-green-600"
          } text-white px-6 py-2 rounded-lg`}
          onClick={partnerApproved}
          disabled={data?.adminApproved}
        >
          Approve
        </button>
        <button
          className={`${
            data?.adminApproved ? "bg-gray-300" : "bg-red-600"
          } text-white px-6 py-2 rounded-lg`}
          onClick={partnerReject}
          disabled={data?.adminApproved}
        >
          Disapprove
        </button>
      </div>
    </div>
  );
};

export default PartnerOnboardingDetails;
