"use client";
import React, { useState, useEffect } from "react";
import { PhoneIcon, Building, User } from "lucide-react";
import EditButton from "./EditButton";
import DeleteButton from "./DeleteButton";
import Pagination from "../../components/Pagination";
import { AlertOctagon } from "lucide-react";

export default function PhoneNumberTable({ phoneNumbers, dictionary, lang }) {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 25;

  const totalPages = Math.ceil(phoneNumbers.length / rowsPerPage);
  const startIdx = (currentPage - 1) * rowsPerPage;
  const endIdx = startIdx + rowsPerPage;
  const paginatedPhoneNumbers = phoneNumbers.slice(startIdx, endIdx);

  const totalActive = phoneNumbers.filter(
    (phone) => checkActivationStatus(phone, dictionary) === "active"
  ).length;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    if (phoneNumbers.length < 5) {
      setCurrentPage(1);
    }
  }, [phoneNumbers]);

  return (
    <div className="overflow-x-auto pb-16">
      <div className="mb-4 text-gray-600 dark:text-gray-400 font-medium bg-white dark:bg-slate-700 p-2 text-center text-md">
        <div className="flex justify-center items-center gap-4">
          <div className="text-gray-600 dark:text-gray-400 ">
            {dictionary.simPage.total_active_numbers}:{" "}
            <span className="font-semibold text-gray-800 text-xl dark:text-gray-100">
              {totalActive}
            </span>
          </div>
          <div className="text-gray-600 dark:text-gray-400 text-md  ">
            {dictionary.simPage.total_numbers}:{" "}
            <span className="font-semibold text-gray-800 text-xl dark:text-gray-100">
              {phoneNumbers.length}
            </span>
          </div>
        </div>
      </div>

      <div className="border rounded-md overflow-hidden">
        {/* Table Header */}
        {phoneNumbers.length > 0 ? (
          <>
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-slate-700 dark:text-gray-100 sticky top-0">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ##
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {dictionary.personalDataPage.number}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {dictionary.activation.company}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {dictionary.simPage.dealer}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {dictionary.activation.activation}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {dictionary.simPage.created_at}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {dictionary.userPages.actions}
                  </th>
                </tr>
              </thead>
            </table>

            {/* Table Body with Scroll */}
            <div className="max-h-[58vh] overflow-y-auto">
              <table className="w-full divide-y divide-gray-200">
                <tbody className="bg-white dark:bg-slate-800 dark:divide-gray-700">
                  {paginatedPhoneNumbers.map((phone, index) => (
                    <tr
                      key={phone.id}
                      className="hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-400">
                        {startIdx + index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <PhoneIcon className="h-5 w-5 text-gray-400 mr-2" />
                          {phone.number}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <Building className="h-5 w-5 text-gray-400 mr-2" />
                          {phone?.company?.name || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <User className="h-5 w-5 text-gray-400 mr-2" />
                          {phone?.dealer?.companyName || "N/A"}
                        </div>
                      </td>
                      <td className="capitalize px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {checkActivationStatus(phone, dictionary)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(phone.createdAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 flex gap-2">
                        <EditButton
                          simId={phone.id}
                          label={dictionary.personalDataPage.edit}
                          lang={lang}
                          dictionary={dictionary}
                          simToEdit={phone}
                        />
                        <DeleteButton
                          simId={phone.id}
                          label={dictionary.bannerPages.delete}
                          lang={lang}
                          dictionary={dictionary}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="flex justify-center items-center min-h-96">
            <p className="text-red-500 dark:text-gray-400 text-3xl flex justify-center items-center">
              <AlertOctagon className="text-red-400 mr-2" size={50} />
              {dictionary.simPage.no_numbers}
            </p>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}

function checkActivationStatus(phoneData, dictionary) {
  if (phoneData.Activation && phoneData.Activation.length > 0) {
    return phoneData.Activation[0].status;
  } else {
    return `${dictionary.simPage.not_activated}`;
  }
}
