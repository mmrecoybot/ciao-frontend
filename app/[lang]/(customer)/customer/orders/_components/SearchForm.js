"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import { IoReloadSharp } from "react-icons/io5";

export function SearchForm({ dictionary, onSearch }) {
  const [formState, setFormState] = useState({
    orderNumber: "",
    createdDate: "",
    escapeDate: "",
    orderStatus: "",
  });

  const handleSearch = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleReset = () => {
    const emptyState = {
      orderNumber: "",
      createdDate: "",
      escapeDate: "",
      orderStatus: "",
    };
    setFormState(emptyState);
    onSearch(emptyState);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(formState);
  };

  return (
    <form onSubmit={handleSubmit} onReset={handleReset}>
      <div className="grid gap-6 px-4 lg:grid-cols-3">
        <div className="space-y-4">
          <div className="relative">
            <label className="text-sm text-gray-500">{dictionary.ordersPages.order_number}</label>
            <input
              onChange={handleSearch}
              name="orderNumber"
              value={formState.orderNumber}
              type="text"
              placeholder={dictionary.ordersPages.order_number}
              className="w-full rounded-md border dark:border-gray-300 dark:bg-gray-800 dark:text-gray-500 border-gray-300 px-8 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <label className="text-sm text-gray-500">{dictionary.ordersPages.created_date}</label>
            <input
              onChange={handleSearch}
              name="createdDate"
              value={formState.createdDate}
              type="date"
              placeholder={dictionary.ordersPages.created_date}
              className="w-full rounded-md border dark:border-gray-300 dark:bg-gray-800 dark:text-gray-500 border-gray-300 px-8 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          {/* <div className="relative">
            <label className="text-sm text-gray-500">End Date</label>
            <input
              onChange={handleSearch}
              name="dateTo"
              value={formState.escapeDate}
              type="date"
              placeholder="Escape Date"
              className="w-full rounded-md border dark:border-gray-300 dark:bg-gray-800 dark:text-gray-500 border-gray-300 px-8 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div> */}
        </div>

        <div className="space-y-5">
          <div>
            <label className="text-sm text-gray-500">{dictionary.ordersPages.order_status}</label>
            <select
              name="orderStatus"
              value={formState.orderStatus}
              onChange={handleSearch}
              className="w-full rounded-md border dark:border-gray-300 dark:bg-gray-800 dark:text-gray-500 border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="">{dictionary.ordersPages.select_the_order_status}</option>
              <option value="pending">{dictionary.orderPages.pending}</option>
              <option value="processing">{dictionary.orderPages.processing}</option>
              <option value="shipped">{dictionary.orderPages.shipped}</option>
              <option value="delivered">{dictionary.orderPages.delivered}</option>
              <option value="cancelled">{dictionary.ordersPages.cancelled}</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex flex-1 items-center justify-center gap-2 rounded-md bg-emerald-200 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <Search />
              {dictionary.ordersPages.search}
            </button>
            <button
              type="reset"
              className="flex flex-1 items-center justify-center gap-2 rounded-md border dark:border-gray-300 dark:bg-gray-800 dark:text-gray-500 border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <IoReloadSharp />
              {dictionary.ordersPages.reset}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
