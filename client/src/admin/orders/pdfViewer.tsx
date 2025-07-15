import { useAdminContext } from "@/context/AdminContext";
import { X } from "lucide-react";
import { useEffect, useRef } from "react";

interface PdfModalProps {
  pdfUrl: string;
  onClose?: () => void;
}

const PdfModal: React.FC<PdfModalProps> = ({ pdfUrl }) => {
  const { controlPdf } = useAdminContext();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const printPDF = () => {
      if (iframeRef.current) {
        iframeRef.current.contentWindow?.focus();
        iframeRef.current.contentWindow?.print();
      }
    };

    const timer = setTimeout(printPDF, 1000);
    return () => clearTimeout(timer);
  }, [pdfUrl]);

  const onClose = () => {
    controlPdf("", false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-[80vw] h-[90vh] relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-gray-700 text-white p-2 rounded-full hover:bg-gray-900"
        >
          <X className="text-white w-6 h-6" />
        </button>

        {/* PDF Viewer with Sidebar Disabled */}
        <iframe
          ref={iframeRef}
          src={`${pdfUrl}#toolbar=view&view=Fit`}
          // src={`${pdfUrl}`}
          className="w-full h-full border-none"
          title="PDF Viewer"
        />
      </div>
    </div>
  );
};

export default PdfModal;
