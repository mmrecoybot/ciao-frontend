"use client";

import { useState } from "react";
import RelativeModal from "../../components/RelativeModal";
import TarrifForm from "./TarrifForm";
import { Pencil } from "lucide-react";
const EditTarrifButton = ({ tarrif, dictionary }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="">
      <button
        onClick={toggleModal}
        className="inline-flex items-center px-3 py-1.5 border text-green-500 border-green-500 rounded-md  gap-2 hover:text-gray-600"
      >
        <Pencil className="h-4 w-4" />
        {dictionary.dealerPages.edit}
      </button>
      {isOpen && (
        <RelativeModal
          setShowForm={toggleModal}
          title={dictionary.tariffPages.edit_tarrif}
        >
          <TarrifForm
            setShowForm={toggleModal}
            isEdit={true}
            tariff={tarrif}
            dictionary={dictionary}
          />
        </RelativeModal>
      )}
    </div>
  );
};

export default EditTarrifButton;
