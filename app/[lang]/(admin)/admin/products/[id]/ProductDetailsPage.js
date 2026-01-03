"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { FaEdit, FaSave, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";

import {
  useDeleteProductMutation,
  useFetchSingleProductsQuery,
  useUpdateProductMutation,
} from "@/store/slices/productApi";
import CodeEditor from "../new/components/RichTextEditor"; // Assuming this path is correct
import ProductDetailsSkeleton from "../new/components/SingleProductLoader"; // Assuming this path is correct
import { Tag, Delete } from "lucide-react";

// Assuming ImageUpload and SimpleImageUpload are correctly pathed
// import ImageUpload from "../new/components/ImageUpload";
import SimpleImageUpload from "../new/components/SimpleImageUpload"; // Assuming this path is correct
import BackButton from "@/app/[lang]/(customer)/customer/components/ui/BackButton"; // Assuming this path is correct
import ConfirmModal from "@/app/[lang]/(customer)/customer/components/ConfirmModal"; // Assuming this path is correct
import { useFetchSubCategoriesQuery } from "@/store/slices/subCategoryApi";
import { useFetchBrandsQuery } from "@/store/slices/brandApi";
import { useFetchCategoriesQuery } from "@/store/slices/CategoryApi";
import DeleteButton from "../components/DeleteButton";

export default function ProductDetailsPage({ dictionary }) {
  const { id } = useParams();
  const router = useRouter();

  const { data, isLoading, isSuccess, refetch } = useFetchSingleProductsQuery(id);
  const { data: subCategoriesData } = useFetchSubCategoriesQuery();
  const { data: brandsData } = useFetchBrandsQuery();
  const { data: categoriesData } = useFetchCategoriesQuery();

  // Provide default empty arrays if data is not yet available
  const subCategories = subCategoriesData || [];
  const brands = brandsData || [];
  const categories = categoriesData || [];

  const [
    updateProduct,
    {
      isLoading: updateLoading,
      isSuccess: updateSuccess,
      isError: updateError,
      error: updateErrorMessage // Capture error message for more specific feedback
    },
  ] = useUpdateProductMutation();
  const [deleteProduct, { isSuccess: deleteSuccess, isError: deleteError }] = useDeleteProductMutation();

  const codeRef = useRef(null);
  const codeRefItalian = useRef(null);

  const [isEditMode, setIsEditMode] = useState(false);
  const [editedProduct, setEditedProduct] = useState({
    name: "",
    description: "",
    descriptionIt: "", // For description2/Italian
    dealer_price: "",
    retail_price: "",
    purchase_price: "",
    margin: "",
    product_code: "",
    categoryId: null,
    subCategoryId: null,
    brandId: null,
    thumbnail: null,
    variations: [], // Default to empty array
    special_tag: "new",
    // Add other fields from your product model with appropriate defaults
    color: [], // Assuming these are arrays of strings
    tags: [],
    pack_size: [],
    product_features: [],
  });
  const [activeVariation, setActiveVariation] = useState(null);
  const [lang, setLang] = useState("en");
  const [isOpenModal, setIsOpenModal] = useState(false);

  // Effect to populate editedProduct from fetched data
  useEffect(() => {
    if (isSuccess && data) {
      setEditedProduct(prev => ({
        ...prev, // Start with existing defaults
        ...data, // Spread fetched data
        name: data.name ?? "",
        description: data.description ?? "",
        descriptionIt: data.descriptionIt ?? "",
        dealer_price: data.dealer_price ?? "",
        retail_price: data.retail_price ?? "",
        purchase_price: data.purchase_price ?? "",
        margin: data.margin ?? "",
        product_code: data.product_code ?? "",
        categoryId: data.categoryId ?? data.category?.id ?? null,
        subCategoryId: data.subCategoryId ?? data.subCategory?.id ?? null,
        brandId: data.brandId ?? data.brand?.id ?? null,
        thumbnail: data.thumbnail ?? null,
        special_tag: data.special_tag ?? "new",
        // Ensure variations is an array and each item has a default structure
        variations: Array.isArray(data.variations)
          ? data.variations.map(v => ({
              id: v.id ?? undefined, // Keep existing ID or handle if it's missing
              color: v.color ?? "",
              stock: v.stock ?? 0,
              img: v.img ?? "",
              ...v // Spread other potential variation fields
            }))
          : [],
        // Handle other array fields safely
        color: Array.isArray(data.color) ? data.color : (typeof data.color === 'string' && data.color ? [data.color] : []),
        tags: Array.isArray(data.tags) ? data.tags : (typeof data.tags === 'string' && data.tags ? data.tags.split(',') : []),
        pack_size: Array.isArray(data.pack_size) ? data.pack_size : (typeof data.pack_size === 'string' && data.pack_size ? [data.pack_size] : []),
        product_features: Array.isArray(data.product_features) ? data.product_features : (typeof data.product_features === 'string' && data.product_features ? data.product_features.split('\n') : []),
      }));

      if (Array.isArray(data.variations) && data.variations.length > 0) {
        // Set active variation, ensuring it has a default structure too
        const firstVariation = data.variations[0];
        setActiveVariation({
            id: firstVariation.id ?? undefined,
            color: firstVariation.color ?? "",
            stock: firstVariation.stock ?? 0,
            img: firstVariation.img ?? "",
            ...firstVariation
        });
      } else {
        setActiveVariation(null);
      }
    }
  }, [isSuccess, data]);


  const handleInputChange = (field, value) => {
    setEditedProduct((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const renderField = (label, field, type = "text") => {
    const value = editedProduct?.[field];
    return (
      <div>
        <p className="text-gray-600 capitalize">{label}</p>
        {isEditMode ? (
          <input
            type={type}
            value={value ?? (type === "number" ? 0 : "")} // Default for input
            onChange={(e) => handleInputChange(field, type === "number" ? (parseFloat(e.target.value) || 0) : e.target.value)}
            className="w-full p-1 border rounded focus:ring-2 focus:ring-blue-500 dark:text-gray-500"
          />
        ) : (
          <p className="font-medium dark:text-gray-500">
            {Array.isArray(value)
              ? value.join(", ")
              : (value ?? (dictionary?.common?.notAvailable ?? 'N/A'))}
          </p>
        )}
      </div>
    );
  };

  const renderNormalField = (label, field, extra) => {
    // Use optional chaining for data, field, and extra
    const value = extra ? data?.[field]?.[extra] : data?.[field];
    return (
      <div>
        <p className="text-gray-600 capitalize">{label}</p>
        <p className="font-medium dark:text-gray-500 capitalize">
          {value ?? (dictionary?.common?.notAvailable ?? 'N/A')}
        </p>
      </div>
    );
  };

  const handleSave = async () => {
    const processField = (fieldValue, delimiter = ",") => {
      if (Array.isArray(fieldValue)) {
        return fieldValue;
      }
      return typeof fieldValue === "string" && fieldValue.trim() !== "" ? fieldValue.split(delimiter) : [];
    };

    // Construct payload carefully
    const payload = {
      ...editedProduct, // Spread current state
      id: data._id, // Ensure ID is passed for update
      description: codeRef?.current?.getContent() ?? editedProduct.description ?? "",
      descriptionIt: codeRefItalian?.current?.getContent() ?? editedProduct.descriptionIt ?? "",
      // Ensure IDs are correctly named/formatted for the API if they differ from state
      // Example: subCategoryId is already in editedProduct, so this is fine.
      // If API expects 'BrandID' but state has 'brandId':
      // BrandId: editedProduct.brandId,
      // categoryId: editedProduct.categoryId,
      // subCategoryId: editedProduct.subCategoryId,
      // brandId: editedProduct.brandId, // if API expects brandId

      // Ensure variations are structured as the API expects (e.g., no temporary client-side IDs)
      variations: editedProduct.variations?.map(v => ({
        color: v.color,
        stock: v.stock,
        img: v.img,
        id: v.id, // Send ID if it exists (for updating existing variations)
        // Add any other fields your API expects for a variation
      })) ?? [],

      // Process array fields if they were edited as strings and need to be arrays
      // This depends on how you handle input for these fields.
      // If they are always arrays in `editedProduct` state, this might not be needed.
      // color: processField(editedProduct?.color),
      // tags: processField(editedProduct?.tags),
      // pack_size: processField(editedProduct?.pack_size),
      // product_features: processField(editedProduct?.product_features, "\n"),
    };

    // Remove potentially problematic fields if they are not expected by the backend
    // or if they are objects that should be IDs (already handled in useEffect mapping)
    // delete payload.category;
    // delete payload.subCategory;
    // delete payload.brand;

    updateProduct(payload);
  };

  useEffect(() => {
    if (updateSuccess) {
      toast.dismiss();
      toast.success(dictionary?.toasts?.productUpdatedSuccess ?? "Product updated successfully");
      setIsEditMode(false);
      refetch();
    }
    if (updateError) {
      toast.dismiss();
      const message = typeof updateErrorMessage?.data?.message === 'string' ? updateErrorMessage.data.message : (dictionary?.toasts?.productUpdateError ?? "Error updating product");
      toast.error(message);
    }
    // No specific toast for updateLoading here as per original, but can be added.
  }, [updateError, updateSuccess, updateLoading, updateErrorMessage, refetch, dictionary]);

  // Handle Delete Product
  useEffect(() => {
    if (deleteSuccess) {
        toast.success(dictionary?.toasts?.productDeletedSuccess ?? "Product deleted successfully");
        router.push("/dashboard/products"); // Adjust path as needed
    }
    if (deleteError) {
        toast.error(dictionary?.toasts?.productDeleteError ?? "Error deleting product");
    }
  }, [deleteSuccess, deleteError, router, dictionary]);


  if (isLoading) {
    return <ProductDetailsSkeleton />;
  }

  if (!isSuccess || !editedProduct) { // Or !data if you prefer checking raw fetch
    return <div className="container mx-auto px-4 py-8 text-center">{dictionary?.common?.productNotFound ?? "Product not found or error loading details."}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <BackButton />
      <div className="flex justify-between items-center mb-6 sticky top-0 py-10 bg-white dark:bg-gray-900 z-10 pl-4">
        {isEditMode ? (
          <input
            type="text"
            value={editedProduct?.name ?? ""}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className="text-3xl font-bold text-gray-900 dark:text-gray-400 border rounded p-1"
          />
        ) : (
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-400">
            {editedProduct?.name ?? (dictionary?.productsPages?.untitledProduct ?? "Untitled Product")}
            <div
              className={"inline-flex items-center gap-1 px-2 py-1 text-xs capitalize font-semibold text-yellow-800 bg-yellow-100 rounded-full shadow-sm ml-2"}
            >
              <Tag className="w-3 h-3" />
              <span>
                {editedProduct?.special_tag ?? "new"}
              </span>
            </div>
          </h1>
        )}

        <div className="flex gap-2 items-center">
          {isEditMode ? (
            <>
              <button
                onClick={handleSave}
                disabled={updateLoading}
                className="bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <FaSave /> {updateLoading ? (dictionary?.common?.saving ?? "Saving...") : (dictionary?.dealerPages?.save ?? "Save")}
              </button>
              <button
                onClick={() => {
                  setIsEditMode(false);
                  // Reset to original fetched data if cancel
                  if (data) setEditedProduct(data); // Or the more elaborate reset from initial useEffect
                }}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <FaTimes /> {dictionary?.activation?.cancel ?? "Cancel"}
              </button>
            </>
          ) : (
            <>
              {/* <button
                onClick={() => setIsOpenModal(true)}
                className="bg-rose-600 text-white px-4 py-2 rounded-md hover:bg-rose-700 transition-colors flex items-center gap-2"
              >
                <Delete /> {dictionary?.productsPages?.deleteProduct ?? "Delete Product"}
              </button>
              {isOpenModal && (
                <ConfirmModal
                  item={editedProduct}
                  onClose={() => setIsOpenModal(false)}
                  onDelete={() => {
                    deleteProduct(editedProduct._id);
                    setIsOpenModal(false);
                  }}
                  type={"Product"}
                  dictionary={dictionary}
                />
              )} */}
                               <DeleteButton
                                  productId={editedProduct.id}
                                  label={dictionary.bannerPages.delete}
                                  lang={lang}
                                  dictionary={dictionary}
                                />
              <button
                onClick={() => setIsEditMode(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <FaEdit /> {dictionary?.dealerPages?.edit ?? "Edit"}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Image Gallery & Variations */}
        <div>
          <h1 className="text-lg font-semibold mb-3 border-b">{dictionary?.productsPages?.variations ?? "Variations"}</h1>
          {isEditMode ? (
            <div className="space-y-4">
              {(editedProduct?.variations || []).map((variation, index) => (
                <div key={variation?.id ?? `new-variation-${index}`} className="p-2 border rounded-md flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <input
                    type="text"
                    value={variation?.color ?? ""}
                    onChange={(e) => {
                      const newVariations = [...(editedProduct?.variations || [])];
                      newVariations[index] = { ...(newVariations[index] || {}), color: e.target.value };
                      handleInputChange("variations", newVariations);
                    }}
                    className="w-full sm:w-1/4 p-1 border rounded"
                    placeholder={dictionary?.orderPages?.color ?? "Color"}
                  />
                  <input
                    type="number"
                    value={variation?.stock ?? 0}
                    min="0"
                    onChange={(e) => {
                      const newVariations = [...(editedProduct?.variations || [])];
                      newVariations[index] = { ...(newVariations[index] || {}), stock: parseInt(e.target.value, 10) || 0 };
                      handleInputChange("variations", newVariations);
                    }}
                    className="w-full sm:w-1/4 p-1 border rounded"
                    placeholder={dictionary?.productsPages?.stock ?? "Stock"}
                  />
                  <div className="w-full sm:w-1/2">
                    <SimpleImageUpload
                      dictionary={dictionary}
                      image={variation?.img ?? ""}
                      onImageChange={(imgUrl) => {
                        const newVariations = [...(editedProduct?.variations || [])];
                        newVariations[index] = { ...(newVariations[index] || {}), img: imgUrl };
                        handleInputChange("variations", newVariations);
                      }}
                      folder="products"
                    />
                  </div>
                  <button
                    onClick={() => {
                      const newVariations = (editedProduct?.variations || []).filter((_, i) => i !== index);
                      handleInputChange("variations", newVariations);
                      if (activeVariation?.id === variation?.id || (activeVariation && newVariations.length === 0)) {
                        setActiveVariation(newVariations.length > 0 ? newVariations[0] : null);
                      }
                    }}
                    className="text-red-500 hover:text-red-700"
                    title={dictionary?.common?.delete ?? "Delete"}
                  >
                    <FaTimes size={18} />
                  </button>
                </div>
              ))}
              <button
                onClick={() => {
                  const newVariations = [
                    ...(editedProduct?.variations || []),
                    { id: `client-${Date.now()}`, color: "", stock: 0, img: "" }, // Add a temporary client-side ID for key prop
                  ];
                  handleInputChange("variations", newVariations);
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-2"
              >
                {dictionary?.productsPages?.add_variation ?? "Add Variation"}
              </button>
            </div>
          ) : (
            <>
              <div className="border rounded-lg overflow-hidden mb-4 p-2 min-h-[300px] flex items-center justify-center bg-gray-50">
                {activeVariation?.img ? (
                  <Image
                    src={activeVariation.img}
                    alt={`${editedProduct?.name ?? "Product"} - ${activeVariation?.color ?? ""}`}
                    width={600}
                    height={600}
                    className="w-full h-96 object-contain"
                    priority // Prioritize loading the main image
                  />
                ) : (
                  <div className="w-full h-96 bg-gray-100 flex items-center justify-center text-gray-500">
                    {dictionary?.productsPages?.no_image_available ?? "No image available"}
                  </div>
                )}
              </div>
              {(editedProduct?.variations?.length ?? 0) > 0 && (
                <div className="flex flex-wrap gap-2">
                  {(editedProduct.variations || []).map((variation, index) => (
                    <button
                      key={variation?.id ?? index}
                      onClick={() => setActiveVariation(variation)}
                      className={`p-2 border rounded-lg ${
                        activeVariation?.id === variation?.id || (activeVariation?.color === variation?.color && activeVariation?.img === variation?.img) // Fallback comparison if IDs are not stable
                          ? "border-blue-500 ring-2 ring-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      <div className="w-16 h-16 relative mb-1 bg-gray-100 rounded">
                        {variation?.img ? (
                           <Image
                            src={variation.img}
                            alt={`${editedProduct?.name ?? "Product"} - ${variation?.color ?? ""}`}
                            fill
                            sizes="(max-width: 768px) 10vw, (max-width: 1200px) 5vw, 64px"
                            className="object-contain rounded"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                             {dictionary?.productsPages?.no_img_short ?? "No Img"}
                          </div>
                        )}
                      </div>
                      <span className="block text-sm capitalize truncate w-16 text-center">{variation?.color || (dictionary?.common?.unspecified ?? "N/A")}</span>
                      <span className="block text-xs text-gray-500 text-center">
                        {dictionary?.productsPages?.stock ?? "Stock"}: {variation?.stock ?? 0}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Product Details Fields */}
        <div>
          <div className="bg-white dark:bg-gray-900 shadow rounded-lg p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {renderField(`${dictionary?.productsPages?.purchase_price ?? "Purchase Price"}`, "purchase_price", "number")}
              {renderField(`${dictionary?.productsPages?.dealer_price ?? "Dealer Price"}`, "dealer_price", "number")}
              {renderField(`${dictionary?.productsPages?.retail_price ?? "Retail Price"}`, "retail_price", "number")}
              {renderField(`${dictionary?.ordersPages?.margin ?? "Margin"} (%)`, "margin", "number")}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 shadow rounded-lg p-6 mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {renderNormalField(`${dictionary?.productsPages?.product_code ?? "Product Code"}`, "product_code")}

              {isEditMode ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                    {dictionary?.productsPages?.category ?? "Category"}
                  </label>
                  <select
                    value={editedProduct?.categoryId ?? ""}
                    onChange={(e) => handleInputChange("categoryId", e.target.value || null)}
                    className="w-full p-2 border rounded capitalize dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                  >
                    <option value="">{dictionary?.categoryPages?.select_category ?? "-- Select Category --"}</option>
                    {categories.map((category) => (
                      <option key={category?.id} value={category?.id} className="capitalize">
                        {category?.name ?? "Unnamed Category"}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                renderNormalField(`${dictionary?.productsPages?.category ?? "Category"}`, "category", "name")
              )}

              {isEditMode ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                    {dictionary?.categoryPages?.sub_category ?? "Sub Category"}
                  </label>
                  <select
                    value={editedProduct?.subCategoryId ?? ""}
                    onChange={(e) => handleInputChange("subCategoryId", e.target.value || null)}
                    disabled={!editedProduct?.categoryId} // Disable if no parent category selected
                    className="w-full p-2 border rounded capitalize dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                  >
                    <option value="">{dictionary?.productsPages?.select_sub_category ?? "-- Select Sub Category --"}</option>
                    {subCategories
                      .filter((subCat) => editedProduct?.categoryId && subCat?.category?.id === editedProduct.categoryId)
                      .map((subCat) => (
                        <option key={subCat?.id} value={subCat?.id} className="capitalize">
                          {subCat?.name ?? "Unnamed SubCategory"}
                        </option>
                      ))}
                  </select>
                </div>
              ) : (
                renderNormalField(`${dictionary?.categoryPages?.sub_category ?? "Sub Category"}`, "subCategory", "name")
              )}

              {isEditMode ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                    {dictionary?.productsPages?.brand ?? "Brand"}
                  </label>
                  <select
                    value={editedProduct?.brandId ?? ""}
                    onChange={(e) => handleInputChange("brandId", e.target.value || null)}
                    className="w-full p-2 border rounded capitalize dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                  >
                    <option value="">{dictionary?.productsPages?.select_brand ?? "-- Select Brand --"}</option>
                    {brands.map((brand) => (
                      <option key={brand?.id} value={brand?.id} className="capitalize">
                        {brand?.name ?? "Unnamed Brand"}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                renderNormalField(`${dictionary?.productsPages?.brand ?? "Brand"}`, "brand", "name")
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Specifications / Descriptions */}
      <div className="mt-8 mb-14 bg-white dark:bg-gray-900 shadow rounded-lg p-6">
        <h3 className="text-2xl font-semibold mb-4 dark:text-gray-400 flex justify-between items-center">
          {dictionary?.productsPages?.detailed_specifications ?? "Detailed Specifications"}
          <span className="flex gap-2 text-sm">
            <button
              className={`p-1 px-3 border rounded-md ${lang === "en" ? "bg-blue-500 text-white" : "hover:bg-gray-100 dark:hover:bg-gray-700"}`}
              onClick={() => setLang("en")}
            >
              {dictionary?.common?.english ?? "English"}
            </button>
            <button
              className={`p-1 px-3 border rounded-md ${lang === "it" ? "bg-blue-500 text-white" : "hover:bg-gray-100 dark:hover:bg-gray-700"}`}
              onClick={() => setLang("it")}
            >
              {dictionary?.common?.italian ?? "Italiano"}
            </button>
          </span>
        </h3>
        {isEditMode ? (
          <>
            <div className={lang === "en" ? "" : "hidden"}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{dictionary?.common?.descriptionEnglish ?? "Description (English)"}</label>
              <CodeEditor ref={codeRef} content={editedProduct?.description ?? ""} />
            </div>
            <div className={lang === "it" ? "" : "hidden"}>
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{dictionary?.common?.descriptionItalian ?? "Description (Italian)"}</label>
              <CodeEditor ref={codeRefItalian} content={editedProduct?.descriptionIt ?? ""} />
            </div>
          </>
        ) : (
          <>
            {lang === "en" && (
              <div
                className="prose max-w-none text-gray-700 dark:text-gray-300"
                dangerouslySetInnerHTML={{ __html: editedProduct?.description || (dictionary?.common?.noDescription ?? "<p>No description available.</p>") }}
              />
            )}
            {lang === "it" && (
              <div
                className="prose max-w-none text-gray-700 dark:text-gray-300"
                dangerouslySetInnerHTML={{ __html: editedProduct?.descriptionIt || (dictionary?.common?.noDescription ?? "<p>Nessuna descrizione disponibile.</p>") }}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}