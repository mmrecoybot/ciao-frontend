"use client";

import React from "react";
import {
  Truck,
  CreditCard,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function ShowTimeline({ order }) {
  const getTimelineDescription = (status) => {
    switch (status) {
      case "pending":
        return order.OrderStatusHistory.find((history) => history.status === "pending")?.description;
      case "processing":
        return order.OrderStatusHistory.find((history) => history.status === "processing")?.description;
      case "shipped":
        return order.OrderStatusHistory.find((history) => history.status === "shipped")?.description;
      case "delivered":
        return order.OrderStatusHistory.find((history) => history.status === "delivered")?.description;
      default:
        return "N/A";
    }
  }

  const timelineEvents = [
    {
      date: order?.createdAt,
      title: "Order Created",
      icon: Clock,
      done: true,
      description: getTimelineDescription("pending"),
    },
    {
      date: order?.paymentConfirmationDate,
      title: "Payment Confirmed",
      icon: CreditCard,
      done: !!order?.paymentConfirmationDate,
      description: getTimelineDescription("processing"),
    },
    {
      date: order?.shippingDate,
      title: "Order Shipped",
      icon: FileText,
      done: !!order?.shippingDate,
      description: getTimelineDescription("shipped"),
    },
    {
      date: order?.deliveryDate,
      title: "Order Delivered",
      icon: Truck,
      done: !!order?.deliveryDate,
      description: getTimelineDescription("delivered"),
    },
  ];

  return (
    <div className="w-full bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-8 shadow-lg">
      <div className="relative">
        <div className="flex items-center space-x-6 overflow-x-auto pb-4 px-2 p-4 scrollbar-hide">
          {timelineEvents.map((event, index) => (
            <div
              key={index}
              className="flex flex-col items-center min-w-[220px] group"
            >
              <div className="relative flex items-center w-full">
                <div
                  className={`relative z-10 flex items-center justify-center w-14 h-14 rounded-full
                    transition-all duration-500 transform group-hover:scale-110
                    ${
                      event.done
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white ring-4 ring-blue-200"
                        : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-400 dark:from-gray-700 dark:to-gray-800"
                    }
                    shadow-lg`}
                >
                  <event.icon className="w-7 h-7" />
                  <div
                    className={`absolute -right-1 -top-1 w-5 h-5 rounded-full 
                    ${
                      event.done
                        ? "bg-green-500"
                        : "bg-gray-300 dark:bg-gray-600"
                    }
                    transform transition-all duration-500 group-hover:scale-110`}
                  >
                    {event.done ? (
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-gray-500" />
                    )}
                  </div>
                </div>

                {index < timelineEvents.length - 1 && (
                  <div className="flex-1 h-1 mx-4">
                    <div
                      className={`h-full rounded-full transition-all duration-500
                        ${
                          event.done
                            ? "bg-gradient-to-r from-blue-500 to-blue-600"
                            : "bg-gray-200 dark:bg-gray-700"
                        }`}
                    />
                  </div>
                )}
              </div>

              <div className={`mt-6 text-center w-full transform transition-all duration-300  ${event.done ? " group-hover:-translate-y-1" : "opacity-50"}`}>
                <div
                  className={`bg-white dark:bg-gray-800 rounded-xl p-4
                  shadow-md hover:shadow-xl transition-all duration-300
                  border border-gray-100 dark:border-gray-700`}
                >
                  <p className="font-semibold text-gray-900 dark:text-gray-100 text-lg">
                    {event.title}
                  </p>
                  <p className="text-sm text-blue-500 dark:text-blue-400 font-medium mt-1">
                    {event.date
                      ? new Date(event.date).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "numeric",
                          minute: "numeric",
                        })
                      : "Pending"}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 font-medium">
                    {event.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-white dark:from-gray-800 to-transparent w-12 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 bg-gradient-to-l from-white dark:from-gray-800 to-transparent w-12 pointer-events-none" />
      </div>
    </div>
  );
}
