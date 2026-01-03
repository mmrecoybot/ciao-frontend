"use client"

import { useUpdateOrderMutation } from "@/store/slices/orderApi";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import SimpleImageUpload from "../../products/new/components/SimpleImageUpload";

export default function EditOrder({ orderData, setIsEdit, dictionary }) {
  const [order, setOrder] = useState(orderData || {});
  const [updateOrder, { isLoading, isSuccess }] = useUpdateOrderMutation();
  const [deliveryProof, setDeliveryProof] = useState(null);
  const [orderDocument, setOrderDocument] = useState(null);
  const [remarks, setRemarks] = useState("");

  // deliveryProof
  // orderDocument
  const handleSubmit = (e) => {
    e.preventDefault();

    // Include file if it's added when the order is delivered
    const updatedOrderData = {
      ...order,
      orderId: orderData.id,
      remarks,
      orderDocument,
      deliveryProof,
    };

    updateOrder(updatedOrderData);
  };

  useEffect(() => {
    if (isLoading) {
      toast.loading("Updating Order");
    }
    if (isSuccess) {
      toast.dismiss();
      toast.success("Order Updated");
      setOrderDocument(null);
      setDeliveryProof(null);
      setRemarks("");
      setIsEdit(false);
    }
  }, [orderData, isLoading, isSuccess]);

  return (
    <div className="fixed w-screen h-screen left-0 top-0 bg-black/20 z-20 text-start">
      <div className="absolute top-1/2 left-1/2 min-w-96 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 dark:text-gray-400 p-6 rounded-lg shadow-lg">
        <h2 className="text-lg font-medium mb-4">{dictionary.orderPages.edit_order}</h2>
        <form onSubmit={handleSubmit} className="text-start">
          <div className="mb-4">
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700 dark:text-gray-500"
            >
              {dictionary.orderPages.view}
            </label>
            <select
              id="status"
              name="status"
              className="block w-full text-sm font-medium text-gray-700 dark:text-gray-400 ring-1 rounded-md p-2 mb-2"
              value={order?.status}
              onChange={(e) => {
                setOrder({
                  ...order,
                  status: e.target.value,
                });
              }}
            >
              <option value="pending">{dictionary.orderPages.pending}</option>
              <option value="processing">{dictionary.orderPages.processing}</option>
              <option value="shipped">{dictionary.orderPages.shipped}</option>
              <option value="delivered">{dictionary.orderPages.delivered}</option>
              <option value="cancelled">{dictionary.orderPages.cancelled}</option>
            </select>
          </div>

          {/* Comments/Remarks */}
          <div className="mb-4">
            <label
              htmlFor="remarks"
              className="block text-sm font-medium text-gray-700 dark:text-gray-500"
            >
              {dictionary.orderPages.comments_or_remarks}
            </label>
            <textarea
              id="remarks"
              name="remarks"
              className="block w-full text-sm font-medium text-gray-700 dark:text-gray-400 ring-1 rounded-md p-2 mb-2"
              value={remarks}
              placeholder={dictionary.orderPages.enter_comments_or_remarks}
              onChange={(e) => {
                setRemarks(e.target.value);
              }}
            />
          </div>

          {/* File Upload when status is Delivered */}
          {order.status === "delivered" && (
            <div className="mb-4">
              <label
                htmlFor="file"
                className="block text-sm font-medium text-gray-700 dark:text-gray-500"
              >
                {dictionary.orderPages.upload_order_documents}
              </label>
              <SimpleImageUpload
                image={order?.documents}
                onImageChange={setOrderDocument}
                folder="orders/documents"
                dictionary={dictionary}
              />
              <label
                htmlFor="file"
                className="block text-sm font-medium text-gray-700 dark:text-gray-500"
              >
                {dictionary.orderPages.upload_delivery_proof_optional}
              </label>
              <SimpleImageUpload
                image={order?.deliveryProof}
                onImageChange={setDeliveryProof}
                folder="orders/deliveryProof"
                dictionary={dictionary}
              />
            </div>
          )}

          <div className="flex justify-end gap-4 mt-2">
            <button
              type="button"
              className="ml-2 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              onClick={() => {
                setOrder(orderData);
                setIsEdit(false);
              }}
            >
              {dictionary.activation.cancel}
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              {dictionary.dealerPages.save}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
