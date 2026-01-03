import PaginationWrapper from "@/app/[lang]/components/PAginationWrapper";
import React from "react";

export default function OrderTable({ user, dictionary }) {
  return (
    <PaginationWrapper data={user.Order} itemsPerPage={10}>
      {(paginatedData) => (
        <table className="min-w-full dark:bg-gray-700 dark:text-gray-200">
          <thead>
            <tr className="dark:bg-gray-600">
              <th className="px-4 py-2">
                {dictionary.ordersPages.order_number}
              </th>
              <th className="px-4 py-2">{dictionary.ordersPages.total}</th>
              <th className="px-4 py-2">{dictionary.ordersPages.status}</th>
              <th className="px-4 py-2">{dictionary.orderPages.date}</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((order, orderIndex) => (
              <tr
                key={orderIndex}
                className="border-b border-gray-600 text-center"
              >
                <td className="px-4 py-2">{order.orderNumber}</td>
                <td className="px-4 py-2">
                  €{Number.parseFloat(order.total).toFixed(2)}
                </td>
                <td
                  className={`px-4 py-2 ${
                    order.status === "delivered"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {order.status}
                </td>
                <td className="px-4 py-2">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </PaginationWrapper>
  );
}
