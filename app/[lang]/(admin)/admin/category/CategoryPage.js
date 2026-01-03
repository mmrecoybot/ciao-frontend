"use client";

import { useFetchCategoriesQuery } from "@/store/slices/CategoryApi";
import { useState, useRef, useEffect } from "react";
import {
  AiOutlineAppstore,
  AiOutlinePlus,
  AiOutlineSearch,
} from "react-icons/ai";
import Error from "../components/Error";
import Loading from "../components/Loading";
import NoDataFound from "../components/NoDataFound";
import RelativeModal from "../components/RelativeModal";
import CategoryForm from "./_components/CategoryForm";
import SingeCategory from "./_components/SingeCategory";
import Pagination from "../components/Pagination";

const ITEMS_PER_PAGE = 10;

const CategoryPage = ({ dictionary, lang }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const tableRef = useRef(null);

  const { data: categories, error, isError, isLoading } =
    useFetchCategoriesQuery();

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  // Filtered categories
  const filteredCategories = categories?.filter((category) =>
    category?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil((filteredCategories?.length || 0) / ITEMS_PER_PAGE);

  const paginatedCategories = filteredCategories?.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Scroll to table when page changes
  useEffect(() => {
    if (tableRef.current) {
      tableRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentPage]);

  if (isLoading) {
    return (
      <div className="m-auto w-full h-[50vh]">
        <Loading />
      </div>
    );
  }

  if (error) {
    return <Error error={error?.error} />;
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 text-gray-500 min-h-screen w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-emerald-100 p-4 px-5 rounded-xl">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <AiOutlineAppstore size={50} />
          {dictionary.categoryPages.categories}
        </h1>
        <button
          onClick={toggleModal}
          className="inline-flex items-center px-4 py-2 bg-emerald-200 text-blue-800 font-medium rounded-lg hover:bg-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors"
        >
          <AiOutlinePlus className="w-4 h-4 mr-2" />
          {dictionary.categoryPages.add_category}
        </button>
        {isOpen && (
          <RelativeModal setShowForm={toggleModal} title={dictionary.categoryPages.add_category}>
            <CategoryForm setShowForm={toggleModal} dictionary={dictionary} />
          </RelativeModal>
        )}
      </div>

      {filteredCategories?.length === 0 ? (
        <NoDataFound title="Categories" />
      ) : (
        <>
          <div className="bg-white dark:bg-gray-950 rounded-lg shadow">
            {/* Search */}
            <div className="p-6">
              <div className="relative">
                <AiOutlineSearch className="absolute top-3 left-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={dictionary.categoryPages.search_categories}
                  className="pl-10 w-full bg-inherit rounded-lg border border-gray-300 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1); // Reset to first page when searching
                  }}
                />
              </div>
            </div>
          </div>

          {/* Categories Table */}
          <div
            className="bg-white dark:bg-gray-900 rounded-lg shadow"
            ref={tableRef}
          >
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-500">
                {dictionary.categoryPages.category_list}
              </h2>
            </div>
            <div className="overflow-x-auto">
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
                  {paginatedCategories.map((category, i) => (
                    <SingeCategory
                      key={category?.id}
                      category={category}
                      i={(currentPage - 1) * ITEMS_PER_PAGE + i}
                      dictionary={dictionary}
                      lang={lang}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination Controls */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        </>
      )}
    </div>
  );
};

export default CategoryPage;
