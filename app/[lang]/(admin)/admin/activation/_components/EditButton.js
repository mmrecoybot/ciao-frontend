"use client";
import React, { useState } from "react";

import RelativeModal from "../../components/RelativeModal";
// import ActivationForm from "./ActivationForm";
import EditActivationForm from "./EditActivationForm";

export default function EditButtonActivation({ activation,title="Edit", className = "inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",dictionary }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  return (
    activation.status !== "active" && (
      <div className="">
        <button
          onClick={toggleModal}
          className={` ${className}`}
        >
          {title}
        </button>
        {isOpen && (
          <RelativeModal setShowForm={toggleModal} title={title}>
            <EditActivationForm
              setShowForm={toggleModal}
              isEdit={true}
              activation={activation}
              dictionary={dictionary}
            />
          </RelativeModal>
        )}
      </div>
    )
  );
}
