"use client";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import ConfirmModal from "../../components/ConfirmModal";
import { useDeleteSimMutation } from "@/store/slices/simApi";
import { toast } from "react-toastify";

export default function DeleteBtn({ simId, label, lang, dictionary }) {
  const [isDelete, setIsDelete] = useState(false);
  const [deleteSim] = useDeleteSimMutation();
  const handleDelete = async () => {
    await deleteSim(simId);
    setIsDelete(false);
    toast.success(
      lang === "en" ? "Sim deleted successfully" : "Sim eliminato con successo"
    );
  };

  return (
    <>
      <button
        onClick={() => setIsDelete(true)}
        className="border border-red-600 text-red-600 hover:text-red-800 font-medium px-2 py-1 rounded transition-colors flex items-center"
      >
        <Trash2 className="h-4 w-4 mr-2" />
        {label}
      </button>
      {isDelete && (
        <ConfirmModal
          title={lang === "en" ? "Are you sure?" : "Sei sicuro?"}
          message={
            lang === "en"
              ? "Are you sure you want to delete this sim?"
              : lang === "it"
              ? "Sei sicuro di voler eliminare questo sim?"
              : "Are you sure you want to delete this sim?" // fallback
          }
          onConfirm={handleDelete}
          cancelText={dictionary.bannerPages.cancel}
          confirmText={dictionary.bannerPages.delete}
          variant="danger"
          isOpen={isDelete}
          onClose={() => setIsDelete(false)}
        />
      )}
    </>
  );
}
