"use client";

import { useFetchBrandsQuery } from "@/store/slices/brandApi";
import { useAddProductMutation } from "@/store/slices/productApi";
import { Blocks, Loader, ShieldX } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";

import ImageUpload from "./ImageUpload";
import CodeEditor from "./RichTextEditor";
import { useFetchCategoriesQuery } from "@/store/slices/CategoryApi";
import FormInput from "../../../components/form/FormInput ";
import FormSelect from "../../../components/form/FormSelect";
import { useFetchSubCategoriesQuery } from "@/store/slices/subCategoryApi";
import SimpleImageUpload from "./SimpleImageUpload";

export default function AddProductForm({ lang, dictionary }) {
  // Variationer image dore rakhar jonno local state
  const [vImage, setVImage] = useState("");

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "Test Product",
      dealer_price: "100",
      retail_price: "150",
      purchase_price: "80",
      margin: "20",
      variations: [],
    },
  });

  const { data: brands } = useFetchBrandsQuery();
  const { data: categories } = useFetchCategoriesQuery();
  const { data: subCategories } = useFetchSubCategoriesQuery();
  const selectedCategory = watch("categoryId");
  const selectedSubCategory = subCategories?.filter(
    (subCategory) => subCategory.category.id == selectedCategory,
  );

  const [addProduct, { isLoading, isError, isSuccess, error }] =
    useAddProductMutation();
  const router = useRouter();
  const codeRef = useRef();
  const codeRefItalian = useRef();

  const onSubmit = async (data) => {
    if (!data.variations || data.variations.length === 0) {
      toast.error("Please add at least one variation");
      return;
    }
    const payload = {
      ...data,
      subCategoryId: Number(data.subCategoryId),
      brandId: Number(data.brandId),
      categoryId: Number(data.categoryId),
      description: data.description || codeRef.current?.getContent() || "",
      descriptionIt:
        data.descriptionIt || codeRefItalian.current?.getContent() || "",
    };
    addProduct(payload);
  };

  useEffect(() => {
    if (isSuccess) {
      toast.dismiss();
      toast.success("Product added successfully!");
      router.refresh();
      router.push(`/${lang}/admin/products`);
    }
    if (isError) {
      toast.error(error?.data?.error || "Error adding product");
    }
  }, [isSuccess, isError, lang, router]);

  // --- VARIATION ADD KORAR LOGIC ---
  const handleAddVariation = () => {
    // getValues diye current input gulo nilam
    const color = getValues("newVariationColor");
    const stockVal = getValues("newVariationStock");
    const stock = parseInt(stockVal);
    const img = vImage; // Sorasori local state theke image nilam

    console.log("Check before push:", { img, color, stock });

    if (img && color && !isNaN(stock)) {
      const currentVariations = getValues("variations") || [];
      const updatedVariations = [...currentVariations, { img, color, stock }];

      setValue("variations", updatedVariations, { shouldValidate: true });

      // Add hoye gele input gulo khali kora
      setVImage(""); // Image state khali holo
      setValue("newVariationColor", "");
      setValue("newVariationStock", "");

      toast.success("Variation added successfully!");
    } else {
      // Check korchi konta miss hoise
      if (!img) toast.error("Image upload hoinai ekhono!");
      else if (!color) toast.error("Color lekhen nai!");
      else if (isNaN(stock)) toast.error("Stock number den!");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full mx-auto relative p-6 px-20"
    >
      {/* Product Basic Info Section */}
      <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2 dark:text-gray-400">
          {dictionary.productsPages.basic_info}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2 dark:text-gray-200">
              Main Thumbnail
            </label>
            <Controller
              name="thumbnail"
              control={control}
              render={({ field }) => (
                <SimpleImageUpload
                  onImageChange={field.onChange}
                  folder="product"
                  image={field.value}
                  dictionary={dictionary}
                  display="block"
                />
              )}
            />
          </div>
          <FormInput
            label={dictionary.personalDataPage.name}
            name="name"
            register={register}
            errors={errors}
            required
          />
          <FormSelect
            label={dictionary.productsPages.brand}
            name="brandId"
            register={register}
            errors={errors}
            required
            options={brands?.map((b) => ({ value: b.id, label: b.name }))}
          />
          <FormSelect
            label={dictionary.productsPages.category}
            name="categoryId"
            register={register}
            errors={errors}
            required
            options={categories?.map((c) => ({ value: c.id, label: c.name }))}
          />
          <FormSelect
            label={dictionary.categoryPages.sub_category}
            name="subCategoryId"
            register={register}
            errors={errors}
            options={selectedSubCategory?.map((s) => ({
              value: s.id,
              label: s.name,
            }))}
          />
        </div>
      </div>

      {/* Pricing Section */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2 dark:text-gray-400">
          {dictionary.productsPages.pricing}
        </h2>
        <div className="grid grid-cols-1 gap-4">
          <FormInput
            label={dictionary.productsPages.dealer_price}
            name="dealer_price"
            register={register}
            errors={errors}
          />
          <FormInput
            label={dictionary.productsPages.retail_price}
            name="retail_price"
            register={register}
            errors={errors}
          />
          <FormInput
            label={dictionary.productsPages.purchase_price}
            name="purchase_price"
            register={register}
            errors={errors}
          />
          <FormInput
            label="Margin (%)"
            name="margin"
            register={register}
            errors={errors}
          />
        </div>
      </div>

      {/* Variations Section */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2 dark:text-gray-400">
          {dictionary.productsPages.variations}
        </h2>
        <div className="space-y-4">
          {/* Variation Display List */}
          <div className="grid grid-cols-4 gap-2">
            {watch("variations")?.map((variation, index) => (
              <div
                key={index}
                className="border p-2 rounded bg-gray-50 dark:bg-gray-700 flex flex-col items-center"
              >
                <img
                  src={variation.img}
                  className="w-12 h-12 object-cover rounded mb-1"
                />
                <span className="text-[10px] text-center">
                  {variation.color} ({variation.stock})
                </span>
                <button
                  type="button"
                  className="text-red-500 text-[10px] mt-1"
                  onClick={() => {
                    const current = getValues("variations");
                    setValue(
                      "variations",
                      current.filter((_, i) => i !== index),
                    );
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* ADD VARIATION FORM */}
          <div className="border p-4 rounded bg-gray-100 dark:bg-gray-900">
            <h3 className="text-sm font-bold mb-3">
              {dictionary.productsPages.add_new_variation}
            </h3>
            <div className="space-y-3">
              {/* Eikhane amra image local state-e rakhchi jate mis na hoy */}
              <SimpleImageUpload
                onImageChange={(url) => setVImage(url)}
                folder="product"
                image={vImage}
                display="block"
                dictionary={dictionary}
              />
              <FormInput
                label="Color"
                name="newVariationColor"
                register={register}
                errors={errors}
              />
              <FormInput
                label="Stock"
                name="newVariationStock"
                register={register}
                errors={errors}
                type="number"
              />

              <button
                type="button"
                onClick={handleAddVariation}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-bold"
              >
                + Add This Variation
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2 dark:text-gray-400">
          {dictionary.productsPages.description}
        </h2>
        <div className="space-y-4">
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <CodeEditor
                content={field.value}
                ref={codeRef}
                onChange={field.onChange}
              />
            )}
          />
          <Controller
            name="descriptionIt"
            control={control}
            render={({ field }) => (
              <CodeEditor
                content={field.value}
                ref={codeRefItalian}
                onChange={field.onChange}
              />
            )}
          />
        </div>
      </div>

      <div className="col-span-2 flex gap-4 justify-center mt-6">
        <button
          type="submit"
          disabled={isLoading}
          className="bg-indigo-600 text-white px-10 py-2 rounded-md flex items-center gap-2"
        >
          {isLoading ? <Loader className="animate-spin" /> : <Blocks />} Add
          Product
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="bg-red-600 text-white px-10 py-2 rounded-md"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
