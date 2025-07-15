import { useFileContext } from "@/context/FileUploadContext";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";

export const APP_NAME = "Amena";

export const imageplaceholder = "/logo.svg";

export const APP_CURRENCY = "AED";

export const APP_COUNTRY_CODE = "+971";

export const APP_SERVER_URL = process.env.NEXT_PUBLIC_APP_SERVER_URL;

export const APP_BW_PRICE = 3;

export const APP_COLOR_PRICE = 10;

export function makestr(length: number) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export function makeid(length: number) {
  var result = "";
  var characters = "0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return Number(result);
}

export const FileLoading = () => {
  const { handleCancel } = useFileContext();
  useEffect(() => {
    if (typeof window !== "undefined") {
      // document.body.style.overflow = "hidden";
    }
  }, []);

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40"></div>
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white px-8 py-6 rounded-xl shadow-xl max-w-sm w-full">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <img
                src={imageplaceholder}
                alt="Uploading"
                className="w-22 h-auto rounded-full"
              />
            </div>

            <div className="w-full h-3 rounded-full bg-gray-200 mb-4 overflow-hidden">
              <div className="bg-blue-600 h-full rounded-full w-[90%] transition-all duration-300 ease-in-out animate-pulse"></div>
            </div>

            <h2 className="text-lg font-semibold text-gray-800 mb-1">
              Upload in Progress
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Files are being securely transferred. Originals will be deleted
              after printing.
            </p>

            <button
              onClick={handleCancel}
              className="text-yellow-500 font-medium text-sm hover:underline"
            >
              Cancel Upload
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export const FileUploadFailed = () => {
  const { toogleisFileUploadFailed } = useFileContext();
  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40"></div>
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white px-8 py-6 rounded-xl shadow-xl max-w-sm w-full border border-red-200">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <img
                src={imageplaceholder}
                alt="Upload failed"
                className="w-16 h-16 rounded-full border border-red-300 p-1"
              />
            </div>

            <div className="w-full h-3 rounded-full bg-red-100 mb-4 overflow-hidden">
              <div className="bg-red-500 h-full rounded-full w-full animate-pulse"></div>
            </div>

            <h2 className="text-lg font-semibold text-red-600 mb-1">
              Upload Failed
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Something went wrong while uploading. Please try again or check
              your connection.
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={toogleisFileUploadFailed}
                className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-700"
              >
                Retry
              </button>
              <button
                onClick={toogleisFileUploadFailed}
                className="text-gray-500 text-sm font-medium hover:underline"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const truncateFilename = (filename: string, length: number = 5) => {
  if (filename.length > length) {
    return filename.substring(0, length) + "...";
  }
  return filename;
};

export const Preloader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 bg-opacity-50 z-100000">
      <div className="relative w-16 h-16">
        {/* Spinner */}
        <div className="absolute inset-0 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
      </div>
    </div>
  );
};

export const APP_SOCKET_URL = process.env.NEXT_PUBLIC_APP_SOCKET_URL;

export const generateSlug = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // remove special characters
    .replace(/\s+/g, "-") // replace spaces with hyphens
    .replace(/--+/g, "-"); // avoid duplicate dashes

export const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center p-6">
      <div className="text-red-500">
        <AlertTriangle className="w-16 h-16 mb-4" />
      </div>
      <h1 className="text-4xl font-bold text-gray-800 mb-2">404</h1>
      <p className="text-xl text-gray-600 mb-6">Page Not Found</p>
      <p className="text-gray-500 mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        href={"/"}
        className="px-6 py-2 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition"
      >
        Go to Homepage
      </Link>
    </div>
  );
};
