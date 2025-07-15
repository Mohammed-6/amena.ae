import { useOnboardingContext } from "@/context/OnboardingContext";
import { useState } from "react";
import { toast } from "react-toastify";

const PaymentPage = () => {
  const { submitPayment } = useOnboardingContext();
  const [loading, setLoading] = useState(false);

  const handlePayment = () => {
    setLoading(true);
    setTimeout(() => {
      toast.success("Payment Successful! Your form has been submitted.");
      setLoading(false);
    }, 2000);
    setTimeout(() => {
      submitPayment();
    }, 3000);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Form Fee Payment
        </h2>
        <p className="text-gray-600 mb-4">
          To submit your form, please pay the fee.
        </p>

        <div className="bg-gray-200 p-4 rounded-md mb-4">
          <p className="text-xl font-semibold">Total Amount:</p>
          <p className="text-3xl font-bold text-blue-600">50 AED</p>
        </div>

        <p className="text-red-500 text-sm mb-4">This fee is non-refundable.</p>

        <button
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition disabled:bg-gray-400"
          onClick={handlePayment}
          disabled={loading}
        >
          {loading ? "Processing..." : "Pay 50 AED"}
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;
