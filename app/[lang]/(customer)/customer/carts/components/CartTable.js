import React from "react";
import ActionButtons from "./ActionButtons";

export default function CartTable({
  carts,
  lang,
  handleAddItem,
  handleRemoveItem,
  handleDeleteItem,
  handleViewItem,
  page = "cart",
  dictionary
}) {
  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">{dictionary.ordersPages.code}</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">{dictionary.activation.product}</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">{dictionary.orderPages.quantity}</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">{dictionary.orderPages.price}</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">{dictionary.cartsPage.discount}</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">{dictionary.orderPages.total}</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">{dictionary.cartsPage.vat}</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">{dictionary.cartsPage.total_vat_included}</th>
              {page === "cart" && <th className="px-6 py-4"></th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {carts?.items?.map((item) => (
              <tr 
                key={item.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                  {item?.product?.product_code}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                  {item?.product?.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {item.quantity}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-700 dark:text-gray-300">
                  <span className="font-medium">{parseInt(item?.product?.dealer_price)?.toFixed(2)} €</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                  {item?.discount > 0 ? (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      {item?.discount}%
                    </span>
                  ) : (
                    <span className="text-gray-400 dark:text-gray-500">-</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900 dark:text-gray-100">
                  {(item?.product?.dealer_price * item.quantity)?.toFixed(2)} €
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                    {item?.vat || 0}%
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-gray-900 dark:text-gray-100">
                  {(parseInt(item?.product?.dealer_price) * parseInt(item?.quantity)).toFixed(2)} €
                </td>
                {page === "cart" && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <ActionButtons
                      item={item}
                      lang={lang}
                      handleAddItem={handleAddItem}
                      handleRemoveItem={handleRemoveItem}
                      handleDeleteItem={handleDeleteItem}
                      handleViewItem={handleViewItem}
                    />
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
