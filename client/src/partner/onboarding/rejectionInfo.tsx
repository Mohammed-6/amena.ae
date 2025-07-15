import { useOnboardingContext } from "@/context/OnboardingContext";
import React from "react";

interface RejectionInfoProps {
  partnerName: string;
  companyName: string;
  shopName: string;
  rejectionReason: string;
  resubmitLink: string;
}

const RejectionInfo = () => {
  const { onboarding, resubmitApplication } = useOnboardingContext();
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-lg w-full">
        <h2 className="text-2xl font-semibold text-red-600 flex items-center">
          ❌ Application Rejected
        </h2>
        <p className="mt-2 text-gray-700">
          Dear <strong>{onboarding.companyDetails.ownerName}</strong>, your
          onboarding application has been rejected due to the following reason:
        </p>
        <div className="bg-red-100 text-red-700 p-3 rounded-md mt-3">
          <strong>Reason:</strong> {onboarding.adminApprovedDescription}
        </div>
        <div className="mt-4 text-gray-700">
          <p>
            <strong>Company Name:</strong>{" "}
            {onboarding.companyDetails.companyName}
          </p>
          <p>
            <strong>Shop Name:</strong> {onboarding.shopDetails.shopName}
          </p>
        </div>

        <div className="mt-6">
          <p className="text-gray-600">
            Please update your details and resubmit your request using the
            button below.
          </p>
          <button
            onClick={resubmitApplication}
            className="mt-4 block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition hover:cursor-pointer"
          >
            Resubmit Application
          </button>
        </div>

        <div className="mt-6 text-sm text-gray-500">
          Need help? Contact our{" "}
          <a href="mailto:support@paperplane.ae" className="text-blue-600">
            support team
          </a>
          .
        </div>
      </div>
    </div>
  );
};

export default RejectionInfo;
