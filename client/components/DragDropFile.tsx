import { useFileContext } from "@/context/FileUploadContext";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

const DragDropFile = ({ children }: { children: React.ReactNode }) => {
  const { files, addFiles } = useFileContext();
  //   const [files, setFiles] = useState<File[]>([]);

  // Handle file drop
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
      addFiles(acceptedFiles);
    },
    [addFiles]
  );

  // Dropzone configuration
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [], "application/pdf": [] }, // Accept images & PDFs
    multiple: true, // Allow multiple files
  });

  return (
    <div {...getRootProps()} className="">
      <input {...getInputProps()} />
      {/* {isDragActive ? (
        <p className="text-gray-700 font-semibold">Drop the files here...</p>
      ) : (
        <p className="text-gray-500">
          Drag & drop files here, or click to select
        </p>
      )} */}
      {children}
      {/* File Preview */}
      {files.length > 0 && (
        <div className="mt-4 text-left">
          <h4 className="font-semibold">Uploaded Files:</h4>
          <ul className="list-disc pl-5 text-gray-700">
            {files.map((fileData, index) => (
              <li key={index} className="mt-1">
                {fileData.file.name} ({(fileData.file.size / 1024).toFixed(2)}{" "}
                KB)
                {fileData.file.type.startsWith("image/") && (
                  <img
                    src={fileData.preview}
                    alt={fileData.file.name}
                    className="mt-2 w-24 h-24 object-cover rounded-lg"
                  />
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DragDropFile;
