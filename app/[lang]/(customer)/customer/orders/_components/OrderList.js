"use client";

import { useFetchOrdersByUserQuery } from "@/store/slices/orderApi";
import { Download, Eye } from "lucide-react";
import React, { useState } from "react";
import ProgressBar from "../../activation/components/ProgrssBar";
import { SearchForm } from "./SearchForm";
import Link from "next/link";
import Loading from "../../components/Loading";
import DownloadPdf from "../../components/DownloadPdf";
import { DownloadIcon } from "lucide-react";
import Pagination from "@/app/[lang]/(admin)/admin/components/Pagination";
// add pagination
export default function OrderList({ dictionary, user, lang }) {
  const [searchCriteria, setSearchCriteria] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 20;

  const {
    data: orders,
    isLoading,
    isError,
  } = useFetchOrdersByUserQuery(parseInt(user?.sub));

  const filteredOrders = React.useMemo(() => {
    if (!orders || !searchCriteria) return orders;

    return orders.filter((order) => {
      const matchesOrderNumber =
        !searchCriteria.orderNumber ||
        order.orderNumber
          .toLowerCase()
          .includes(searchCriteria.orderNumber.toLowerCase());

      const matchesCreatedDate =
        !searchCriteria.createdDate ||
        order.createdAt.split("T")[0] === searchCriteria.createdDate;

      const matchesStatus =
        !searchCriteria.orderStatus ||
        order.status.toLowerCase() === searchCriteria.orderStatus.toLowerCase();

      return matchesOrderNumber && matchesCreatedDate && matchesStatus;
    });
  }, [orders, searchCriteria]);

  const totalPages = Math.ceil(filteredOrders?.length / rowsPerPage);
  const paginatedOrders = React.useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return [...(filteredOrders || [])]
      .sort((a, b) => b?.createdAt > a?.createdAt ? 1 : -1)
      .slice(start, end);
  }, [filteredOrders, currentPage]);
  

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <div>{dictionary.ordersPages.error_loading_orders}</div>;
  }

  return (
    <div>
      <SearchForm dictionary={dictionary} onSearch={setSearchCriteria} />
      <div className="  mt-10">
        {/* <div className="bg-gray-100 dark:bg-gray-800 dark:text-gray-500 p-4 text-sm">
          {dictionary.navItems.orders}{" "}
          <span className="font-medium">1-{paginatedOrders?.length}</span> of{" "}
          <span className="font-medium">{orders?.length}</span>{" "}
          {dictionary.ordersPages.in_total}
        </div> */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className=" uppercase bg-blue-50 dark:bg-gray-700 dark:text-gray-500 text-left text-sm">
                <th className="whitespace-nowrap px-4 py-2 font-medium">
                  {dictionary.ordersPages.orders}
                </th>
                <th className="whitespace-nowrap px-4 py-2 font-medium">
                  {dictionary.ordersPages.date}
                </th>
                <th className="whitespace-nowrap px-4 py-2 font-medium">
                  {dictionary.ordersPages.total}
                </th>
                <th className="whitespace-nowrap px-4 py-2 font-medium">
                  {dictionary.ordersPages.status}
                </th>
                <th className="whitespace-nowrap px-4 py-2 font-medium">
                  {dictionary.activation.progress}
                </th>
                <th className="whitespace-nowrap px-4 py-2 font-medium">
                  {dictionary.activation.actions}
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders?.map((order, index) => (
                <tr
                  key={order.id}
                  className={
                    index % 2 === 0
                      ? "bg-white dark:bg-gray-800 dark:text-gray-500"
                      : "bg-blue-50 dark:bg-gray-700 dark:text-gray-500"
                  }
                >
                  <td className="whitespace-nowrap px-4 py-2 text-sm">
                    {order.orderNumber}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-sm">
                    {order.createdAt.split("T")[0]}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-sm">
                    {parseInt(order.total).toFixed(2)}€
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-sm capitalize">
                    <span
                      className={`px-4 py-1 rounded-full text-sm font-medium capitalize
                          ${
                            order.status === `pending`
                              ? "bg-yellow-400 text-yellow-900"
                              : order.status === `processing`
                              ? "bg-orange-400 text-orange-900"
                              : order.status === `shipped`
                              ? "bg-pink-400 text-blue-900"
                              : order.status === `delivered`
                              ? "bg-green-400 text-green-900"
                              : "bg-gray-400 text-gray-900"
                          }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-sm">
                    <ProgressBar progress={getProgress(order.status)} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-sm">
                    <div className="flex gap-2">
                      <Link
                        href={`/${lang}/customer/orders/${order.id}`}
                        className="rounded p-1 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <Eye size={16} />
                        {dictionary.productsPages.details}
                      </Link>
                      {order.status == "Delivered" && (
                        <button className="rounded p-1 hover:bg-gray-100 flex items-center gap-2">
                          <DownloadPdf
                            link={order.orderDocument}
                            Icon={DownloadIcon}
                            fileName={order.orderNumber}
                            className=""
                          />
                          {dictionary.ordersPages.download}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <Pagination
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
          />
        </div>
      </div>
    </div>
  );
}

const getProgress = (status) => {
  switch (status) {
    case "pending":
      return 40;
    case "processing":
      return 60;
    case "shipped":
      return 80;
    case "delivered":
      return 100;
    default:
      return 0;
  }
};
