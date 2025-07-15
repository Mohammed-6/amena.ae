import { useOnboardingContext } from "@/context/OnboardingContext";
import { useState } from "react";

const BankDetailsForm = () => {
  const { onboarding, updateBankDetails, submitBankDetails } =
    useOnboardingContext();
  const uaeBanks = [
    "Abu Dhabi Commercial Bank",
    "Dubai Islamic Bank",
    "Emirates NBD",
    "First Abu Dhabi Bank",
    "Mashreq Bank",
    "RAKBANK",
    "Sharjah Islamic Bank",
    "United Arab Bank",
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    updateBankDetails(e.target.name, e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // console.log("Submitted Data:", formData);
    submitBankDetails();
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 gradient-bg">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4 text-center">Bank Details</h2>
        <form onSubmit={handleSubmit}>
          {/* Bank Name */}
          <label className="block mb-2 font-semibold">Bank Name</label>
          <select
            name="bankName"
            value={onboarding.bankDetails.bankName}
            onChange={handleChange}
            className="w-full p-2 border rounded-md mb-4"
            required
          >
            <option value="">Select Your Bank</option>
            {uaeBanks.map((bank, index) => (
              <option key={index} value={bank}>
                {bank}
              </option>
            ))}
          </select>

          {/* Account Holder Name */}
          <label className="block mb-2 font-semibold">
            Account Holder Name
          </label>
          <input
            type="text"
            name="accountHolder"
            value={onboarding.bankDetails.accountHolder}
            onChange={handleChange}
            className="w-full p-2 border rounded-md mb-4"
            required
          />

          {/* Bank Account Number */}
          <label className="block mb-2 font-semibold">
            Bank Account Number
          </label>
          <input
            type="text"
            name="accountNumber"
            value={onboarding.bankDetails.accountNumber}
            onChange={handleChange}
            className="w-full p-2 border rounded-md mb-4"
            required
          />

          {/* IBAN Number */}
          <label className="block mb-2 font-semibold">IBAN Number</label>
          <input
            type="text"
            name="iban"
            value={onboarding.bankDetails.iban}
            onChange={handleChange}
            className="w-full p-2 border rounded-md mb-4"
            required
          />

          {/* Branch Name */}
          <label className="block mb-2 font-semibold">Branch Name</label>
          <input
            type="text"
            name="branch"
            value={onboarding.bankDetails.branch}
            onChange={handleChange}
            className="w-full p-2 border rounded-md mb-4"
            required
          />

          {/* Swift Code */}
          <label className="block mb-2 font-semibold">Swift Code</label>
          <input
            type="text"
            name="swiftCode"
            value={onboarding.bankDetails.swiftCode}
            onChange={handleChange}
            className="w-full p-2 border rounded-md mb-4"
            required
          />

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default BankDetailsForm;
