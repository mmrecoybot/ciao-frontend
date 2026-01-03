"use client";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ConfirmModal from "../../components/ConfirmModal";
import { useDeleteProductMutation } from "@/store/slices/productApi";
import { useRouter } from "next/navigation";

export default function DeleteButton({ productId, label, lang, dictionary }) {
  const router = useRouter();
  const [isDelete, setIsDelete] = useState(false);
  const [deleteProduct, { isLoading, error, isSuccess }] =
    useDeleteProductMutation();
  const handleDelete = () => {
    deleteProduct(productId);
    setIsDelete(false);
  };

  useEffect(() => {
    if (isLoading) toast.loading("Deleting product...");

    if (!isLoading && error) {
      toast.dismiss();
      toast.error(
        lang === "en"
          ? "Failed to delete product"
          : "Impossibile eliminare il prodotto"
      );
    }
    if (!isLoading && !error && isSuccess) {
      toast.dismiss();
      toast.success(
        lang === "en"
          ? "Product deleted successfully"
          : "Prodotto eliminato con successo"
      );
      router.push(`/${lang}/admin/products`);
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
              ? "Are you sure you want to delete this product?"
              : lang === "it"
                ? "Sei sicuro di voler eliminare questo prodotto?"
                : "Are you sure you want to delete this product?" // fallback
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
