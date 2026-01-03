import React from "react";
import EditButton from "./EditButton";
import { Eye } from "lucide-react";
import { useState } from "react";
import { Modal } from "@/app/[lang]/(customer)/customer/orders/add/[id]/_components/Modal";
import SingleActivation from "@/app/[lang]/(admin)/admin/activation/_components/SingleActivation";

const SingleActivationAdminPage = ({ activation, dictionary }) => {
  const [openModal, setOpenModal] = useState(false);
  const handleView = () => {
    setOpenModal(true);
  };
  return (
    <tr
      key={activation?.id}
      className="dark:hover:bg-gray-700 hover:bg-gray-200 duration-100 capitalize"
    >
      <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
        {activation?.id}
      </td>
      <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
        {activation?.user?.name}
      </td>
      <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
        {activation?.user?.email}
      </td>
      <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
        {activation?.company?.name}
      </td>
      <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
        {activation?.categoryOffer}
      </td>
      <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
        {activation?.categoryTarrif}
      </td>
      <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
        {activation?.serialNumber?.number}
      </td>
      <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
        {activation?.moodOfPayment}
      </td>
      <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
        {activation?.status}
      </td>

      <td className="px-6 py-3 whitespace-nowrap text-right text-sm flex justify-end items-center gap-2">
        <EditButton
          activation={activation}
          dictionary={dictionary}
          title={dictionary.personalDataPage.edit}
        />

        <button
          className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          onClick={() => handleView()}
          title="View Activation"
        >
          <Eye size={16} />
        </button>
      </td>
      <Modal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        title={dictionary.activation.activation}
      >
        <SingleActivation id={activation?.id} dictionary={dictionary} />
      </Modal>
    </tr>
  );
};

export default SingleActivationAdminPage;
