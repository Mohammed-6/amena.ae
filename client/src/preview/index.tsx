import { useFileContext } from "@/context/FileUploadContext";
import { Layout as FrontLayout } from "../layout";
import {
  APP_CURRENCY,
  APP_SERVER_URL,
  imageplaceholder,
} from "../utils/common";
import DragDropFile from "@/components/DragDropFile";
import {
  AlertTriangle,
  Copy,
  Droplet,
  FilePlus,
  FileText,
  Layout,
  Minus,
  PaintBucket,
  Plus,
  PlusCircle,
  Printer,
  ShoppingCart,
  Trash2,
} from "lucide-react";

const PreviewView = () => {
  return (
    <FrontLayout>
      <Content />
    </FrontLayout>
  );
};

const Content = () => {
  return (
    <>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center pb-8 pt-6 border-b border-gray-200 flex items-center justify-center gap-2">
          <Printer className="w-6 h-6 text-sky-600" />
          <h2 className="font-bold text-2xl text-slate-800">
            Printout Preview
          </h2>
        </div>

        {/* Preview File Section */}
        <div className="py-6">
          <PreviewFile />
        </div>

        {/* File Deletion Notice */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-2 bg-yellow-100 py-3 px-4 rounded-md text-sm text-yellow-800">
          <AlertTriangle className="w-4 h-4 text-yellow-700" />
          <span className="text-center sm:text-left">
            Preview may not show exact colors or texture. Final print will match
            the original file.
          </span>
        </div>

        {/* Print Options & Cart */}
        <div className="mt-8 space-y-6">
          <PrintCustomization />
          <ViewCart />
        </div>
      </div>
    </>
  );
};

const PreviewFile = () => {
  const { savefiles, removeFile } = useFileContext();
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
        {savefiles.length !== 0 &&
          savefiles.map((file, i) => (
            <div className="" key={i}>
              <div className="relative h-[300px] w-[auto] bg-white rounded-xl p-2 shadow-lg">
                {/* File Preview */}
                <div className="h-full w-full flex items-center justify-center">
                  <img
                    src={APP_SERVER_URL + "/" + file.thumbnail}
                    className="h-[300px] w-[213px] object-contain rounded-lg"
                    alt={`File ${i + 1}`}
                  />
                </div>

                {/* Remove File Button */}
                <button
                  className="absolute top-0 right-0 p-2 bg-red-500 text-white rounded-bl-lg rounded-tr-lg shadow-md hover:bg-red-600 transition"
                  onClick={() => removeFile(i, file._id)}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* File Info */}
              <div className="flex justify-center text-sm text-gray-700 mt-3 w-auto">
                <span className="font-medium">
                  File {i + 1} ({file.pages} pages)
                </span>
              </div>
            </div>
          ))}

        {/* Drag & Drop File Upload */}
        <div className="flex justify-center">
          <DragDropFile>
            <div className="flex flex-col items-center justify-center w-[213px] h-[300px] bg-white rounded-xl p-4 shadow-lg border-dashed border-2 border-gray-300 hover:border-blue-400 transition">
              <AddFile />
            </div>
          </DragDropFile>
        </div>
      </div>
    </>
  );
};

const AddFile = () => {
  return (
    <>
      <div className="px-6 cursor-pointer">
        <div className="h-[300px] w-[213px] bg-white rounded-xl p-2 border border-gray-200 relative shadow-md flex items-center justify-center text-green-700 font-bold text-sm">
          <PlusCircle className="w-8 h-8 mr-2" />
          Add Files
        </div>
      </div>
    </>
  );
};

const PrintCustomization = () => {
  const {
    customization,
    updateCopiesUp,
    updateCopiesDown,
    updatePrintOrientation,
    updatePrintColor,
    rate,
  } = useFileContext();
  return (
    <>
      <div className="px-0">
        {/* Header */}
        <div className="py-6 border-b border-gray-300">
          <h3 className="text-lg font-bold">Print Settings</h3>
          <p className="text-sm text-gray-500">Applied to all uploaded files</p>
        </div>

        {/* Copies Selection */}
        <div className="py-6 border-b border-gray-300 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold flex items-center gap-x-2">
              <Copy className="w-5 h-5 text-green-700" />
              Number of Copies
            </h3>
            <p className="text-xs text-gray-500">How many copies you need?</p>
          </div>
          <div className="flex items-center border border-green-700 bg-green-50 rounded-md py-2 px-5 gap-x-4">
            <Minus
              className="text-green-700 cursor-pointer hover:scale-110 transition-transform"
              onClick={() => updateCopiesDown(customization.noCopies)}
            />
            <span className="font-bold">{customization.noCopies}</span>
            <Plus
              className="text-green-700 cursor-pointer hover:scale-110 transition-transform"
              onClick={() => updateCopiesUp(customization.noCopies)}
            />
          </div>
        </div>

        {/* Print Color & Orientation */}
        <div className="py-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Print Color */}
          <div>
            <h3 className="text-lg font-bold flex items-center gap-x-2">
              Print Color
            </h3>
            <p className="text-xs text-gray-500">
              Choose Black & White or Color
            </p>
            <div className="flex items-center gap-x-4 pt-4">
              {[
                {
                  value: "bw",
                  icon: <PaintBucket className="w-8 h-8 text-black" />,
                  label: "B&W",
                  price: rate.bwRate,
                },
                {
                  value: "color",
                  icon: <Droplet className="w-8 h-8 text-blue-500" />,
                  label: "Color",
                  price: rate.colorRate,
                },
              ].map((opt) => (
                <div
                  key={opt.value}
                  className={`h-20 w-20 flex flex-col items-center justify-center rounded-lg shadow-md transition cursor-pointer ${
                    customization.printColor === opt.value
                      ? "border border-green-700 bg-green-50"
                      : "border border-gray-300 bg-white hover:border-green-400"
                  }`}
                  onClick={() => updatePrintColor(opt.value)}
                >
                  {opt.icon}
                  <span className="text-xs font-bold">{opt.label}</span>
                  <span className="text-xs">
                    {APP_CURRENCY + opt.price}/page
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Print Orientation */}
          <div>
            <h3 className="text-lg font-bold flex items-center gap-x-2">
              <Layout className="w-5 h-5 text-green-700" />
              Print Orientation
            </h3>
            <p className="text-xs text-gray-500">Select the print layout</p>
            <div className="flex items-center gap-x-4 pt-4">
              {[
                {
                  value: "portrait",
                  visual: (
                    <div className="w-6 h-10 bg-gray-300 border rounded-sm" />
                  ),
                  label: "Portrait",
                },
                {
                  value: "landscape",
                  visual: (
                    <div className="w-10 h-6 bg-gray-300 border rounded-sm" />
                  ),
                  label: "Landscape",
                },
              ].map((opt) => (
                <div
                  key={opt.value}
                  className={`h-20 w-20 flex flex-col items-center justify-center rounded-lg shadow-md transition cursor-pointer ${
                    customization.printOrientation === opt.value
                      ? "border border-green-700 bg-green-50"
                      : "border border-gray-300 bg-white hover:border-green-400"
                  }`}
                  onClick={() => updatePrintOrientation(opt.value)}
                >
                  {opt.visual}
                  <span className="text-xs font-bold">{opt.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const ViewCart = () => {
  const { savefiles, customization, toogleCartModal, rate } = useFileContext();
  const totalPages = savefiles.reduce((sum, item) => sum + item.pages, 0);

  let totalAmount = 0;
  if (customization.printColor === "bw") {
    totalAmount = totalPages * customization.noCopies * rate.bwRate;
  } else if (customization.printColor === "color") {
    totalAmount = totalPages * customization.noCopies * rate.colorRate;
  }
  return (
    <>
      <div className="px-0 pb-10">
        <div className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition rounded-xl p-4 shadow-sm">
          {/* File & Cost Summary */}
          <div className="flex items-center gap-x-4">
            <div className="flex items-center justify-center w-16 h-16 bg-gray-200 rounded-full shadow-inner">
              <FileText className="w-12 h-12 text-gray-600" />
            </div>
            <div>
              <div className="text-gray-500 font-semibold pb-1">
                Total {totalPages} {totalPages === 1 ? "page" : "pages"}
              </div>
              <div className="font-bold text-lg text-slate-800">
                {APP_CURRENCY}
                {totalAmount.toFixed(2)}
              </div>
            </div>
          </div>

          {/* View Cart Button */}
          <button
            className="flex items-center gap-x-2 bg-green-700 text-white px-4 py-2 rounded-md font-bold shadow-md hover:bg-green-800 transition"
            onClick={toogleCartModal}
          >
            <ShoppingCart className="w-5 h-5" />
            View Cart
          </button>
        </div>
      </div>
    </>
  );
};

export default PreviewView;
