import React, { useState, useRef, useEffect } from "react";
import {
  APP_COUNTRY_CODE,
  APP_CURRENCY,
  APP_NAME,
  APP_SERVER_URL,
  FileLoading,
  FileUploadFailed,
  Preloader,
  imageplaceholder,
  truncateFilename,
} from "../utils/common";
import {
  FileUploadContextProvider,
  useFileContext,
} from "@/context/FileUploadContext";
import Link from "next/link";
import {
  ArrowLeft,
  BadgePercent,
  Banknote,
  Briefcase,
  Clock,
  CreditCard,
  DollarSign,
  Edit,
  Facebook,
  FileText,
  Hand,
  Home,
  Instagram,
  LogIn,
  LogOut,
  MapPin,
  PackageCheck,
  Pencil,
  PlusCircle,
  Search,
  ShoppingCart,
  Trash2,
  Truck,
  Twitter,
  User,
  X,
  Youtube,
  Map,
} from "lucide-react";
import DragDropFile from "@/components/DragDropFile";
import DraggableMapComponent from "../google/address-locator";
import LocationSelectorModal from "../google/auto-complete-search";
import { useRouter } from "next/router";

const Header = () => {
  return (
    <>
      <HeaderContent />
    </>
  );
};
const HeaderContent = () => {
  const {
    showcartmodal,
    savefiles,
    customization,
    toogleLogin,
    toogleCartModal,
    viewlogin,
    user,
    loading,
    isFileLoading,
    isFileUploadFailed,
    headerlocation,
    toogleHeaderlocation,
    logoutconfirm,
    toogleLogoutconfirm,
    rate,
  } = useFileContext();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !(dropdownRef.current as any).contains(e.target)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const totalPages = savefiles.reduce((sum, item) => sum + item.pages, 0);

  let totalAmount = 0;
  if (customization.printColor === "bw") {
    totalAmount = totalPages * customization.noCopies * rate.bwRate;
  } else if (customization.printColor === "color") {
    totalAmount = totalPages * customization.noCopies * rate.colorRate;
  }
  return (
    <>
      {loading && <Preloader />}
      {isFileLoading && <FileLoading />}
      {isFileUploadFailed && <FileUploadFailed />}
      <div className="w-full fixed top-0 left-0 z-50 bg-background shadow-md">
        <div
          className={`max-w-5xl mx-auto px-4 py-2 border-b border-gray-200 transition-all duration-300 ${
            isScrolled
              ? "bg-background/80 backdrop-blur-md shadow-lg"
              : "bg-background"
          }`}
        >
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* Logo & Address */}
            <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto justify-between sm:justify-start">
              <Link href="/">
                <img src="/logo.svg" className="h-16 w-auto" alt="Logo" />
              </Link>
              <div onClick={toogleHeaderlocation} className="cursor-pointer">
                <h2 className="font-bold text-md sm:text-lg flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-gray-600" />
                  Delivery in 17 minutes
                </h2>
                <div className="text-xs text-gray-600 truncate">
                  {truncateFilename(
                    "Al Safa St, Dubai, United Arab Emirates",
                    35
                  )}
                </div>
              </div>
            </div>

            {/* Account & Cart */}
            <div className="flex items-center gap-x-4 sm:gap-x-5 relative">
              {user === "" ? (
                <div
                  className="text-md hover:cursor-pointer flex items-center gap-2"
                  onClick={toogleLogin}
                >
                  <LogIn className="w-5 h-5" /> Login
                </div>
              ) : (
                <div className="relative" ref={dropdownRef}>
                  <div
                    className="text-md hover:cursor-pointer flex items-center gap-2"
                    onClick={toggleDropdown}
                  >
                    <User className="w-5 h-5" /> Account
                  </div>

                  {isDropdownOpen && (
                    <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-md z-50 py-2">
                      <Link
                        href="/profile/addresses"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Map className="w-4 h-4 mr-2" /> Addresses
                      </Link>
                      <Link
                        href="/profile/orders"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <PackageCheck className="w-4 h-4 mr-2" /> My Orders
                      </Link>
                      <button
                        onClick={toogleLogoutconfirm}
                        className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        <LogOut className="w-4 h-4 mr-2" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Cart Button */}
              <div className="relative">
                <div
                  className="bg-green-700 rounded-lg text-white px-3 py-2 font-bold text-xs sm:text-sm hover:cursor-pointer flex items-center gap-2"
                  onClick={toogleCartModal}
                >
                  <ShoppingCart className="w-5 h-5" />
                  <div>{totalPages} Items</div>
                  <div>
                    {APP_CURRENCY}
                    {totalAmount}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {headerlocation && <LocationSelectorModal />}
      {showcartmodal && <CartModal />}
      {viewlogin && <LoginView />}
      {logoutconfirm && <LogoutConfirm />}
    </>
  );
};

const ChangeLocation = () => {
  const { toogleHeaderlocation } = useFileContext();
  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-md md:max-w-lg rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 pt-4 pb-2 border-b border-gray-200">
            <h4 className="text-sm font-semibold text-gray-700">
              Change Location
            </h4>
            <button
              className="text-gray-400 hover:text-gray-600 text-xs"
              onClick={toogleHeaderlocation}
            >
              <X size={16} />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 space-y-4">
            {/* Detect Location Button */}
            <button className="w-full flex justify-center items-center text-white py-2 px-4 rounded-md text-sm bg-green-700 hover:bg-green-800 transition">
              Detect My Location
            </button>

            {/* OR Divider */}
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <div className="flex-1 h-px bg-slate-200" />
              OR
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            {/* Search Box */}
            <div className="w-full">
              <input
                type="text"
                placeholder="Search for an address"
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const CartModal = () => {
  const { viewcart, viewaddress } = useFileContext();
  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50">
        {viewcart && <CartView />}
        {viewaddress && <AddressView />}
      </div>
    </>
  );
};

const CartView = () => {
  const { viewcart, toogleCartModal, savefiles, viewlogin } = useFileContext();
  const totalPages = savefiles.reduce((sum, item) => sum + item.pages, 0);
  useEffect(() => {
    if (viewcart) {
      document.body.style.overflow = "hidden"; // Disable scroll
    } else {
      document.body.style.overflow = "auto"; // Enable scroll
    }

    return () => {
      document.body.style.overflow = "auto"; // Cleanup on unmount
    };
  }, [viewcart]);

  if (!viewcart) return null;

  return (
    <>
      <div className="flex justify-end relative">
        <div className="w-[400px] bg-gray-100 h-screen overflow-scroll relative shadow-lg">
          <div className="p-4 bg-white flex justify-between items-center">
            <h2 className="font-bold text-lg flex items-center gap-2">
              <ShoppingCart size={20} className="text-green-600" /> My Cart
            </h2>
            <button className="hover:text-red-600" onClick={toogleCartModal}>
              <X size={20} />
            </button>
          </div>

          <div className="m-4">
            <div className="rounded-lg bg-white p-3 my-3 shadow-sm">
              <div className="flex items-start gap-x-4">
                <div className="w-11 h-11 flex items-center justify-center bg-gray-200 rounded-lg">
                  <Clock size={24} className="text-gray-500" />
                </div>
                <div>
                  <div className="font-bold text-sm flex items-center gap-2">
                    Delivery in 13 minutes
                  </div>
                  <div className="flex items-center gap-x-2 text-xs text-gray-600 mt-1">
                    <div>{totalPages} pages</div>
                    <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                    <Link
                      href="/preview"
                      className="flex items-center gap-1 hover:text-blue-600"
                    >
                      <Edit size={14} /> Edit
                    </Link>
                    <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                    <Link
                      href="/preview"
                      className="flex items-center gap-1 hover:text-red-600"
                    >
                      <Trash2 size={14} /> Remove
                    </Link>
                  </div>
                </div>
              </div>
              <UploadList />
            </div>
            <BillingDetails />
            <CancellationPolicy />
          </div>

          <PlaceOrder />
        </div>
      </div>
      {viewlogin && <LoginView />}
    </>
  );
};

const UploadList = () => {
  const { savefiles, customization, rate } = useFileContext();
  let amount = rate.bwRate;
  if (customization.printColor === "color") {
    amount = rate.colorRate;
  }
  return (
    <>
      {savefiles.length !== 0 &&
        savefiles.map((file, index) => (
          <div className="pt-6">
            <div className="flex items-start gap-x-4">
              <div className="">
                <img
                  src={APP_SERVER_URL + "/" + file.thumbnail}
                  className="w-16 h-18 bg-white border border-gray-50 rounded-lg object-contain shadow-lg"
                />
              </div>
              <div className="">
                <div className="text-xs py-0.5">
                  File {index + 1} -{" "}
                  <span className="font-semibold">
                    {truncateFilename(file.filename, 20)}
                  </span>
                </div>
                <div className="flex text-xs py-0.5 text-gray-700">
                  <div className="flex">
                    {file.pages} page,{" "}
                    {customization.printColor === "bw"
                      ? "Black & White"
                      : "Color"}
                    ,{""}&nbsp;
                    <div className="first-letter:uppercase">
                      {customization.printOrientation}
                    </div>
                  </div>
                </div>
                <div className="flex gap-x-2 items-center text-xs font-bold py-0.5">
                  <div className="">
                    {APP_CURRENCY}
                    {amount * file.pages}
                  </div>
                  <div className="text-gray-400">
                    <del>
                      {APP_CURRENCY}
                      {amount * file.pages + 1}
                    </del>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
    </>
  );
};

const BillingDetails = () => {
  const { savefiles, customization, rate } = useFileContext();
  const totalPages = savefiles.reduce((sum, item) => sum + item.pages, 0);

  let totalAmount = 0;
  let tmpTotalAmount = 0;
  if (customization.printColor === "bw") {
    totalAmount = totalPages * customization.noCopies * rate.bwRate;
    tmpTotalAmount =
      totalPages * customization.noCopies * rate.bwRate + savefiles.length;
  } else if (customization.printColor === "color") {
    totalAmount = totalPages * customization.noCopies * rate.colorRate;
    tmpTotalAmount =
      totalPages * customization.noCopies * rate.colorRate + savefiles.length;
  }
  const grandTotalAmount =
    totalAmount + rate.deliveryCharges + rate.handlingCharges;
  return (
    <>
      <div className="rounded-lg bg-white p-3 my-3 shadow-md">
        <h4 className="font-bold text-sm mb-2">Bill Details</h4>

        {/* Items Total */}
        <div className="flex justify-between items-center py-1 text-sm">
          <div className="flex items-center gap-x-2">
            <BadgePercent className="w-4 h-4 text-gray-500" />
            <span>Items Total</span>
            <span className="text-sky-700 bg-sky-100 px-1 py-0.5 text-xs font-bold rounded-md">
              Saved {APP_CURRENCY}
              {tmpTotalAmount - totalAmount}
            </span>
          </div>
          <div className="flex items-center gap-x-2 text-xs font-bold">
            <span className="text-gray-400 line-through">
              {APP_CURRENCY}
              {tmpTotalAmount}
            </span>
            <span>
              {APP_CURRENCY}
              {totalAmount.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Delivery Charge */}
        <div className="flex justify-between items-center py-1 text-sm">
          <div className="flex items-center gap-x-2">
            <Truck className="w-4 h-4 text-gray-500" />
            <span>Delivery Charge</span>
          </div>
          <div className="flex items-center gap-x-2 text-xs font-bold">
            {rate.deliveryCharges === 0 && (
              <span className="text-gray-400 line-through">
                {APP_CURRENCY}0
              </span>
            )}
            <span>
              {APP_CURRENCY}
              {rate.deliveryCharges}
            </span>
          </div>
        </div>

        {/* Handling Charge */}
        <div className="flex justify-between items-center py-1 text-sm">
          <div className="flex items-center gap-x-2">
            <Hand className="w-4 h-4 text-gray-500" />
            <span>Handling Charge</span>
          </div>
          <span className="text-xs font-bold">
            {APP_CURRENCY}
            {rate.handlingCharges}
          </span>
        </div>

        {/* Grand Total */}
        <div className="flex justify-between items-center py-2 font-semibold text-base border-t mt-2 pt-2">
          <span>Grand Total</span>
          <span className="flex items-center gap-x-1">
            {APP_CURRENCY}
            {grandTotalAmount.toFixed(2)}
          </span>
        </div>
      </div>
    </>
  );
};

const CancellationPolicy = () => {
  return (
    <>
      <div className="rounded-lg bg-white p-3 my-3 mb-28">
        <h4 className="font-bold text-sm pb-1">Cancellation Policy</h4>
        <div className="text-gray-400 text-xs font-semibold">
          Orders cannot be cancelled once packed for delivery. In case of
          unexpected delays, a refund will be provided, if applicable.
        </div>
      </div>
    </>
  );
};

const PlaceOrder = () => {
  const {
    savefiles,
    customization,
    toogleLogin,
    user,
    listaddress,
    toogleAddress,
    toogleCart,
    createOrder,
    rate,
  } = useFileContext();
  const totalPages = savefiles.reduce((sum, item) => sum + item.pages, 0);

  let totalAmount = 0;
  if (customization.printColor === "bw") {
    totalAmount = totalPages * customization.noCopies * rate.bwRate;
  } else if (customization.printColor === "color") {
    totalAmount = totalPages * customization.noCopies * rate.colorRate;
  }

  const selectAddress = customization.deliveryAddress
    ? listaddress.find(
        (address) => address._id === customization.deliveryAddress
      )
    : null;

  const changeAddress = () => {
    toogleAddress();
    toogleCart();
  };
  return (
    <>
      <div className="bg-white px-3 pt-3 pb-5 fixed bottom-0 w-[400px]">
        {selectAddress !== null && (
          <>
            <div className="bg-white px-3 pt-0 pb-5">
              <div className="flex justify-between items-center gap-x-3">
                <div className="pr-2 flex-none">
                  <MapPin className="w-6 h-6 flex-none" />
                </div>
                <div className="flex-auto">
                  <div className="font-bold">
                    Delivering to{" "}
                    <span className="first-letter:uppercase">
                      {selectAddress?.addressType}
                    </span>
                  </div>
                  <div className="text-xs text-gray-700">
                    {truncateFilename(
                      [
                        selectAddress?.addressLine1,
                        selectAddress?.addressLine2,
                        selectAddress?.area,
                        selectAddress?.landmark,
                      ]
                        .filter(Boolean)
                        .join(", "),
                      30
                    )}
                  </div>
                </div>
                <div
                  className="text-green-700 text-xs font-bold flex-none cursor-pointer"
                  onClick={changeAddress}
                >
                  Change
                </div>
              </div>
            </div>
          </>
        )}
        <div
          className="bg-green-700 text-white py-2 px-3 rounded-md hover:cursor-pointer"
          onClick={
            user !== ""
              ? selectAddress !== null
                ? createOrder
                : changeAddress
              : toogleLogin
          }
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold">
                {APP_CURRENCY}
                {totalAmount}
              </div>
              <div className="text-xs uppercase">Total</div>
            </div>
            <div className="font-semibold">
              {user !== ""
                ? selectAddress !== null
                  ? "Proceed To Pay"
                  : "Proceed"
                : "Login to Proceed"}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const LoginView = () => {
  const { viewloginmobile, viewotp } = useFileContext();
  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center px-4">
        <div className="bg-white w-full max-w-sm sm:max-w-md md:max-w-lg rounded-lg shadow-md border border-gray-300 overflow-y-auto max-h-[90vh]">
          {viewloginmobile && <LoginOrSignup />}
          {viewotp && <OTPVerification />}
        </div>
      </div>
    </>
  );
};

const LoginOrSignup = () => {
  const { loginMobileInput, mobilenumber, loginSubmit, toogleLogin } =
    useFileContext();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // const evt = e.target as HTMLInputElement
    const newValue = e.target.value.replace(/\D/g, ""); // Remove non-digits
    if (newValue.length > 10) return; // Limit to 5 digits
    loginMobileInput(Number(newValue));
  };
  return (
    <>
      <div className="px-4 py-4 sm:px-6 sm:pt-6 sm:pb-3 w-full">
        <div className="text-center">
          {/* Header */}
          <div className="flex justify-end items-center text-sm">
            <X className="text-red-600 font-medium" onClick={toogleLogin}></X>
          </div>
          {/* Logo or Image */}
          <div className="flex justify-center mb-4">
            <img src={imageplaceholder} alt="Logo" className="w-16 h-16" />
          </div>

          {/* Title and Subtitle */}
          <div className="max-w-sm mx-auto">
            <h2 className="text-xl sm:text-2xl font-bold mb-1">
              Online Printout Store
            </h2>
            <p className="text-gray-600 text-sm mb-4">Log in or Sign up</p>

            {/* Mobile Number Input */}
            <div className="border border-gray-200 rounded-xl px-4 py-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="font-bold">{APP_COUNTRY_CODE}</div>
                <input
                  className="flex-1 bg-transparent outline-none text-sm"
                  placeholder="Enter mobile number"
                  type="tel"
                  value={mobilenumber}
                  onChange={handleChange}
                  maxLength={10}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              className={`w-full px-3 py-3 rounded-xl text-white text-sm font-bold transition-colors duration-300 ${
                String(mobilenumber).length > 8
                  ? "bg-green-700 hover:bg-green-800"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
              onClick={loginSubmit}
              disabled={String(mobilenumber).length <= 8}
            >
              Continue
            </button>
          </div>

          {/* Terms & Privacy */}
          <div className="mt-4 text-xs text-gray-500 px-6">
            By continuing, you agree to our{" "}
            <span className="underline decoration-dotted cursor-pointer">
              Terms of Service
            </span>{" "}
            &{" "}
            <span className="underline decoration-dotted cursor-pointer">
              Privacy Policy
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

const OTPVerification = () => {
  const {
    otpvalue,
    mobilenumber,
    submitOTP,
    updateOTP,
    toogleLoginMobile,
    toogleOTP,
    toogleLogin,
    otperror,
  } = useFileContext();
  const [otp, setOtp] = useState<string[]>(["1", "2", "3", "4"]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [enablebutton, setenablebutton] = useState<boolean>(false);

  const handleChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return; // Allow only numbers

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Take only the last digit
    setOtp(newOtp);

    // Move to next input
    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  useEffect(() => {
    if (otp.every((digit) => digit !== "")) {
      const otpNumber = Number(otp.join(""));
      submitOTP(otpNumber); // Call function when all fields are filled
      setenablebutton(true);
    } else {
      setenablebutton(false);
    }
  }, [otp]);
  return (
    <>
      <div className="p-3 shadow-md text-center bg-white w-full">
        {/* Header */}
        <div className="flex justify-between items-center text-sm">
          <button
            className="text-sky-600 font-medium"
            onClick={() => {
              toogleOTP();
              toogleLoginMobile();
            }}
          >
            Back
          </button>
          <div className="font-semibold text-gray-800">OTP Verification</div>
          <button className="text-sky-600 font-medium" onClick={toogleLogin}>
            Cancel
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="px-4 pt-8 pb-6 sm:px-6">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-1">
            We have sent a verification code to
          </p>
          <div className="font-bold text-base mb-6">
            {APP_COUNTRY_CODE}-{mobilenumber}
          </div>

          {/* OTP Boxes */}
          <div className="flex justify-center gap-2 mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            ))}
          </div>

          {/* Continue Button */}
          <button
            className={`w-full px-4 py-3 rounded-xl transition-colors duration-300 text-white text-sm font-bold ${
              enablebutton
                ? "bg-green-700 hover:bg-green-800"
                : "bg-gray-400 cursor-not-allowed"
            }`}
            // onClick={verifyOTP} // assuming your function name
            disabled={!enablebutton}
          >
            {otperror ? "Continue" : "Loading..."}
          </button>

          {/* Resend */}
          <div className="pt-4 text-xs text-sky-600 underline decoration-dotted cursor-pointer">
            Resend Code
          </div>
        </div>
      </div>
    </>
  );
};

const AddressView = () => {
  const {
    toogleAddress,
    toogleCart,
    viewaeaddress,
    toogleAEAddress,
    listaddress,
    editAddress,
    selectAddress,
  } = useFileContext();

  useEffect(() => {
    // console.log(listaddress);
  }, []);
  return (
    <>
      <div className="flex justify-end relative">
        <div className="w-[400px] bg-gray-100 h-screen overflow-scroll relative">
          {/* Header Section */}
          <div className="p-4 bg-white">
            <div className="flex gap-x-3 items-center">
              <div
                className="text-sky-500 text-sm hover:cursor-pointer flex items-center gap-x-1"
                onClick={() => {
                  toogleAddress();
                  toogleCart();
                }}
              >
                <ArrowLeft className="w-4 h-4" /> {/* Back Icon */}
                Back
              </div>
              <div className="font-bold">Select Delivery Address</div>
            </div>
          </div>

          {/* Add New Address */}
          <div className="m-4">
            <div
              className="bg-white p-3 rounded-xl flex items-center gap-x-3 hover:cursor-pointer"
              onClick={toogleAEAddress}
            >
              <PlusCircle className="text-green-600 w-5 h-5" />{" "}
              {/* Add Address Icon */}
              <div className="text-green-600 font-semibold">
                Add a new address
              </div>
            </div>

            {/* Saved Addresses */}
            <div className="text-gray-700 text-sm pt-3">
              Your saved addresses
            </div>

            {listaddress.length === 0 ? (
              <div className="bg-white p-3 rounded-xl text-sm text-gray-500 my-2">
                No address found
              </div>
            ) : (
              listaddress.map((address) => (
                <div key={address._id} className="bg-white p-3 rounded-xl my-2">
                  <div className="flex gap-x-3">
                    <div className="flex items-center justify-center bg-gray-100 rounded-md p-1.5 w-12 h-10">
                      <MapPin className="w-5 h-5 text-gray-600" />{" "}
                      {/* Address Icon */}
                    </div>
                    <div className="hover:cursor-pointer">
                      <div className="text-md font-semibold capitalize">
                        {address.addressType}
                      </div>
                      <div
                        className="text-xs text-gray-700"
                        onClick={() => selectAddress(address?._id!, address)}
                      >
                        {[
                          address.addressLine1,
                          address.addressLine2,
                          address.area,
                          address.landmark,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </div>
                      <div
                        className="text-sky-600 text-xs py-2 flex items-center gap-x-1 hover:cursor-pointer w-fit"
                        onClick={() => editAddress(address)}
                      >
                        <Pencil className="w-4 h-4" /> {/* Edit Icon */}
                        Edit
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      {viewaeaddress && <AddEditAddress />}
    </>
  );
};

export const AddEditAddress = () => {
  const { updateAEAddress, aeaddress, toogleAEAddress, editAddress } =
    useFileContext();

  const updateLatLng = (lat: number, lng: number, address: string | null) => {
    // console.log(lat, lng, address);
    const temp = [...aeaddress.location.coordinates];
    temp[0] = lat;
    temp[1] = lng;
    if (address !== null) {
      updateAEAddress("area", address);
    }
    updateAEAddress("location", { type: "Point", coordinates: temp });
  };

  useEffect(() => {
    // console.log(aeaddress.location.coordinates);
  }, []);

  const closeAEAddress = () => {
    const data = {
      _id: "",
      user: "",
      addressType: "home",
      addressLine1: "",
      addressLine2: "",
      area: "",
      landmark: "",
      location: { type: "Point", coordinates: [25.2048, 55.2708] },
      name: "",
      phone: null,
    };
    editAddress(data);
    toogleAEAddress();
  };

  const initialUpdate = (defaultCenter: any) => {
    const temp = [...aeaddress.location.coordinates];
    temp[0] = defaultCenter.lat;
    temp[1] = defaultCenter.lng;
    updateAEAddress("location", { type: "Point", coordinates: temp });
  };
  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 md:p-6">
        <div className="bg-white border border-gray-300 shadow-xl rounded-t-2xl md:rounded-xl w-full h-full max-w-[95%] max-h-[95%] overflow-hidden flex flex-col md:flex-row transition-all duration-300">
          {/* Close Button */}
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={closeAEAddress}
              className="p-2 rounded-full bg-gray-100 transition"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {/* Map */}
          <div className="w-full md:w-1/2 h-64 md:h-full">
            <DraggableMapComponent
              updateLocation={updateLatLng}
              location={aeaddress.location}
              updateinitial={initialUpdate}
            />
          </div>

          {/* Address Form */}
          <div className="w-full md:w-1/2 h-full border-t md:border-t-0 md:border-l border-gray-200 p-0 overflow-auto">
            <AddEditAddressComponent />
          </div>
        </div>
      </div>
    </>
  );
};
const AddEditAddressComponent = () => {
  const { updateAEAddress, aeaddress, toogleAEAddress, AddEditAddress } =
    useFileContext();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^a-zA-Z0-9 ,\-]/g, "");
    updateAEAddress(e.target.name, value);
  };
  const handleChangeLocation = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    index: number
  ) => {
    const { name, value } = e.target;
    const temp = [...aeaddress.location.coordinates];
    temp[index] = Number(value);
    updateAEAddress("location", { type: "Point", coordinates: temp });
  };
  return (
    <>
      <div className="">
        {/* <div className="sticky top-0 left-0 bg-white">
          <div className="flex items-center justify-between border-b border-gray-200 p-3">
            <div className="font-bold">Select delivery address</div>
            <div className="hover:cursor-pointer" onClick={toogleAEAddress}>
              <X size={20} />
            </div>
          </div>
        </div> */}
        <div className="p-4 mb-0">
          <div className="flex items-center gap-x-2">
            <div
              className={`flex gap-x-2 px-1.5 py-1 text-xs items-center rounded-lg border border-gray-200 hover:cursor-pointer ${
                aeaddress.addressType === "home" &&
                "bg-green-100 border-green-700"
              }`}
              onClick={() => updateAEAddress("addressType", "home")}
            >
              <Home className="w-5 h-5 text-gray-600" />
              <div>Home</div>
            </div>
            <div
              className={`flex gap-x-2 px-1.5 py-1 text-xs items-center rounded-lg border border-gray-200 hover:cursor-pointer ${
                aeaddress.addressType === "work" &&
                "bg-green-100 border-green-700"
              }`}
              onClick={() => updateAEAddress("addressType", "work")}
            >
              <Briefcase className="w-5 h-5 text-gray-600" />
              <div>Work</div>
            </div>
            <div
              className={`flex gap-x-2 px-1.5 py-1 text-xs items-center rounded-lg border border-gray-200 hover:cursor-pointer ${
                aeaddress.addressType === "other" &&
                "bg-green-100 border-green-700"
              }`}
              onClick={() => updateAEAddress("addressType", "other")}
            >
              <MapPin className="w-5 h-5 text-gray-600" />
              <div>Other</div>
            </div>
          </div>

          <div>
            <div className="my-4">
              <label
                htmlFor="addressLine1"
                className="text-gray-700 font-medium"
              >
                Flat / House no / Building name *
              </label>
              <input
                type="text"
                id="addressLine1"
                name="addressLine1"
                onChange={handleChange}
                value={aeaddress.addressLine1}
                className="w-full h-12 border border-gray-300 rounded-lg px-3 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="my-4">
              <label
                htmlFor="addressLine2"
                className="text-gray-700 font-medium"
              >
                Floor (optional)
              </label>
              <input
                type="text"
                id="addressLine2"
                name="addressLine2"
                onChange={handleChange}
                value={aeaddress.addressLine2}
                className="w-full h-12 border border-gray-300 rounded-lg px-3 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="my-4">
              <label htmlFor="area" className="text-gray-700 font-medium">
                Area / Sector / Locality *
              </label>
              <input
                type="text"
                id="area"
                name="area"
                onChange={handleChange}
                value={aeaddress.area}
                className="w-full h-12 border border-gray-300 rounded-lg px-3 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="my-4">
              <label htmlFor="landmark" className="text-gray-700 font-medium">
                Nearby landmark (optional)
              </label>
              <input
                type="text"
                id="landmark"
                name="landmark"
                onChange={handleChange}
                value={aeaddress.landmark}
                className="w-full h-12 border border-gray-300 rounded-lg px-3 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-x-3">
              <div>
                <label className="block mb-2">Business Location Lat</label>
                <input
                  type="number"
                  name=""
                  value={aeaddress.location?.coordinates?.[0] || ""}
                  onChange={(e) => handleChangeLocation(e, 0)}
                  className="w-full p-2 border rounded-md mb-4"
                  required
                />
              </div>
              <div>
                <label className="block mb-2">Business Location Lng</label>
                <input
                  type="number"
                  name=""
                  value={aeaddress.location?.coordinates?.[1] || ""}
                  onChange={(e) => handleChangeLocation(e, 1)}
                  className="w-full p-2 border rounded-md mb-4"
                  required
                />
              </div>
            </div>

            <div className="text-xs text-gray-400 py-1 font-semibold">
              Enter your details for a seamless delivery experience
            </div>

            <div className="my-4">
              <label htmlFor="name" className="text-gray-700 font-medium">
                Your name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                onChange={handleChange}
                value={aeaddress.name}
                className="w-full h-12 border border-gray-300 rounded-lg px-3 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="my-4">
              <label htmlFor="phone" className="text-gray-700 font-medium">
                Your phone number (optional)
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                onChange={handleChange}
                value={aeaddress?.phone!}
                className="w-full h-12 border border-gray-300 rounded-lg px-3 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 left-0 bg-white px-4 pt-3 pb-5 border-t border-gray-200">
          <div
            className="bg-green-700 text-white py-2 px-3 rounded-md cursor-pointer"
            onClick={AddEditAddress}
          >
            <div className="flex items-center justify-center font-semibold">
              Save Address
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const LogoutConfirm = () => {
  const { toogleLogoutconfirm } = useFileContext();

  const handleLogout = () => {
    localStorage.removeItem("user"); // or remove specific items
    // Optionally reset user context here
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full text-center space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Are you sure you want to logout?
        </h2>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white text-sm px-5 py-2 rounded-md"
        >
          Yes, Logout
        </button>
        <button
          onClick={toogleLogoutconfirm}
          className="block mx-auto text-sm text-gray-500 hover:underline"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default function Footer() {
  const { bloglist } = useFileContext();
  return (
    <footer className="bg-background text-gray-800">
      <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-5 gap-6">
        {/* Logo & Call */}
        <div>
          <h2 className="text-2xl font-bold">
            <img src="/logo.svg" className="h-10 w-auto" />
          </h2>
          <p className="text-sm mt-2">
            Order online printouts anywhere in the UAE.
          </p>
          <DragDropFile>
            <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded-full text-sm cursor-pointer font-bold hover:bg-green-700 uppercase">
              Click to upload
            </button>
          </DragDropFile>
        </div>

        {/* About */}
        <div>
          <h3 className="font-semibold mb-2">ABOUT</h3>
          <ul className="space-y-1 text-sm">
            <li>Home</li>
            <li>Shop</li>
            <li>About</li>
            <li>Contacts</li>
          </ul>
        </div>

        {/* Blogs */}
        <div>
          <h3 className="font-semibold mb-2">BLOGS</h3>
          <ul className="space-y-1 text-sm">
            {bloglist.slice(0, 4).map((blog, index) => (
              <li key={index} title={blog.title}>
                <Link href={"/blog/" + blog.slug}>
                  {truncateFilename(blog.title, 20)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Socials */}
        <div>
          <h3 className="font-semibold mb-2">SOCIALS</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Facebook size={16} /> Facebook
            </li>
            <li className="flex items-center gap-2">
              <Twitter size={16} /> Twitter
            </li>
            <li className="flex items-center gap-2">
              <Instagram size={16} /> Instagram
            </li>
            <li className="flex items-center gap-2">
              <Youtube size={16} /> Youtube
            </li>
          </ul>
        </div>

        {/* Payments */}
        <div>
          <h3 className="font-semibold mb-2">PAYMENTS</h3>
          <div className="space-y-2 text-sm">
            <div className="border w-fit p-1 rounded">
              <img src="/visa.svg" className="w-10" />
            </div>
            <div className="border w-fit p-1 rounded">
              <img src="/mastercard.svg" className="w-10" />
            </div>
          </div>
        </div>
      </div>

      {/* Help & Bottom Bar */}
      <div className="border-t border-gray-300 bg-gray-100 px-4 py-4 text-center text-xs text-gray-600">
        <div className="flex flex-wrap justify-center space-x-4 mb-2">
          <span>Sign In</span>
          <span>Terms And Conditions</span>
          <span>Privacy Policy</span>
          <span>Cookie Policy</span>
        </div>
        <p>AMENA © 2024. ALL RIGHTS RESERVED.</p>
      </div>
    </footer>
  );
}

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <FileUploadContextProvider>
        <Header />
        <div className="pt-34 md:pt-20">
          <main className="max-w-5xl mx-auto">{children}</main>
        </div>
        <Footer />
      </FileUploadContextProvider>
    </>
  );
};
