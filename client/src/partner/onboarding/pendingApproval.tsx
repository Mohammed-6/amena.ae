import { ClockIcon, MailIcon } from "@heroicons/react/outline";

const PendingApproval = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 gradient-bg">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md text-center">
        <ClockIcon className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800">
          Your Form is Submitted
        </h2>
        <p className="text-gray-600 mt-2">
          Your submission is under review and pending approval.
        </p>
        <p className="text-gray-600 mt-2">
          This process may take{" "}
          <span className="font-semibold">2-3 business days</span>.
        </p>
        <div className="flex items-start justify-center bg-gray-200 p-3 rounded-md mt-4">
          <MailIcon className="h-6 w-6 text-blue-500 mr-2" />
          <p className="text-gray-700">
            If more documents are required, we will contact you via email.
          </p>
        </div>
        <p className="text-gray-500 text-sm mt-4">
          Thank you for your patience.
        </p>
      </div>
    </div>
  );
};

export default PendingApproval;
