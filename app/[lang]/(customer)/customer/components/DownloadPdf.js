"use client";

import genPdfWithImageLiba from "@/utils/dounloadPdf";
import { Printer } from "lucide-react";
import React from "react";

export default function DownloadPdf({
  Icon = Printer,
  link,
  title = "",
  fileName = "file",
  className = "",
}) {
  const handlePdfGeneration = async () => {
    const result = await genPdfWithImageLiba(link,fileName);
    // if (result.success) {
    //   // Download or handle the generated PDF bytes
    //   const pdfBlob = new Blob([result.data], { type: "application/pdf" });
    //   const url = URL.createObjectURL(pdfBlob);
    //   const a = document.createElement("a");
    //   a.href = url;
    //   a.download = `${fileName}.pdf`;
    //   a.click();
    //   URL.revokeObjectURL(url);
    // } else {
    //   console.error("PDF Generation failed:", result.error);
    // }
  };

  return (
    <button
      onClick={handlePdfGeneration}
      className={`flex items-center gap-2 ${className}`}
    >
      {Icon && <Icon className="w-5 h-5" />}
      {title}
    </button>
  );
}
