import React from "react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { X } from "lucide-react";
import Link from "next/link";

const SimpleImageUpload = ({
  dictionary,
  onImageChange,
  image,
  folder = "product",
  display = "none",
}) => {
  const { data: session } = useSession();
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(image);
  const [pdfUrl, setPdfUrl] = useState(null);
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("folder", folder);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL_API}/api/v1/lib/upload`,
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${session?.user?.accessToken}`,
          },
          body: formData,
        }
      );
      setIsUploading(false);
      if (response.ok) {
        toast.success("file uploaded");
        const data = await response.json();
        if (data.fileDetails.mimetype === "application/pdf") {
          setPdfUrl(data.fileUrl);
        } else {
          setPdfUrl(null);
        }
        if (data.fileDetails.mimetype.startsWith("image")) {
          setPreviewUrl(data.fileUrl);
        }
        onImageChange(data.fileUrl);

        setSelectedFile(null);
      }
    } catch (error) {
      toast.error(error.message);
      console.error(error);
      setIsUploading(false);
    }
  };

  return (
    <div>
      {previewUrl || pdfUrl ? (
        <div className="relative">
          {!pdfUrl ? (
            <img
              src={previewUrl}
              alt={`Preview`}
              className="w-full h-32 object-contain"
            />
          ) : (
            <div>
              <Link href={pdfUrl} target="_blank">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  {dictionary.orderPages.view_pdf}
                </button>
              </Link>
            </div>
          )}
          <button
            onClick={() => {
              setPreviewUrl(null);
              setSelectedFile(null);
            }}
            title={dictionary.orderPages.remove_image}
            className="absolute -top-2 right-5 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-1 rounded-full">
            <X size={12} />
          </button>
        </div>
      ) : (
        <div className="mb-4">
          <label
            className="block text-sm font-medium text-gray-700"
            style={{ display: display }}>
            {dictionary.orderPages.upload_image}
          </label>
          <div className="mt-1 border justify-between flex pr-3 border-gray-300   rounded-md p-1">
            <input
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              className="w-full p-1 "
            />
            <button
              onClick={handleUpload}
              disabled={isUploading}
              className="bg-emerald-500 hover:bg-emerald-700 text-white font-thin  px-4 rounded">
              {isUploading
                ? `${dictionary.productsPages.uploading}...`
                : `${dictionary.orderPages.upload}`}
            </button>
          </div>
          <p className="text-xs text-gray-500">
            {dictionary.pages.upload_note}
          </p>
        </div>
      )}
    </div>
  );
};

export default SimpleImageUpload;
