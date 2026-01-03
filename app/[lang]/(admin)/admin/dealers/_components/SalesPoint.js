import Modal from "@/app/[lang]/components/Modal";
import React from "react";
import UniversalAddButton from "./AddButton";

export default function SalesPoint({ dealerData, dictionary }) {
  if (dealerData.salePoints.length === 0) {
    return <p>{dictionary.dealersPage.no_sales_points_assigned}</p>;
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {dealerData.salePoints.map((point, index) => (
        <div
          key={index}
          className=" last:mb-0 p-4 dark:bg-gray-800 rounded-lg dark:text-gray-200"
        >
          <h3 className="font-semibold text-lg mb-2">{point.name}</h3>
          <p>
            {point.address}, {point.city}, {point.province}
          </p>
          <p>{dictionary.dealerPages.phone}: {point.phoneNumber}</p>
        </div>
      ))}
    </div>
  );
}
