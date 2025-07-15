import { useOnboardingContext } from "@/context/OnboardingContext";
import { useState } from "react";

const PrinterDetailsForm = () => {
  const { onboarding, updatePrinterDetails, submitPrinterDetails } =
    useOnboardingContext();

  // Handle text input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    updatePrinterDetails(e.target.name, e.target.value);
  };

  // Handle checkbox input
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    const cc = checked
      ? [...onboarding.printerDetails.connectivity, value]
      : onboarding.printerDetails.connectivity.filter((item) => item !== value);
    updatePrinterDetails("connectivity", cc);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // console.log("Printer Details Submitted:", formData);
    submitPrinterDetails();
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 gradient-bg">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4 text-center">Printer Details</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Printer Name */}
          <div>
            <label className="block font-medium">Printer Name</label>
            <input
              type="text"
              name="printerName"
              value={onboarding.printerDetails.printerName}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          {/* Brand */}
          <div>
            <label className="block font-medium">Brand</label>
            <input
              type="text"
              name="brand"
              value={onboarding.printerDetails.brand}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          {/* Model */}
          <div>
            <label className="block font-medium">Model</label>
            <input
              type="text"
              name="model"
              value={onboarding.printerDetails.model}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          {/* Color Print Rate */}
          <div>
            <label className="block font-medium">
              Color Print Rate (AED per page)
            </label>
            <input
              type="number"
              name="colorRate"
              step="0.01"
              min="0"
              value={onboarding.printerDetails.colorRate}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              placeholder="e.g., 0.50"
              required
            />
          </div>

          {/* B/W Print Rate */}
          <div>
            <label className="block font-medium">
              Black & White Print Rate (AED per page)
            </label>
            <input
              type="number"
              name="bwRate"
              step="0.01"
              min="0"
              value={onboarding.printerDetails.bwRate}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              placeholder="e.g., 0.25"
              required
            />
          </div>
          {/* Paper Size */}
          <div>
            <label className="block font-medium">Supported Paper Size</label>
            <select
              name="paperSize"
              value={onboarding.printerDetails.paperSize}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="">Select Paper Size</option>
              <option value="A4" selected>
                A4
              </option>
            </select>
          </div>

          {/* Connectivity Options */}
          <div>
            <label className="block font-medium">Connectivity Options</label>
            <div className="flex flex-wrap gap-4 mt-2">
              {["USB", "WiFi", "Bluetooth", "Ethernet"].map((option) => (
                <label key={option} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={option}
                    checked={onboarding.printerDetails.connectivity.includes(
                      option
                    )}
                    onChange={handleCheckboxChange}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>

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

export default PrinterDetailsForm;
