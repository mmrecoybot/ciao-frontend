"use client";
import { Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import ConfirmModal from "../../../components/ConfirmModal";
import { useDeleteSubCategoryMutation } from "@/store/slices/subCategoryApi";
import { toast } from "react-toastify";

export default function DeleteBtn({ subCategoryId, label, lang, dictionary }) {
  const [isDelete, setIsDelete] = useState(false);
  const [deleteSubCategory, { isLoading, error, isSuccess }] =
    useDeleteSubCategoryMutation();

  const handleDelete = async () => {
    await deleteSubCategory(subCategoryId);
    setIsDelete(false);
  };

  useEffect(() => {
    if (isLoading) toast.loading("Deleting sub category...");

    if (!isLoading && error) {
      toast.dismiss();
      toast.error(
        lang === "en"
          ? "Failed to delete sub category"
          : "Impossibile eliminare la sottocategoria"
      );
    }
    if (!isLoading && !error && isSuccess) {
      toast.dismiss();
      toast.success(
        lang === "en"
          ? "Sub category deleted successfully"
          : "Sottocategoria eliminata con successo"
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
              ? "Are you sure you want to delete this sub category?"
              : lang === "it"
              ? "Sei sicuro di voler eliminare questa sottocategoria?"
              : "Are you sure you want to delete this sub category?" // fallback
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
