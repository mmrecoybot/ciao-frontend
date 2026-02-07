import ImmersiveImageModal from "@/app/[lang]/components/ImmersiveImageModal";
import Link from "next/link";
import React from "react";
import EditButton from "./EditButton";
import Image from "next/image";
import OrderTimeline from "@/app/[lang]/(customer)/customer/orders/_components/OrderShowTimeline";

const SingleOrder = ({ order, lang, dictionary }) => {
  return (
    <div className="min-h-screen   dark:from-gray-900 dark:to-purple-900/40 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-8 pb-10">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {dictionary.orderPages.order} #{order.orderNumber}
          </h1>
          <span
            className={`px-4 py-2 rounded-full uppercase text-sm font-semibold ${
              order.status === "delivered"
                ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
            }`}
          >
            {order.status}
          </span>
        </header>

        {/* Order Details and Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Customer Info */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {dictionary.orderPages.customer_information}
            </h2>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {dictionary.personalDataPage.name}
              </p>
              <p className="font-medium text-gray-900 dark:text-white">
                {order.user.name}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {dictionary.dealerPages.email}
              </p>
              <p className="font-medium text-gray-900 dark:text-white">
                {order.user.email}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {dictionary.orderPages.order_date}
              </p>
              <p className="font-medium text-gray-900 dark:text-white">
                {formatDate(order.createdAt)}
              </p>
            </div>
          </div>

          {/* Delivery Details */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {dictionary.orderPages.delivery_details}
            </h2>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {dictionary.companyPages.company}
              </p>
              <p className="font-medium text-gray-900 dark:text-white">
                {order.user?.dealer?.companyName
                  ? order.user?.dealer?.companyName
                  : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {dictionary.orderPages.contact}
              </p>
              <p className="font-medium text-gray-900 dark:text-white">
                {order.user?.dealer?.companyName
                  ? order.user?.dealer?.companyName
                  : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {dictionary.orderPages.address}
              </p>
              <p className="font-medium text-gray-900 dark:text-white">
                {order.user?.dealer?.billingAddress
                  ? formatAddress(order.user?.dealer?.billingAddress)
                  : "N/A"}
              </p>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {dictionary.orderPages.order_summary}
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">
                  {dictionary.orderPages.subtotal}
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  ${order.subtotal}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">
                  {dictionary.ordersPages.tax}
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  ${order.tax}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">
                  {dictionary.orderPages.shipping}
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  ${order.shippingCost}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">
                  {dictionary.cartsPage.discount}
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  ${order.discount}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                <span className="font-semibold text-gray-900 dark:text-white">
                  {dictionary.orderPages.total}
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  ${order.total}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white p-6 bg-gray-50 dark:bg-gray-700">
            {dictionary.orderPages.order_items}
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {dictionary.activation.product}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {dictionary.orderPages.variation}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {dictionary.orderPages.quantity}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {dictionary.orderPages.price}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {dictionary.orderPages.total}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {order.OrderItem.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Image
                          width={48}
                          height={48}
                          src={item.variation.img || "/placeholder.svg"}
                          alt={item.product.name}
                          className="w-12 h-12 object-cover rounded-md mr-4"
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {item.product.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            <Link
                              href={`/${lang}/admin/products/${item.product.id}`}
                              className="hover:underline"
                            >
                              {dictionary.orderPages.view_product}
                            </Link>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {item.color}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      ${Number(item.price).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      ${(Number(item.price) * Number(item.quantity)).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment Details */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {dictionary.activation.payment_details}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {dictionary.activation.payment_method}
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {order.paymentMethod}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {dictionary.activation.payment_date}
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {formatDate(order.paymentDate)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {dictionary.orderPages.payment_confirmation_date}
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {formatDate(order.paymentConfirmationDate)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {dictionary.orderPages.shipping_date}
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {formatDate(order.shippingDate)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {dictionary.orderPages.delivery_date}
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {formatDate(order.deliveryDate)}
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {dictionary.dealerPages.documents}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <DocumentPreview
                  dictionary={dictionary}
                  title="Payment Proof"
                  url={order.paymentProof}
                />
                <DocumentPreview
                  dictionary={dictionary}
                  title="Delivery Proof"
                  url={order.deliveryProof}
                />
                <DocumentPreview
                  dictionary={dictionary}
                  title="Order Document"
                  url={order.orderDocument}
                />
              </div>
            </div>
          </div>
        </div>
        <OrderTimeline order={order} />
        {/* Edit Button */}
        <div className="flex justify-end relative">
          <EditButton
            dictionary={dictionary}
            order={order}
            title="Edit Order"
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-150 ease-in-out"
          />
        </div>
      </div>
    </div>
  );
};

export const DocumentPreview = ({ title, url, dictionary }) => (
  <div className="space-y-2">
    <h4 className="font-medium text-gray-900 dark:text-white">{title}</h4>
    {url ? (
      <div className="relative">
        <Image
          width={200}
          height={200}
          src={url || "/placeholder.svg"}
          alt={title}
          className="w-full h-32 object-cover rounded-lg shadow-sm"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-200 rounded-lg">
          <ImmersiveImageModal url={url} />
        </div>
      </div>
    ) : (
      <div className="w-full h-32 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400">
        {dictionary?.orderPages?.not_available}
      </div>
    )}
  </div>
);

export default SingleOrder;

function formatAddress(address) {
  if (!address || typeof address !== "object") return "";

  const parts = [
    `${address.number || ""} ${address.street || ""}`.trim(),
    address.municipality,
    address.province,
    address.zipCode,
    address.country,
  ].filter(Boolean); // removes falsy values like "", null, undefined

  return parts.length ? parts.join(", ") : "Not Available";
}

const formatDate = (date) => {
  return date ?? "Not available";
};
