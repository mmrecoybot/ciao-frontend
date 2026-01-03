"use client";
import { useState } from "react";

import RelativeModal from "../../components/RelativeModal";
import RoleForm from "./RoleForm";

export default function EditButton({ role, dictionary }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div className="">
      <button
        onClick={toggleModal}
        className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded text-gray-700 dark:text-gray-300 dark:bg-gray-800 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        {dictionary.dealerPages.edit}
      </button>
      {isOpen && (
        <RelativeModal setShowForm={toggleModal} title={dictionary.rolesPages.edit_role}>
          <RoleForm setShowForm={toggleModal} isEdit={true} role={role} dictionary={dictionary} />
        </RelativeModal>
      )}
    </div>
  );
}
