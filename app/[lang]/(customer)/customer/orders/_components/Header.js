"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import Categories from "./Categories";

const Header = ({ counts, lang, dictionary, category: initalCategory }) => {
  const pathname = usePathname();
  const { replace, push } = useRouter();
  const searchParams = useSearchParams();
  const [sortValue, setSortValue] = useState("default");
  const [showPrices, setShowPrices] = useState("no");
  const [category, setCategory] = useState(initalCategory);

  // Update URL parameters efficiently
  const updateURLParams = useCallback(() => {
    const params = new URLSearchParams(searchParams);

    // Update or delete parameters
    category
      && params.set("category", category)
      ;
    sortValue !== "default"
      ? params.set("sort", sortValue)
      : params.delete("sort");
    showPrices
      ? params.set("showPrices", showPrices)
      : params.delete("showPrices");
    replace(`${pathname}?${params.toString()}`);
  }, [category, sortValue, showPrices, pathname, replace, searchParams]);

  useEffect(() => {
    updateURLParams();
  }, [updateURLParams]);

  return (
    <header className="bg-emerald-100 dark:bg-gray-900 border-b px-4 lg:px-6">
      <div className="w-full mx-auto py-4">
        <div className="flex flex-col space-y-4 xl:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-gray-600 dark:text-gray-200 text-2xl font-semibold">
              {dictionary.ordersPages.orders}
            </h1>
          </div>

          <>
            <Categories
              categories={counts.categories}
              lang={lang}
              searchParams={searchParams}
              onCategoryChange={setCategory}
              selectedCategory={category}
              initalCategory={initalCategory}
            />
            <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
              <div className="flex items-center justify-between sm:justify-start gap-2">
                <span className="text-sm text-gray-600 whitespace-nowrap">
                  {dictionary.ordersPages.sorting}
                </span>
                <select
                  value={sortValue}
                  onChange={(e) => setSortValue(e.target.value)}
                  className="border rounded px-2 py-1 text-sm flex-grow sm:flex-grow-0 dark:border-gray-700 dark:text-gray-200 *:dark:bg-gray-900"
                >
                  <option value="default" >{dictionary.ordersPages.default}</option>
                  <option value="asc">A to Z</option>
                  <option value="desc">Z to A</option>
                  <option value="low-to-high">{dictionary.ordersPages.low_to_high}</option>
                  <option value="high-to-low">{dictionary.ordersPages.high_to_low}</option>
                </select>
              </div>
              <div className="flex items-center justify-between sm:justify-start gap-2">
                <span className="text-sm text-gray-600 whitespace-nowrap">
                  {dictionary.ordersPages.show_retail_prices}
                </span>
                <select
                  value={showPrices}
                  onChange={(e) => setShowPrices(e.target.value)}
                  className="border rounded px-2 py-1 text-sm flex-grow sm:flex-grow-0 dark:border-gray-700 dark:text-gray-200 *:dark:bg-gray-900"
                >
                  <option value="no">{dictionary.ordersPages.no}</option>
                  <option value="yes">{dictionary.ordersPages.yes}</option>
                </select>
              </div>
            </div>
          </>
        </div>
      </div>
    </header>
  );
};

export default Header;
