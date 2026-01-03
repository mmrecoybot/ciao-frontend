"use client";

import { useFetchSubCategoriesQuery } from "@/store/slices/subCategoryApi";
import { useState } from "react";
import {
  AiOutlineAppstore,
  AiOutlinePlus,
  AiOutlineSearch,
} from "react-icons/ai";
import Error from "../../components/Error";
import Loading from "../../components/Loading";
import NoDataFound from "../../components/NoDataFound";
import RelativeModal from "../../components/RelativeModal";
import SingeSubCategory from "./_components/SingleSubCategory";
import SubCategoryForm from "./_components/SubCategoryForm";
import Pagination from "../../components/Pagination";

const SubCategoryPage = ({ dictionary, lang }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const {
    data: subCategories,
    error,
    isError,
    isLoading,
    isSuccess,
  } = useFetchSubCategoriesQuery();

  const toggleModal = () => setIsOpen(!isOpen);

  const filteredSubCategories = subCategories?.filter((subCategory) =>
    subCategory?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(
    (filteredSubCategories?.length || 0) / itemsPerPage
  );
  const paginatedSubCategories = filteredSubCategories?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  if (isLoading) {
    return (
      <div className="m-auto w-full h-[50vh]">
        <Loading />
      </div>
    );
  }

  if (error) {
    console.log(error);
    return <Error error={error.error} />;
  }

  return (
    <div className="p-6 space-y-6 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-emerald-100 to-emerald-200 p-4 px-5 rounded-xl">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <AiOutlineAppstore size={50} />
          {dictionary.categoryPages.sub_category}
        </h1>
        <button
          onClick={toggleModal}
          className="inline-flex items-center px-4 py-2 bg-emerald-300 text-blue-800 font-medium rounded-lg hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors"
        >
          <AiOutlinePlus className="w-4 h-4 mr-2" />
          {dictionary.categoryPages.add_sub_category}
        </button>

        {isOpen && (
          <RelativeModal
            setShowForm={toggleModal}
            title={dictionary.categoryPages.add_sub_category}
          >
            <SubCategoryForm
              setShowForm={toggleModal}
              dictionary={dictionary}
            />
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
                setCurrentPage(1); // Reset to first page on search
              }}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      {filteredSubCategories?.length === 0 ? (
        <NoDataFound title={dictionary.categoryPages.sub_category} />
      ) : (
        <div className="rounded-lg shadow pb-10">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-600">
              {dictionary.categoryPages.sub_category_list}
            </h2>
          </div>

          <div className="overflow-x-auto max-h-[500px] overflow-y-scroll">
            <table className="w-full min-w-[800px]">
              <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {dictionary.personalDataPage.name}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {dictionary.tariffPages.description}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {dictionary.productsPages.category}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {dictionary.activation.actions}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedSubCategories.map((subCategory, i) => (
                  <SingeSubCategory
                    key={subCategory.id}
                    subCategory={subCategory}
                    i={i + (currentPage - 1) * itemsPerPage}
                    dictionary={dictionary}
                    lang={lang}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
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

export default SubCategoryPage;
