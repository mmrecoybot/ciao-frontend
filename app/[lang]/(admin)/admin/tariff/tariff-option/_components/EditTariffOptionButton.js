"use client";
import React, { useState } from "react";
import RelativeModal from "../../../components/RelativeModal";
import TariffOptionForm from "./TariffOptionForm";

export default function EditTariffOptionButton({ tariffOption }) {
  
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="">
      <button
        onClick={toggleModal}
        className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Edit
      </button>
      {isOpen && (
        <RelativeModal setShowForm={toggleModal} title={"Edit Tariff Option"}>
          <TariffOptionForm
            setShowForm={toggleModal}
            isEdit={true}
            tariffOption={tariffOption}
          />
        </RelativeModal>
      )}
    </div>
  );
}
