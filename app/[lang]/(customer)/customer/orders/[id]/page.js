import React from "react";
import { fetchData } from "@/db/db";
import { Calendar } from "lucide-react";
import { PlaneLanding } from "lucide-react";
import CartTable from "../../carts/components/CartTable";
import DownloadPdf from "../../components/DownloadPdf";
import BackButton from "../../components/ui/BackButton";
import ShowTimeline from "../_components/OrderShowTimeline";
import OrderDetails from "../_components/OrderDetails";
import { getDictionary } from "@/app/[lang]/dictionary";
const getStatusColor = (status) => {
  const colors = {
    Pending: "bg-yellow-100 text-yellow-800",
    Confirmed: "bg-blue-100 text-blue-800",
    Shipped: "bg-purple-100 text-purple-800",
    Delivered: "bg-green-100 text-green-800",
    Cancelled: "bg-red-100 text-red-800",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
};
export default async function OrderPage({ params }) {
  const order = await fetchData("/shop/orders/" + params?.id);

  const {lang} = params;
  const dictionary = await getDictionary(lang);
  return (
    <div className="w-full p-6 min-w-[80rem] relative space-y-5">
      <BackButton />
      {/* <header className="relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-sm p-6 mb-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-100 to-transparent dark:from-blue-900/20 rounded-full -translate-y-32 translate-x-32" />

        <div className="relative">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Order #{order?.orderNumber}
          </h1>

          <div className="flex flex-wrap items-center mt-4 gap-4">
            <span
              className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(
                order?.status
              )}`}
            >
              {order?.status}
            </span>
            <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {order?.createdAt?.slice(0, 10)}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Created by:{" "}
              <span className="font-medium">{order?.user?.name}</span>
            </p>
          </div>
        </div>
      </header>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm ">
        <CartTable dictionary={dictionary} carts={{ items: order?.OrderItem }} page="order" />
      </div>

      <ShowTimeline order={order} /> */}
{/* 
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-medium mb-4 text-gray-900 dark:text-gray-100">
            Order Summary
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between py-2">
              <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
              <span className="font-medium">{order?.subtotal} €</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600 dark:text-gray-400">
                Shipping Cost
              </span>
              <span className="font-medium">{order?.shippingCost} €</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600 dark:text-gray-400">VAT</span>
              <span className="font-medium">{order?.tax} €</span>
            </div>
            <div className="flex justify-between py-3 border-t border-gray-200 dark:border-gray-700">
              <span className="font-medium text-gray-900 dark:text-gray-100">
                Total
              </span>
              <span className="font-bold text-lg">{order?.total} €</span>
            </div>
          </div>
        </div>


        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-medium mb-4 text-gray-900 dark:text-gray-100">
            Order Details
          </h2>
          <div className="grid gap-4">
            {[
              {
                label: "Payment Method",
                value: order?.paymentMethod,
                type: "text",
              },
              {
                label: "Payment Document",
                value: order?.paymentProof,
                type: "document",
              },
              {
                label: "Payment Date",
                value: order?.paymentDate,
                type: "text",
              },
              {
                label: "Payment Confirmation",
                value: order?.paymentConfirmationDate,
                type: "text",
              },
              {
                label: "Delivery Date",
                value: order?.deliveryDate,
                type: "text",
              },
              {
                label: "Delivery Document",
                value: order?.deliveryProof,
                type: "document",
              },
              { label: "Remarks", value: order?.remarks, type: "text" },
            ].map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50"
              >
                <span className="text-gray-600 dark:text-gray-400">
                  {item.label}
                </span>
                {item.type === "document" ? (
                  <DownloadPdf link={item.value} title="Download" />
                ) : (
                  <span className="font-medium capitalize">
                    {item.value || "N/A"}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div> */}

      <OrderDetails dictionary={dictionary} order={order} />
    </div>
  );
}
