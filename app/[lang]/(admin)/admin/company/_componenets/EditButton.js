"use client";

import { useState } from "react";
import RelativeModal from "../../components/RelativeModal";
import CompanyForm from "./CompanyForm";
import { AiOutlineEdit } from "react-icons/ai";

export default function EditButton({ company, dictionary }) {
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
        <AiOutlineEdit className="mr-1" />
        {dictionary.dealerPages.edit}
      </button>
      {isOpen && (
        <RelativeModal setShowForm={toggleModal} title={dictionary.companyPages.edit_company}>
          <CompanyForm
            setShowForm={toggleModal}
            isEdit={true}
            company={company}
            dictionary={dictionary}
          />
        </RelativeModal>
      )}
    </div>
  );
}
