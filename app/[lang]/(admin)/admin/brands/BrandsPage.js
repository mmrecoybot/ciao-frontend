"use client";

import { useFetchBrandsQuery } from "@/store/slices/brandApi";
import { useState } from "react";
import { AiOutlinePlus, AiOutlineSearch } from "react-icons/ai";
import Error from "../components/Error";
import Loading from "../components/Loading";
import NoDataFound from "../components/NoDataFound";
import RelativeModal from "../components/RelativeModal";
import BrandForm from "./_componenets/BrandForm";
import SingeBrand from "./_componenets/SingeBrand";
import { Apple } from "lucide-react";
import Pagination from "../components/Pagination";

const BrandsPage = ({ dictionary, lang }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data: brands, error, isError, isLoading } = useFetchBrandsQuery();

  const toggleModal = () => setIsOpen(!isOpen);

  const filteredBrands = brands?.filter((brand) =>
    brand?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalItems = filteredBrands?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedBrands = filteredBrands?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (isLoading) {
    return (
      <div className="m-auto w-full h-[50vh]">
        <Loading />
      </div>
    );
  }

  if (error) {
    console.log(error);
    return <Error error={error?.error} />;
  }

  return (
    <div className="p-6 space-y-6 w-full pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-emerald-100 p-4 px-5 rounded-xl text-gray-600">
        <h1 className="text-2xl font-bold text-gray-600 flex items-center gap-2">
          <Apple size={50} />
          {dictionary.brandsPages.brands}
        </h1>
        <button
          onClick={toggleModal}
          className="inline-flex items-center px-4 py-2 bg-emerald-500 dark:bg-emerald-800 text-white dark:text-gray-400 font-medium rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors"
        >
          <AiOutlinePlus className="w-4 h-4 mr-2" />
          {dictionary.brandsPages.add_brand}
        </button>

        {isOpen && (
          <RelativeModal setShowForm={toggleModal} title="Add Brand">
            <BrandForm setShowForm={toggleModal} dictionary={dictionary} />
          </RelativeModal>
        )}
      </div>

      {/* Search */}
      <div className="rounded-lg shadow">
        <div className="p-6">
          <div className="relative">
            <AiOutlineSearch className="absolute top-3 left-4 text-gray-400" />
            <input
              type="text"
              placeholder={dictionary.brandsPages.search_brands}
              className="pl-10 w-full rounded-lg border dark:bg-inherit dark:text-gray-500 border-gray-300 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // Reset to page 1 on search
              }}
            />
          </div>
        </div>
      </div>

      {filteredBrands?.length === 0 ? (
        <NoDataFound title="Brands" />
      ) : (
        <div className="rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-600">
              {dictionary.tariffPages.brand_list}
            </h2>
          </div>
          <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {dictionary.personalDataPage.name}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {dictionary.tariffPages.description}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {dictionary.activation.actions}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedBrands?.map((brand, i) => (
                  <SingeBrand
                    key={brand?.id}
                    brand={brand}
                    i={(currentPage - 1) * itemsPerPage + i}
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

export default BrandsPage;
