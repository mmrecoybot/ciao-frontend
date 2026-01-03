"use client";
import { Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import ConfirmModal from "../../components/ConfirmModal";
import { toast } from "react-toastify";
import { useDeleteTariffMutation } from "@/store/slices/tarrifApi";

export default function DeleteBtn({ tariffId, label, lang, dictionary }) {
  const [isDelete, setIsDelete] = useState(false);
  const [deleteTariff, { isLoading, error, isSuccess }] =
    useDeleteTariffMutation();

  const handleDelete = async () => {
    await deleteTariff(tariffId);
    setIsDelete(false);
  };

  useEffect(() => {
    if (isLoading) toast.loading("Deleting tariff...");

    if (!isLoading && error) {
      toast.dismiss();
      toast.error(
        lang === "en"
          ? "Failed to delete tariff"
          : "Impossibile eliminare il tariffo"
      );
    }
    if (!isLoading && !error && isSuccess) {
      toast.dismiss();
      toast.success(
        lang === "en"
          ? "Tariff deleted successfully"
          : "Tariffo eliminato con successo"
      );
    }
  }, [isLoading, error, lang, isSuccess]);

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
              ? "Are you sure you want to delete this tariff?"
              : lang === "it"
              ? "Sei sicuro di voler eliminare questo tariffa?"
              : "Are you sure you want to delete this tariff?" // fallback
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
