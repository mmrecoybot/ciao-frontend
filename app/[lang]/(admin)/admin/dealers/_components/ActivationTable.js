import PaginationWrapper from "@/app/[lang]/components/PAginationWrapper";
import React from "react";

export default function ActivationTable({ user, dictionary }) {
  return (
    <PaginationWrapper
      data={user.Activation}
      itemsPerPage={10}
    >
      {(paginatedData) => (
        <table className="min-w-full dark:bg-gray-700 dark:text-gray-200">
          <thead>
            <tr className="dark:bg-gray-600">
              <th className="px-4 py-2">{dictionary.dealersPage.id}</th>
              <th className="px-4 py-2">
                {dictionary.ordersPages.serial_number}
              </th>
              <th className="px-4 py-2">{dictionary.companyPages.company}</th>
              <th className="px-4 py-2">{dictionary.ordersPages.status}</th>
              <th className="px-4 py-2">{dictionary.orderPages.date}</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((activation, activationIndex) => (
              <tr
                key={activationIndex}
                className="border-b border-gray-600 text-center"
              >
                <td className="px-4 py-2">{activation.id}</td>
                <td className="px-4 py-2">{activation.serialNumber.number}</td>
                <td className="px-4 py-2">{activation.company.name}</td>
                <td className="px-4 py-2">{activation.status}</td>
                <td className="px-4 py-2">
                  {new Date(activation.activationDate).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </PaginationWrapper>
  );
}
