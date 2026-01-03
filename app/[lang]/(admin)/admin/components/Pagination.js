import React from "react";

export default function Pagination({
  currentPage,
  totalPages,
  setCurrentPage,
}) {
  console.log(totalPages);

  if (totalPages <= 1) return null;
  return (
    <div className="flex justify-end items-center gap-2 px-4 py-3 border-t bg-gray-50 dark:bg-gray-700">
      <button
        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded border text-sm font-medium bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 disabled:opacity-50"
      >
        Prev
      </button>

      {[...Array(totalPages)].map((_, i) => (
        <button
          key={i}
          onClick={() => setCurrentPage(i + 1)}
          className={`px-3 py-1 rounded border text-sm font-medium ${
            currentPage === i + 1
              ? "bg-emerald-600 text-white"
              : "bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100"
          }`}
        >
          {i + 1}
        </button>
      ))}

      <button
        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded border text-sm font-medium bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}
