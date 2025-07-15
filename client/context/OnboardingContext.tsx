import {
  getOnboarding,
  submitOnboard,
  uploadMultiple,
  uploadSingle,
} from "@/src/partner/query/partner";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

interface companyDetailsType {
  companyName: string;
  tradeLicense: any;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  vatCertificate: any;
  agreementAccepted: false;
}

type OpeningHours = {
  [key: string]: { open: string; close: string };
};

export interface shopDetailsType {
  shopName: string;
  shopPhotos: [];
  address: string;
  location: any;
  phone: number | null;
  openingDate: string;
  website: string;
  businessLocation: string;
  serviceArea: string;
  openingHours: OpeningHours;
}

export interface printerDetailsType {
  printerName: string;
  brand: string;
  model: string;
  colorRate: string;
  bwRate: string;
  paperSize: string;
  connectivity: string[];
}
interface bankDetailsType {
  bankName: string;
  accountHolder: string;
  accountNumber: string;
  iban: string;
  branch: string;
  swiftCode: string;
}

export interface onboardingTypes {
  _id?: string;
  companyDetails: companyDetailsType;
  shopDetails: shopDetailsType;
  printerDetails: printerDetailsType;
  bankDetails: bankDetailsType;
  companyDetailsSubmit: boolean;
  shopDetailsSubmit: boolean;
  printerDetailsSubmit: boolean;
  bankDetailsSubmit: boolean;
  paymentSubmit: boolean;
  formSubmit: boolean;
  adminApproved: boolean;
  adminApprovedDescription: string;
  agentId: string;
  partnerId: string;
  resubmit: boolean;
  applicationStatus: string;
}

interface OnboardingType {
  onboarding: onboardingTypes;
  updateCompanyDetails: (name: string, value: any) => void;
  submitCompanyDetails: () => void;
  toogleCompany: () => void;
  toogleShop: () => void;
  viewcompany: boolean;
  viewshop: boolean;
  submitShopDetails: (sd: shopDetailsType) => void;
  tooglePrinter: () => void;
  viewprinter: boolean;
  updatePrinterDetails: (name: string, balue: any) => void;
  submitPrinterDetails: () => void;
  viewpayment: boolean;
  tooglePayment: () => void;
  viewpending: boolean;
  tooglePending: () => void;
  updateShopDetails: (name: string, value: any) => void;
  toogleBank: () => void;
  viewbank: boolean;
  updateBankDetails: (name: string, value: any) => void;
  submitBankDetails: () => void;
  submitPayment: () => void;
  handleSingleUpload: (file: File) => void;
  loading: boolean;
  handleMultipleUpload: (file: File[]) => void;
  viewreject: boolean;
  toogleReject: () => void;
  resubmitApplication: () => void;
}

export const OnboardingContext = createContext<OnboardingType | undefined>(
  undefined
);

export const OnboardingContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [onboarding, setonboarding] = useState<onboardingTypes>({
    companyDetails: {
      companyName: "",
      tradeLicense: "",
      ownerName: "",
      ownerEmail: "",
      ownerPhone: "",
      vatCertificate: "",
      agreementAccepted: false,
    },
    shopDetails: {
      shopName: "",
      shopPhotos: [],
      address: "",
      location: { type: "Point", coordinates: [25.1808005, 55.2603772] },
      phone: null,
      openingDate: "",
      website: "",
      businessLocation: "",
      serviceArea: "",
      openingHours: {},
    },
    printerDetails: {
      printerName: "",
      brand: "",
      model: "",
      colorRate: "",
      bwRate: "",
      paperSize: "",
      connectivity: [] as string[],
    },
    bankDetails: {
      bankName: "",
      accountHolder: "",
      accountNumber: "",
      iban: "",
      branch: "",
      swiftCode: "",
    },
    companyDetailsSubmit: false,
    shopDetailsSubmit: false,
    printerDetailsSubmit: false,
    bankDetailsSubmit: false,
    paymentSubmit: false,
    formSubmit: false,
    partnerId: "",
    adminApproved: false,
    adminApprovedDescription: "",
    agentId: "",
    resubmit: false,
    applicationStatus: "pending",
  });
  const [viewcompany, setviewcompany] = useState<boolean>(false);
  const [viewshop, setviewshop] = useState<boolean>(false);
  const [viewprinter, setviewprinter] = useState<boolean>(false);
  const [viewpayment, setviewpayment] = useState<boolean>(false);
  const [viewpending, setviewpending] = useState<boolean>(false);
  const [viewbank, setviewbank] = useState<boolean>(false);
  const [viewreject, setviewreject] = useState<boolean>(false);
  const [loading, setloading] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setonboarding({
        ...onboarding,
        partnerId: localStorage.getItem("partnerId")!,
      });
      if (localStorage.getItem("partnerId") !== null) {
        startUp(localStorage.getItem("partnerId")!);
      }
    }
  }, []);

  async function startUp(partnerId: string) {
    if (partnerId !== null || partnerId !== "") {
      try {
        setloading(true);
        await getOnboarding(partnerId)
          .then((res) => {
            // toast.success(res.data.message);
            if (res.data.onboarding !== null) {
              const dd = res.data.onboarding;
              setonboarding(dd);
              //   if (!dd.adminApproved) {
              //     setviewcompany(false);
              //     setviewreject(true);
              //   }
              if (!dd.formSubmit && dd.applicationStatus === "pending") {
                setviewcompany(true);
              }
            } else {
              setviewcompany(true);
            }

            setloading(false);
          })
          .catch((error) => {
            // toast.error("Some error occured!");
          });
      } catch (error) {
        toast.error("Something went wrong!");
        setloading(false);
      } finally {
        setloading(false);
      }
    }
  }

  const handleSingleUpload = async (file: File) => {
    if (!file) {
      //   toast.error("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("attachment", file); // Ensure this matches backend key

    try {
      setloading(true);
      const response = await uploadSingle(formData);

      toast.success("File uploaded successfully!");
      console.log("Uploaded File:", response.data);
      return response.data.image;
    } catch (error) {
      toast.error("Upload failed. Please try again.");
      console.error("Upload Error:", error);

      return null;
    } finally {
      setloading(false);
    }
  };

  const handleMultipleUpload = async (files: File[]) => {
    if (files.length === 0) {
      // alert("Please select files to upload.");
      return;
    }

    const formData = new FormData();
    files.forEach((file) => formData.append("attachment", file));

    try {
      setloading(true);
      const response = await uploadMultiple(formData);
      toast.success("Files uploaded successfully!");
      console.log("Upload response:", response.data);
      return response.data.image;
    } catch (error) {
      console.error("Upload Error:", error);
      toast.error("Upload failed. Please try again.");
      return null;
    } finally {
      setloading(false);
    }
  };

  const submitOnboarding = async (data: onboardingTypes) => {
    try {
      const tempData = data;
      if (tempData.partnerId) {
        tempData.partnerId = localStorage.getItem("partnerId")!;
      }
      delete (tempData as any).agentId;
      delete (tempData as any).adminApproved;
      return await submitOnboard(tempData)
        .then((res) => {
          setonboarding(tempData);
          toast.success(res.data.message);
          return true;
        })
        .catch((error) => {
          toast.error("Some error occured!");
          return false;
        });
    } catch (error) {
      toast.error("Something went wrong!");
      return false;
    }
  };

  const updateCompanyDetails = (name: string, value: any) => {
    setonboarding({
      ...onboarding,
      companyDetails: { ...onboarding.companyDetails, [name]: value },
    });
  };

  const submitCompanyDetails = async () => {
    if (!isCDFormValid()) {
      //   console.log(onboarding);
      toast.error("All fields are required");
      return;
    }
    const temp: onboardingTypes = { ...onboarding, companyDetailsSubmit: true };
    await submitOnboarding(temp);
    toogleCompany();
    toogleShop();
  };

  const isCDFormValid = () => {
    const {
      companyName,
      tradeLicense,
      ownerName,
      ownerEmail,
      ownerPhone,
      vatCertificate,
      agreementAccepted,
    } = onboarding.companyDetails;
    return (
      companyName &&
      tradeLicense &&
      ownerName &&
      ownerEmail &&
      ownerPhone &&
      vatCertificate &&
      agreementAccepted
    );
  };

  const submitShopDetails = async (sd: shopDetailsType) => {
    // setonboarding({ ...onboarding, shopDetails: sd });
    const isAnyFieldEmpty = Object.entries(onboarding.shopDetails).some(
      ([key, value]) =>
        (Array.isArray(value) && value.length === 0) || // Check if shopPhotos array is empty
        (typeof value === "string" && value.trim() === "") || // Check if number fields are empty
        (typeof value === "number" && value === null) // Check if string fields are empty
    );
    if (isAnyFieldEmpty) {
      toast.error("All fields are required");
      return;
    }
    const temp: onboardingTypes = { ...onboarding, shopDetailsSubmit: true };
    await submitOnboarding(temp);
    toogleShop();
    tooglePrinter();
  };

  const toogleCompany = () => {
    setviewcompany(!viewcompany);
  };

  const toogleShop = () => {
    setviewshop(!viewshop);
  };

  const updateShopDetails = (name: string, value: any) => {
    setonboarding({
      ...onboarding,
      shopDetails: { ...onboarding.shopDetails, [name]: value },
    });
  };

  const tooglePrinter = () => {
    setviewprinter(!viewprinter);
  };

  const updatePrinterDetails = (name: string, value: any) => {
    setonboarding({
      ...onboarding,
      printerDetails: { ...onboarding.printerDetails, [name]: value },
    });
  };

  const submitPrinterDetails = async () => {
    if (!isPDFormValid()) {
      toast.error("All fields are required");
      return;
    }

    const { colorRate, bwRate } = onboarding.printerDetails;

    // Check if rates are valid decimals (and not negative)
    if (
      isNaN(Number(colorRate)) ||
      isNaN(Number(bwRate)) ||
      Number(colorRate) <= 0 ||
      Number(bwRate) <= 0
    ) {
      toast.error("Print rates must be valid positive decimal numbers (AED)");
      return;
    }

    const temp: onboardingTypes = {
      ...onboarding,
      printerDetailsSubmit: true,
    };

    await submitOnboarding(temp);
    tooglePrinter();
    toogleBank();
  };

  const isPDFormValid = () => {
    return !Object.values(onboarding.printerDetails).some(
      (value) => value === "" || (Array.isArray(value) && value.length === 0)
    );
  };

  const tooglePayment = async () => {
    if (
      onboarding.applicationStatus === "pending" ||
      onboarding.applicationStatus === "rejected"
    ) {
      await submitOnboarding({
        ...onboarding,
        paymentSubmit: true,
        applicationStatus: "pending",
        formSubmit: true,
      });
      setviewpayment(false);
      setviewpending(true);
    } else {
      setviewpayment(!viewpayment);
    }
  };

  const tooglePending = () => {
    setviewpending(!viewpending);
  };

  const toogleBank = () => {
    setviewbank(!viewbank);
  };

  const updateBankDetails = (name: string, value: any) => {
    setonboarding({
      ...onboarding,
      bankDetails: { ...onboarding.bankDetails, [name]: value },
    });
  };

  const submitBankDetails = async () => {
    const isAnyFieldEmpty = Object.entries(onboarding.bankDetails).some(
      ([key, value]) =>
        (typeof value === "string" && value.trim() === "") || // Check if number fields are empty
        (typeof value === "number" && value === null) // Check if string fields are empty
    );
    if (isAnyFieldEmpty) {
      toast.error("All fields are required");
      return;
    }
    const temp: onboardingTypes = {
      ...onboarding,
      bankDetailsSubmit: true,
      applicationStatus: "pending",
    };
    await submitOnboarding(temp);
    toogleBank();
    tooglePayment();
  };

  const submitPayment = async () => {
    await submitOnboarding({
      ...onboarding,
      paymentSubmit: true,
      formSubmit: true,
    });
    tooglePayment();
    tooglePending();
  };

  const toogleReject = () => {
    setviewreject(!viewreject);
  };

  const resubmitApplication = () => {
    setviewreject(false);
    setviewcompany(true);
    setonboarding({
      ...onboarding,
      companyDetailsSubmit: true,
      shopDetailsSubmit: true,
      printerDetailsSubmit: true,
      bankDetailsSubmit: true,
      resubmit: true,
      formSubmit: false,
      adminApproved: false,
      applicationStatus: "pending",
    });
  };

  return (
    <OnboardingContext.Provider
      value={{
        onboarding,
        updateCompanyDetails,
        submitCompanyDetails,
        toogleCompany,
        toogleShop,
        viewcompany,
        viewshop,
        submitShopDetails,
        viewprinter,
        tooglePrinter,
        updatePrinterDetails,
        submitPrinterDetails,
        tooglePayment,
        viewpayment,
        viewpending,
        tooglePending,
        updateShopDetails,
        viewbank,
        toogleBank,
        updateBankDetails,
        submitBankDetails,
        submitPayment,
        handleSingleUpload,
        loading,
        handleMultipleUpload,
        viewreject,
        toogleReject,
        resubmitApplication,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboardingContext = (): OnboardingType => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error("useOnboardingContext must be used within a OnBoarding");
  }
  return context;
};
