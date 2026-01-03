"use client";
import { useDeleteCategoryMutation } from "@/store/slices/CategoryApi";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ConfirmModal from "../../components/ConfirmModal";

export default function DeleteBtn({ categoryId, label, lang, dictionary }) {
  const [isDelete, setIsDelete] = useState(false);
  const [deleteCategory, { isLoading, error, isSuccess }] =
    useDeleteCategoryMutation();
  const handleDelete = () => {
    deleteCategory(categoryId);
    setIsDelete(false);
  };

  useEffect(() => {
    if (isLoading) toast.loading("Deleting category...");

    if (!isLoading && error) {
      toast.dismiss();
      toast.error(
        lang === "en"
          ? "Failed to delete category"
          : "Impossibile eliminare la categoria"
      );
    }
    if (!isLoading && !error && isSuccess) {
      toast.dismiss();
      toast.success(
        lang === "en"
          ? "Category deleted successfully"
          : "Categoria eliminata con successo"
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
              ? "Are you sure you want to delete this category?"
              : lang === "it"
              ? "Sei sicuro di voler eliminare questa categoria?"
              : "Are you sure you want to delete this category?" // fallback
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
