"use client";
import { Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import ConfirmModal from "../../components/ConfirmModal";
import { useDeleteCompanyMutation } from "@/store/slices/companyApi";
import { toast } from "react-toastify";

export default function DeleteBtn({ companyId, label, lang, dictionary }) {
  const [isDelete, setIsDelete] = useState(false);
  const [deleteCompany, { isLoading, error, isSuccess }] =
    useDeleteCompanyMutation();

  const handleDelete = async () => {
    await deleteCompany(companyId);
    setIsDelete(false);
  };

  useEffect(() => {
    if (isLoading) toast.loading("Deleting company...");

    if (!isLoading && error) {
      toast.dismiss();
      toast.error(
        lang === "en"
          ? "Failed to delete company"
          : "Impossibile eliminare l'azienda"
      );
    }
    if (!isLoading && !error && isSuccess) {
      toast.dismiss();
      toast.success(
        lang === "en"
          ? "Company deleted successfully"
          : "Azienda eliminata con successo"
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
              ? "Are you sure you want to delete this company?"
              : lang === "it"
              ? "Sei sicuro di voler eliminare questa azienda?"
              : "Are you sure you want to delete this company?" // fallback
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
