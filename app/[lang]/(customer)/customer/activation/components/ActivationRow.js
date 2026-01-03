"use client";

import SingleActivation from "@/app/[lang]/(admin)/admin/activation/_components/SingleActivation";
import { useState } from "react";
import { Modal } from "../../orders/add/[id]/_components/Modal";
import Loading from "../../components/Loading";

const { Eye } = require("lucide-react");
const { default: ProgressBar } = require("./ProgrssBar");

function ActivationRow({ dictionary, activation }) {
  const [openModal, setOpenModal] = useState(false);

  const handleView = (id) => {
   setOpenModal(true);
  };
  return (
    <tr className="border-b text-gray-500">
      <td className="px-4 py-3">{activation.id}</td>
      <td className="px-4 py-3">{activation.createdAt.slice(0, 10)}</td>
      <td className="px-4 py-3">{activation.categoryOffer}</td>
      <td className="px-4 py-3">{activation.moodOfPayment}</td>
      <td className="px-4 py-3">{activation.serialNumber.number}</td>
      <td className="px-4 py-3">{activation?.company?.name}</td>
      <td className="px-4 py-3 capitalize">{activation?.status}</td>
      <td className="px-4 py-3">
        <ProgressBar progress={getProgress(activation.status)} />
      </td>
      <td className="px-4 py-3">
        <button
          onClick={() => handleView()}
          className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
          title="View Activation"
        >
          <Eye size={16} />
        </button>

        <Modal
          isOpen={openModal}
          onClose={() => setOpenModal(false)}
          title={dictionary.activation.activation}
        >
          <SingleActivation
            dictionary={dictionary}
            id={activation.id}
            customer={true}
          />
        </Modal>
      </td>
    </tr>
  );
}

export default ActivationRow;

const getProgress = (status) => {
  switch (status) {
    case "pending":
      return 30;
    case "processing":
      return 70;
    case "active":
      return 100;
    default:
      return 0;
  }
};
