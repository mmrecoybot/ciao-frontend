"use client"

import React from "react";
import { useState } from "react";
import EditOrder from "./EditOrder";

export default function EditButton({ dictionary, order, className = "text-gray-600 hover:text-gray-900", title = `${dictionary.dealerPages.edit}` }) {
  const [isEdit, setIsEdit] = useState(false);

  if (order.status === "cancelled" || order.status === "delivered") {
    return null;
  }
  return (
    <div>
      <button
        className={` ${className}`}
        onClick={() => setIsEdit(true)}
      >
        {title}
      </button>
      {isEdit && (
        <EditOrder dictionary={dictionary} orderData={order} setIsEdit={setIsEdit} isEdit={isEdit} />
      )}
    </div>
  );
}
