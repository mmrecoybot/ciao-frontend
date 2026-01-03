"use client";

import { useFetchCompaniesQuery } from "@/store/slices/companyApi";
import { useState } from "react";
import { AiOutlinePlus, AiOutlineSearch } from "react-icons/ai";
import { RiHomeOfficeFill } from "react-icons/ri";

import Error from "../components/Error";
import Loading from "../components/Loading";
import NoDataFound from "../components/NoDataFound";
import RelativeModal from "../components/RelativeModal";
import CompanyForm from "./_componenets/CompanyForm";
import SingeCompany from "./_componenets/SingeCompany";
import Pagination from "../components/Pagination";

const CompanyPage = ({ dictionary, lang }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const {
    data: companies,
    error,
    isError,
    isLoading,
  } = useFetchCompaniesQuery();

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const filteredCompanies =
    companies?.filter((company) =>
      company.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCompanies = filteredCompanies.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loading />
      </div>
    );
  }

  if (error) {
    return <Error error={error.error} />;
  }

  return (
    <div className="p-6 pb-16 space-y-6 container mx-auto">
      {/* Header */}
      <div className="bg-emerald-200 dark:bg-emerald-900 p-4 rounded-lg shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3 text-2xl font-bold text-gray-800 dark:text-white">
          <RiHomeOfficeFill size={40} />
          {dictionary.companyPages.company}
        </div>
        <button
          onClick={toggleModal}
          className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition"
        >
          <AiOutlinePlus className="mr-2" />
          {dictionary.companyPages.add_company}
        </button>
      </div>

      {/* Modal */}
      {isOpen && (
        <RelativeModal setShowForm={toggleModal} title={dictionary.companyPages.add_company}>
          <CompanyForm setShowForm={toggleModal} dictionary={dictionary} />
        </RelativeModal>
      )}

      {/* Search */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <div className="relative">
          <AiOutlineSearch className="absolute top-3 left-3 text-gray-400" />
          <input
            type="text"
            placeholder={dictionary.companyPages.search_company}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Table */}
      {filteredCompanies.length === 0 ? (
        <NoDataFound title={dictionary.companyPages.company} />
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-x-auto">
          <div className="max-h-[65vh] overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
              <thead className="bg-gray-100 dark:bg-gray-700 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3 font-medium text-gray-600 dark:text-gray-300 uppercase">#</th>
                  <th className="px-6 py-3 font-medium text-gray-600 dark:text-gray-300 uppercase">{dictionary.customerComponents.logo}</th>
                  <th className="px-6 py-3 font-medium text-gray-600 dark:text-gray-300 uppercase">{dictionary.customerComponents.title}</th>
                  <th className="px-6 py-3 font-medium text-gray-600 dark:text-gray-300 uppercase">{dictionary.tariffPages.description}</th>
                  <th className="px-6 py-3 text-right font-medium text-gray-600 dark:text-gray-300 uppercase">{dictionary.activation.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedCompanies.map((company, i) => (
                  <SingeCompany
                    key={company.id}
                    company={company}
                    i={startIndex + i}
                    dictionary={dictionary}
                    lang={lang}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};

export default CompanyPage;
