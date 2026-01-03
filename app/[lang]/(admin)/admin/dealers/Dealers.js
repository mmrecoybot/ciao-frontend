"use client";

import { AiOutlinePlus, AiOutlineSearch } from "react-icons/ai";
import NoDataFound from "../components/NoDataFound";
import SingleDealers from "./_components/SingleDealers";
import Link from "next/link";

import { useFetchDealersQuery } from "@/store/slices/dealerApi";
import { useState } from "react";
import { Handshake } from "lucide-react";
import Loading from "../components/Loading";
import Pagination from "../components/Pagination";

function Dealers({ params: { lang }, dictionary }) {
  const [dealerSearchQuery, setDealerSearchQuery] = useState("");
  const { data: dealers, isLoading, isError } = useFetchDealersQuery();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const filteredDealers = dealers?.filter(
    (dealer) =>
      dealer?.companyName
        .toLowerCase()
        .includes(dealerSearchQuery.toLowerCase()) ||
      dealer?.adminPhone
        .toLowerCase()
        .includes(dealerSearchQuery.toLowerCase()) ||
      dealer?.adminEmail
        .toLowerCase()
        .includes(dealerSearchQuery.toLowerCase()) ||
      dealer?.adminEmail.toLowerCase().includes(dealerSearchQuery.toLowerCase())
  );
  const totalPages = Math.ceil(filteredDealers?.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const paginatedDealers = filteredDealers?.slice(startIdx, endIdx);

  const handleSearchChange = (event) => {
    setDealerSearchQuery(event.target.value);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return (
      <p>
        {dictionary.dealersPage.something_went_wrong_while_fetching_dealers}.
      </p>
    );
  }

  return (
    <main className="w-full h-full overflow-hidden relative ">
      <div className="p-6 space-y-6 w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-emerald-200 p-4 rounded-lg shadow">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Handshake size={50} />
            {dictionary.dealersPage.dealers_information}
          </h1>
          <Link
            href={"/admin/dealers/new"}
            className="inline-flex items-center px-4 py-2 bg-emerald-600 dark:bg-emerald-800 text-white dark:text-gray-400 font-medium rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors"
          >
            <AiOutlinePlus className="w-4 h-4 mr-2" />
            {dictionary.dealersPage.create_dealers}
          </Link>
        </div>

        {/* Search and Select User Role*/}
        <section className="rounded-lg shadow grid grid-cols-12 gap-6 p-6 ">
          <div className="col-span-9">
            <div className="relative">
              <AiOutlineSearch className="absolute top-3 left-4 text-gray-400" />
              <input
                type="text"
                placeholder={dictionary.dealersPage.search_dealers}
                className="pl-10 w-full rounded-md border border-gray-300 py-2 px-4 outline-none transition-all duration-300 focus:border-blue-500"
                value={dealerSearchQuery}
                onChange={handleSearchChange}
              />
            </div>
          </div>
        </section>

        <div className="h-[70vh] overflow-y-auto">
          {paginatedDealers?.length === 0 ? (
            <NoDataFound title={dictionary.dealersPage.dealers} />
          ) : (
            <div className=" rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200 sticky top-0 bg-white dark:bg-gray-800">
                <h2 className="text-lg font-semibold text-gray-600">
                  {dictionary.dealersPage.dealers_list}
                </h2>
              </div>
              <div className="">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800 sticky top-0 ">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {dictionary.dealersPage.dealers_id}
                      </th>

                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {dictionary.dealersPage.company_name}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {dictionary.loginPage.email}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {dictionary.dealersPage.phone_number}
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {dictionary.activation.actions}
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200">
                    {paginatedDealers?.map((dealer, ind) => (
                      <SingleDealers
                        key={ind}
                        dealer={dealer}
                        dictionary={dictionary}
                        lang={lang}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </main>
  );
}

export default Dealers;
