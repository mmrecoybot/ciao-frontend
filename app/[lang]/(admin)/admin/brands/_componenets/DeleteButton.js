"use client";
import { Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import ConfirmModal from "../../components/ConfirmModal";
import { useDeleteBrandMutation } from "@/store/slices/brandApi";
import { toast } from "react-toastify";

export default function DeleteBtn({ id, label, lang, dictionary }) {
  const [isDelete, setIsDelete] = useState(false);
  const [deleteBrand, { isLoading, error, isSuccess }] =
    useDeleteBrandMutation();
  const handleDelete = async () => {
    await deleteBrand(id);
    setIsDelete(false);
  };

  useEffect(() => {
    if (isLoading) toast.loading("Deleting brand...");

    if (!isLoading && error) {
      toast.dismiss();
      toast.error(
        lang === "en"
          ? "Failed to delete brand"
          : "Impossibile eliminare il marchio"
      );
    }
    if (!isLoading && !error && isSuccess) {
      toast.dismiss();
      toast.success(
        lang === "en"
          ? "Brand deleted successfully"
          : "Marchio eliminato con successo"
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
              ? "Are you sure you want to delete this brand?"
              : lang === "it"
              ? "Sei sicuro di voler eliminare questa marchio?"
              : "Are you sure you want to delete this brand?" // fallback
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
