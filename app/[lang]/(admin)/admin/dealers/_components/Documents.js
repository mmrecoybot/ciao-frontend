import ImmersiveImageModal from "@/app/[lang]/components/ImmersiveImageModal";
import Image from "next/image";
import React from "react";

export default function Documents({ dealerData, dictionary }) {
  if (dealerData.Documents.length === 0) {
    return <p>{dictionary.dealersPage.no_documents_uploaded}</p>;
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {dealerData.Documents.map((doc, index) => (
        <div
          key={index}
          className=" p-4 dark:bg-gray-800 rounded-lg dark:text-gray-200 shadow shadow-blue-300"
        >
          <h3 className="font-semibold text-lg mb-2">{doc.name}</h3>
          <div className='relative '>
            <Image
              src={doc.fileUrl}
              alt={doc.name}
              width={200}
              height={200}
              className="w-full h-32 object-cover rounded-lg shadow-sm"
            />
            <ImmersiveImageModal url={doc.fileUrl} />
          </div>
        </div>
      ))}
    </div>
  );
}
