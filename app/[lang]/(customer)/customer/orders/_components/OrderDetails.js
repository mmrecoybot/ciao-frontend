"use client";
import React from "react";
import { format } from "date-fns";
import {
  Package,
  Truck,
  CreditCard,
  Calendar,
  User,
  Mail,
  Clock,
} from "lucide-react";
import {  CheckCircle, AlertCircle, } from 'lucide-react';
const statusColors = {
  pending: 'from-yellow-500 to-yellow-600',
  processing: 'from-blue-500 to-blue-600',
  shipped: 'from-indigo-500 to-indigo-600',
  delivered: 'from-green-500 to-green-600',
};
export default function OrderDetails({ order, dictionary }) {
   // Get the gradient classes based on the status
   const gradientClass = statusColors[order.status] || 'from-gray-500 to-gray-600';
  return (
    <div className=" mx-auto p-6 space-y-8">
      {/* Header Section */}
      <div className={`bg-gradient-to-r ${gradientClass} rounded-2xl p-6 text-white shadow-xl`}>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">{order.orderNumber}</h1>
            <div className="flex items-center mt-2 space-x-4">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {format(new Date(order.createdAt), "MMM dd, yyyy")}
              </span>
              <span
                className={`px-4 py-1 rounded-full text-sm font-medium capitalize
                          ${
                            order.status === "pending"
                              ? "bg-yellow-400 text-yellow-900"
                              : order.status === "processing"
                              ? "bg-orange-400 text-orange-900"
                              : order.status === "shipped"
                              ? "bg-pink-400 text-blue-900"
                              : order.status === "delivered"
                              ? "bg-green-400 text-green-900"
                              : "bg-gray-400 text-gray-900"
                          }`}
              >
                {order.status}
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">€{order.total}</p>
            <p className="text-sm opacity-80">{dictionary.orderPages.total_amount}</p>
          </div>
        </div>
      </div>

      {/* Customer Info & Payment Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            {dictionary.orderPages.customer_details}
          </h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
              <User className="w-5 h-5" />
              <span>{order.user.name}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
              <Mail className="w-5 h-5" />
              <span>{order.user.email}</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            {dictionary.orderPages.payment_information}
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-gray-600 dark:text-gray-300">
              <span className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                {dictionary.activationsPages.payment_method}
              </span>
              <span className="font-medium">{order.paymentMethod}</span>
            </div>
            <div className="flex items-center justify-between text-gray-600 dark:text-gray-300">
              <span>{dictionary.orderPages.subtotal}</span>
              <span>€{order.subtotal}</span>
            </div>
            <div className="flex items-center justify-between text-gray-600 dark:text-gray-300">
              <span>{dictionary.ordersPages.tax}</span>
              <span>€{order.tax}</span>
            </div>
            <div className="flex items-center justify-between text-gray-600 dark:text-gray-300">
              <span>{dictionary.orderPages.shipping}</span>
              <span>€{order.shippingCost}</span>
            </div>
            <div className="border-t pt-2 flex items-center justify-between font-semibold text-gray-900 dark:text-white">
              <span>{dictionary.orderPages.total}</span>
              <span>€{order.total}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold p-6 border-b dark:border-gray-700 text-gray-900 dark:text-white">
          {dictionary.orderPages.order_items}
        </h2>
        <div className="divide-y dark:divide-gray-700">
          {order.OrderItem.map((item) => (
            <div key={item.id} className="p-6 flex items-center gap-6">
              <img
                src={item.img}
                alt={item.product.name}
                className="w-24 h-24 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 dark:text-white capitalize">
                  {item.product.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {dictionary.ordersPages.code}: {item.product.product_code}
                </p>
                <div className="mt-2 flex items-center gap-4">
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {dictionary.productsPages.color}: {item.color}
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                    {dictionary.ordersPages.qty}: {item.quantity}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900 dark:text-white">
                  €{Number(item.price).toFixed(2)}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {dictionary.ordersPages.per_unit}
                </p>
              </div>

              <div className="text-right">
                <p className="font-medium text-gray-900 dark:text-white">
                 x{item.quantity}
                </p>
              </div>

              <div className="text-right">
                <p className="font-medium text-gray-900 dark:text-white">
                €{Number(item.quantity * item.price).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Timeline */}
      {/* <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          Order Timeline
        </h2>
        <div className="space-y-4">
          {order.OrderStatusHistory.map((history) => (
            <div key={history.id} className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <Clock className="w-4 h-4 text-blue-600 dark:text-blue-300" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white capitalize">
                  {history.status}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {history.remarks}
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  {format(new Date(history.changedAt), "MMM dd, yyyy HH:mm")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div> */}
      <OrderTimeline dictionary={dictionary} order={order} />
    </div>
  );
}




const OrderTimeline = ({ order, dictionary }) => {

  // Icon mapping based on status
  const statusIcons = {
    pending: <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-300" />,
    processing: <Clock className="w-4 h-4 text-blue-600 dark:text-blue-300" />,
    shipped: <Truck className="w-4 h-4 text-indigo-600 dark:text-indigo-300" />,
    delivered: <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-300" />,
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
        {dictionary.ordersPages.order_timeline}
      </h2>
      <div className={"space-y-2"}>
        {order.OrderStatusHistory.map((history) => (
          <div key={history.id} className={`flex items-start gap-4  p-2 rounded-xl        ${
          history.status === "delivered"
            ? "bg-green-100/50 dark:bg-green-900/50"
            : history.status === "shipped"
            ? "bg-indigo-100/50 dark:bg-indigo-900/50"
            : history.status === "processing"
            ? "bg-blue-100/50 dark:bg-blue-900/50"
            : "bg-yellow-100/50 dark:bg-yellow-900/50"
        }`}>
            {/* Status Icon */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                history.status === 'delivered'
                  ? 'bg-green-100 dark:bg-green-900'
                  : history.status === 'shipped'
                  ? 'bg-indigo-100 dark:bg-indigo-900'
                  : history.status === 'processing'
                  ? 'bg-blue-100 dark:bg-blue-900'
                  : 'bg-yellow-100 dark:bg-yellow-900'
              }`}
            >
              {statusIcons[history.status]}
            </div>

            {/* Status Details */}
            <div className="flex-1">
              <p className="font-medium text-gray-900 dark:text-white capitalize">
                {history.status}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {history.remarks}
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                {new Date(history.changedAt).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                })}
              </p>
            </div>

            {/* Checked Status Indicator */}
            {history.status === 'delivered' && (
              <div className="text-green-600 dark:text-green-300">
                <CheckCircle className="w-5 h-5" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

