"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

function PaginationWrapper({ data, itemsPerPage, children }) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getPageNumbers = () => {
    if (totalPages <= 5) {
      return [...Array(totalPages)].map((_, index) => index + 1);
    }
    let pages = [1];
    if (currentPage > 3) {
      pages.push("...");
    }
    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) {
      pages.push("...");
    }
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div>
      {children(paginatedData)}
      {totalPages > 1 && (<div className="flex justify-between items-center p-2">
        <p>
          Showing {currentPage * itemsPerPage - itemsPerPage + 1} to{" "}
          {Math.min(currentPage * itemsPerPage, data.length)} of{" "}
          {data.length}
        </p>
        <div className="flex justify-center mt-4 space-x-2 uppercase dark:text-gray-800 ">
          <button
            className={`px-3 py-1 flex items-center gap-2 justify-center text-white rounded ${
              currentPage === 1
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-700"
            }`}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {getPageNumbers().map((page, index) => (
            <button
              key={index}
              className={`px-3 py-1 rounded ${
                currentPage === page
                  ? "bg-blue-700 text-white dark:bg-blue-500 "
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              onClick={() => typeof page === "number" && setCurrentPage(page)}
              disabled={page === "..."}
            >
              {page}
            </button>
          ))}

          <button
            className={`px-3 py-1 text-white gap-2  flex items-center justify-center rounded ${
              currentPage === totalPages
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-700"
            }`}
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <div></div>
      </div>)}
    </div>
  );    
}

export default PaginationWrapper;
