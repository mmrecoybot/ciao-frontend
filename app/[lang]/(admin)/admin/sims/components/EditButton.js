"use client";
import { Pencil } from "lucide-react";
import { useState } from "react";
import AddPhoneNumberModal from "./AddPhoneNumberModal";

export default function EditButton({ simId, label, dictionary, simToEdit, isDealer }) {
  const [isOpenModal, setIsOpenModal] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpenModal(true)}
        className="text-emerald-600 hover:text-emerald-800 border border-emerald-600 font-medium px-2 py-1 rounded transition-colors flex items-center"
      >
        <Pencil className="h-4 w-4 mr-2" />
        {label}
      </button>
      {isOpenModal && (
        <AddPhoneNumberModal
          simId={simId}
          dictionary={dictionary}
          onClose={() => setIsOpenModal(false)}
          simToEdit={simToEdit}
          isDealer={isDealer}
        />
      )}
    </>
  );
}
