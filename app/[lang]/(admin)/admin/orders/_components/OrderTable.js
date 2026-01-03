"use client";

import Link from "next/link";
import EditButton from "./EditButton";
import Pagination from "../../components/Pagination";

const getStatusStyle = (status) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "processing":
      return "bg-blue-100 text-blue-800";
    case "shipped":
      return "bg-green-100 text-green-800";
    case "delivered":
      return "bg-green-100 text-green-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function OrderTable({
  handleSort,
  sortConfig,
  orders,
  lang,
  dictionary,
  currentPage,
  totalPages,
  setCurrentPage,
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg pb-10 shadow-sm overflow-x-auto w-full">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort("id")}
            >
              <div className="flex items-center">
                {dictionary.orderPages.order_id}
                {sortConfig.key === "id" && (
                  <span className="ml-2">
                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </div>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {dictionary.orderPages.dealer_name}
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort("date")}
            >
              <div className="flex items-center">
                {dictionary.orderPages.date}
                {sortConfig.key === "date" && (
                  <span className="ml-2">
                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </div>
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort("total")}
            >
              <div className="flex items-center">
                {dictionary.orderPages.total}
                {sortConfig.key === "total" && (
                  <span className="ml-2">
                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </div>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {dictionary.orderPages.items}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {dictionary.activation.actions}
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200">
          {orders.map((order) => (
            <tr
              key={order.id}
              className="hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <td className="px-6 py-4 whitespace-nowrap font-medium">
                {order.orderNumber}
              </td>
              <td className={`px-6 py-4 whitespace-nowrap capitalize`}>
                {order.user.dealer?.companyName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {new Date(order.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                €{Number(order.total).toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {order.OrderItem.length}
              </td>
              <td>
                <span
                  className={`px-2 py-1 whitespace-nowrap rounded-full capitalize ${getStatusStyle(
                    order.status.toLowerCase()
                  )}`}
                >
                  {order.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex items-center">
                <Link
                  href={`/${lang}/admin/orders/${order.id}`}
                  className="text-blue-600 hover:text-blue-900 mr-4"
                >
                  {dictionary.orderPages.view}
                </Link>
                <EditButton dictionary={dictionary} order={order} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}
