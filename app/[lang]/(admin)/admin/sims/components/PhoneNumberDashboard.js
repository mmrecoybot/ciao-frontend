"use client";

import React, { useState } from "react";
import PhoneNumberTable from "./PhoneNumberTable";
import AddPhoneNumberModal from "./AddPhoneNumberModal";
import { PhoneIcon, PlusIcon, SearchIcon } from "lucide-react";
import { useFetchSimsQuery } from "@/store/slices/simApi";
import Loading from "../../components/Loading";

export default function PhoneNumberDashboard({ dictionary, lang }) {
  const { data: phoneNumbers, isLoading, isError, error } = useFetchSimsQuery();
  // console.log(phoneNumbers);

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedDealer, setSelectedDealer] = useState("");
  const filteredPhoneNumbers = phoneNumbers?.filter((phone) => {
    const matchesSearchTerm = phone.number
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCompany =
      selectedCompany === "" || phone.company.name === selectedCompany;
    const matchesDealer =
      selectedDealer === "" || phone.dealer.companyName === selectedDealer;
    const matches = matchesSearchTerm && matchesCompany && matchesDealer;
    return matches;
  });

  const companyList = [
    ...new Set(
      phoneNumbers?.map((phone) => {
        return phone?.company?.name;
      })
    ),
  ];
  const dealerList = [
    ...new Set(
      phoneNumbers?.map((phone) => {
        return phone?.dealer?.companyName;
      })
    ),
  ];

  if (isLoading) return <Loading />;

  return (
    <div className="bg-gray-100  dark:bg-slate-900 min-h-screen w-full">
      <div className="w-full mx-auto">
        <div className=" mb-14 sm:px-0">
          <div className="shadow-lg rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center bg-emerald-200">
              <h1 className="text-2xl font-bold text-gray-500 flex items-center">
                <PhoneIcon className="h-8 w-8 mr-2" />
                {dictionary.simPage.phone_number_dashboard}
              </h1>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-white dark:bg-slate-700 text-emerald-600 dark:text-white hover:bg-blue-50 font-bold py-2 px-4 rounded-full flex items-center transition duration-300 ease-in-out transform hover:scale-105"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                {dictionary.simPage.add_new_number}
              </button>
            </div>
            <div className="px-4 py-5 sm:p-6 ">
              <div className="mb-4 ring-1 ring-gray-200 dark:ring-gray-900  rounded-md flex gap-4 justify-between">
                <div className="relative rounded-md shadow-sm w-full">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="h-5 w-5 text-gray-400 dark:text-gray-100" />
                  </div>
                  <input
                    type="text"
                    placeholder={dictionary.simPage.search_phone_numbers}
                    className="focus:ring-indigo-500 py-2 dark:text-gray-200 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="w-1/2 flex gap-4">
                  <div className="w-48">
                    <select
                      className="focus:ring-indigo-500 py-2 dark:text-gray-200 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md *:dark:bg-gray-600"
                      value={selectedCompany}
                      onChange={(e) => setSelectedCompany(e.target.value)}
                    >
                      <option value="">
                        {dictionary.simPage.all_companies}
                      </option>
                      {companyList?.map((company) => (
                        <option key={company} value={company}>
                          {company}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="w-48">
                    <select
                      className="focus:ring-indigo-500 py-2 dark:text-gray-200 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md *:dark:bg-gray-600"
                      value={selectedDealer}
                      onChange={(e) => setSelectedDealer(e.target.value)}
                    >
                      <option value="">{dictionary.simPage.all_dealers}</option>
                      {dealerList?.map((dealer) => (
                        <option key={dealer} value={dealer}>
                          {dealer}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <PhoneNumberTable
                phoneNumbers={filteredPhoneNumbers}
                dictionary={dictionary}
                lang={lang}
              />
            </div>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <AddPhoneNumberModal
          dictionary={dictionary}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
