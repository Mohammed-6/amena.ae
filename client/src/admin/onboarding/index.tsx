import { useState, useEffect } from "react";
import axios from "axios";
import { onboardingTypes } from "@/context/OnboardingContext";
import { listOnboarding } from "../query/admin";
import { toast } from "react-toastify";
import AdminPanel from "../layout/AdminPanel";
import Link from "next/link";

export default function OnboardingList() {
  return (
    <>
      <AdminPanel>
        <Content />
      </AdminPanel>
    </>
  );
}
function Content() {
  const [onboardings, setOnboardings] = useState<onboardingTypes[]>([]);

  useEffect(() => {
    const fetchOnboardings = async () => {
      try {
        await listOnboarding()
          .then((res) => {
            setOnboardings(res.data.onboarding);
          })
          .catch((error) => {
            console.log(error);
            toast.error("Something went wrong");
          }); // Replace with actual API endpoint
      } catch (error) {
        console.error("Error fetching onboardings:", error);
      }
    };
    fetchOnboardings();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Onboarding Submissions</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Company</th>
              <th className="border p-2">Owner</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Phone</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Resubmit</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {onboardings.map((onboarding) => (
              <tr key={onboarding._id} className="border hover:bg-gray-50">
                <td className="border p-2">
                  {onboarding.companyDetails.companyName}
                </td>
                <td className="border p-2">
                  {onboarding.companyDetails.ownerName}
                </td>
                <td className="border p-2">
                  {onboarding.companyDetails.ownerEmail}
                </td>
                <td className="border p-2">
                  {onboarding.companyDetails.ownerPhone}
                </td>
                <td className="border p-2">
                  {onboarding.adminApproved ? (
                    <span className="text-green-500">Approved</span>
                  ) : (
                    <span className="text-red-500">Pending</span>
                  )}
                </td>
                <td className="border p-2">
                  {onboarding?.resubmit ? (
                    <span className="text-green-500">Yes</span>
                  ) : (
                    <span className="text-red-500">No</span>
                  )}
                </td>
                <td className="flex gap-2">
                  <Link
                    href={`/admin/onboarding/check/${onboarding._id}`}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
