import {
  OnboardingContextProvider,
  useOnboardingContext,
} from "@/context/OnboardingContext";
import { useEffect, useState } from "react";
import ShopRegistrationForm from "./officeShop";
import PrinterDetailsForm from "./printerDetails";
import PaymentPage from "./paymentPage";
import PendingApproval from "./pendingApproval";
import BankDetailsForm from "./bankDetails";
import { Preloader } from "@/src/utils/common";
import RejectionInfo from "./rejectionInfo";
import { LogOut } from "lucide-react";
import { useRouter } from "next/router";

const OnBoarding = () => {
  return (
    <>
      <div className="">
        <OnboardingContextProvider>
          <PreBoarding />
        </OnboardingContextProvider>
      </div>
    </>
  );
};

const Header = () => {
  const router = useRouter();

  useEffect(() => {
    if (
      typeof window !== undefined &&
      localStorage.getItem("partnerId") === null
    ) {
      router.push("/partner/login");
    }
  }, []);
  const logout = () => {
    if (typeof window !== undefined) {
      localStorage.removeItem("partnerId");
      router.push("/partner/login");
    }
  };
  return (
    <div className="bg-white shadow-md p-4 flex justify-between items-center  w-full">
      <div>
        <img src="/logo.svg" className="w-16" />
      </div>
      <div className="flex space-x-4 items-center" title="Logout">
        <LogOut className="w-5 h-5 cursor-pointer" onClick={logout} />
      </div>
    </div>
  );
};

const PreBoarding = () => {
  const { loading } = useOnboardingContext();
  return <>{!loading && <Content />} </>;
};

const Content = () => {
  const {
    viewcompany,
    viewshop,
    viewprinter,
    viewpayment,
    viewpending,
    viewbank,
    loading,
    onboarding,
    viewreject,
  } = useOnboardingContext();

  useEffect(() => {
    console.log(onboarding);
  }, []);

  const renderContent = () => {
    if (onboarding.applicationStatus === "pending" && onboarding.formSubmit) {
      return <PendingApproval />;
    }

    if (onboarding.applicationStatus === "rejected" && onboarding.formSubmit) {
      return <RejectionInfo />;
    }

    return (
      <>
        {viewcompany && <OnboardingForm />}
        {viewshop && <ShopRegistrationForm />}
        {viewprinter && <PrinterDetailsForm />}
        {viewpayment && <PaymentPage />}
        {viewbank && <BankDetailsForm />}
      </>
    );
  };

  return (
    <>
      {loading && <Preloader />}
      <Header />
      {renderContent()}
    </>
  );
};

const OnboardingForm: React.FC = () => {
  const {
    updateCompanyDetails,
    onboarding,
    submitCompanyDetails,
    handleSingleUpload,
  } = useOnboardingContext();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    updateCompanyDetails(name, type === "checkbox" ? checked : value);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      const image: any = await handleSingleUpload(files[0]);
      if (image) {
        // console.log(name, image);
        updateCompanyDetails(name, image);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitCompanyDetails();
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 gradient-bg">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-semibold text-center mb-4">
          Partner Onboarding
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">
              Company Name <span className="text-red-500 text-xs">*</span>
            </label>
            <input
              type="text"
              name="companyName"
              value={onboarding.companyDetails.companyName}
              onChange={handleChange}
              className="mt-1 w-full border px-3 py-2 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">
              Trade License <span className="text-red-500 text-xs">*</span>
            </label>
            <input
              type="file"
              name="tradeLicense"
              onChange={handleFileChange}
              className="w-full p-1 border rounded-md mb-4 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-white file:bg-blue-500 hover:file:bg-blue-600"
              required={!onboarding.companyDetails.tradeLicense}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">
              Owner Name <span className="text-red-500 text-xs">*</span>
            </label>
            <input
              type="text"
              name="ownerName"
              value={onboarding.companyDetails.ownerName}
              onChange={handleChange}
              className="mt-1 w-full border px-3 py-2 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">
              Owner Email <span className="text-red-500 text-xs">*</span>
            </label>
            <input
              type="email"
              name="ownerEmail"
              value={onboarding.companyDetails.ownerEmail}
              onChange={handleChange}
              className="mt-1 w-full border px-3 py-2 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">
              Owner Phone <span className="text-red-500 text-xs">*</span>
            </label>
            <input
              type="tel"
              name="ownerPhone"
              value={onboarding.companyDetails.ownerPhone}
              onChange={handleChange}
              className="mt-1 w-full border px-3 py-2 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">
              VAT Certificate <span className="text-red-500 text-xs">*</span>
            </label>
            <input
              type="file"
              name="vatCertificate"
              onChange={handleFileChange}
              className="w-full p-1 border rounded-md mb-4 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-white file:bg-blue-500 hover:file:bg-blue-600"
              required={!onboarding.companyDetails.vatCertificate}
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              name="agreementAccepted"
              checked={onboarding.companyDetails.agreementAccepted}
              onChange={handleChange}
              className="mr-2"
              required
            />
            <label className="text-sm">I accept the terms and conditions</label>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default OnBoarding;
