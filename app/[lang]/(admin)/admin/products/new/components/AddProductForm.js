"use client";

import { useFetchBrandsQuery } from "@/store/slices/brandApi";
import { useAddProductMutation } from "@/store/slices/productApi";
import { Blocks, Loader, ShieldX } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
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
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
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
    (subCategory) => subCategory.category.id == selectedCategory
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

    console.log("Final Payload to Backend:", payload); // DEBUG LOG

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
    if (isLoading) {
      toast.info("Updating product...");
    }
  }, [isSuccess, isError, isLoading, error]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full mx-auto relative p-6 px-20">
      {/* Basic Information Group */}
      <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 dark:text-gray-400 border-b pb-2">
          {dictionary.productsPages.basic_info}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Product Image
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
            placeholder="Iphone 16"
            required
          />
          <FormSelect
            label={dictionary.productsPages.brand}
            name="brandId"
            register={register}
            errors={errors}
            required
            options={brands?.map((brand) => ({
              value: brand.id,
              label: brand.name,
            }))}
          />
          <FormSelect
            label={dictionary.productsPages.category}
            name="categoryId"
            register={register}
            errors={errors}
            required
            options={categories?.map((category) => ({
              value: category.id,
              label: category.name,
            }))}
          />
          <FormSelect
            label={dictionary.categoryPages.sub_category}
            name="subCategoryId"
            register={register}
            errors={errors}
            options={selectedSubCategory?.map((subcategory) => ({
              value: subcategory.id,
              label: subcategory.name,
            }))}
          />
        </div>
      </div>

      {/* Pricing Information Group */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 dark:text-gray-400 border-b pb-2">
          {dictionary.productsPages.pricing}
        </h2>
        <div className="grid grid-cols-1 gap-4">
          <FormInput
            label={dictionary.productsPages.dealer_price}
            name="dealer_price"
            register={register}
            errors={errors}
            placeholder={dictionary.productsPages.dealer_price}
            required
          />
          <FormInput
            label={dictionary.productsPages.retail_price}
            name="retail_price"
            register={register}
            errors={errors}
            placeholder={dictionary.productsPages.retail_price}
          />
          <FormInput
            label={dictionary.productsPages.purchase_price}
            name="purchase_price"
            register={register}
            errors={errors}
            placeholder={dictionary.productsPages.purchase_price}
          />
          <FormInput
            label={`${dictionary.ordersPages.margin} (%)`}
            name="margin"
            register={register}
            errors={errors}
            placeholder={dictionary.ordersPages.margin}
          />
        </div>
      </div>

      {/* Variations Group */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 dark:text-gray-400 border-b pb-2">
          {dictionary.productsPages.variations}
        </h2>
        <div className="space-y-4">
          {/* Existing Variations Display */}
          <div className="grid grid-cols-4  gap-2">
            {watch("variations")?.map((variation, index) => (
              <div
                key={index}
                className="border flex justify-between items-center flex-col gap-4 p-3 rounded-md bg-gray-50 dark:bg-gray-700">
                <img
                  src={variation.img}
                  alt={variation.color}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex flex-col justify-between items-center">
                  <span className="capitalize">
                    {dictionary.productsPages.color} : {variation.color}
                  </span>
                  <span>
                    {dictionary.productsPages.stock} : {variation.stock}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const currentVariations = watch("variations") || [];
                      const updatedVariations = currentVariations.filter(
                        (_, i) => i !== index
                      );
                      setValue("variations", updatedVariations, {
                        shouldValidate: true,
                      });
                    }}
                    className="text-red-500 hover:text-red-700">
                    {dictionary.productsPages.remove}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add New Variation Form */}
          <div className="border p-4 rounded-md bg-gray-50 dark:bg-gray-700">
            <h3 className="text-lg font-medium mb-4 dark:text-gray-400">
              {dictionary.productsPages.add_new_variation}
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <Controller
                name="newVariationImg"
                control={control}
                render={({ field }) => (
                  <SimpleImageUpload
                    onImageChange={field.onChange}
                    folder="product"
                    image={field.value}
                    key={field.value}
                    display="block"
                    dictionary={dictionary}
                  />
                )}
              />
              <FormInput
                label={dictionary.productsPages.color}
                name="newVariationColor"
                register={register}
                errors={errors}
                placeholder={dictionary.productsPages.enter_color}
              />
              <FormInput
                label={dictionary.productsPages.stock}
                name="newVariationStock"
                register={register}
                errors={errors}
                type="number"
                placeholder={dictionary.productsPages.enter_stock_quantity}
              />
            </div>
            <button
              type="button"
              onClick={() => {
                const img = watch("newVariationImg");
                const color = watch("newVariationColor");
                const stock = parseInt(watch("newVariationStock"));

                console.log("Adding Variation - Inputs:", {
                  img,
                  color,
                  stock,
                }); // DEBUG LOG

                if (img && color && stock) {
                  const currentVariations = watch("variations") || [];
                  const updatedVariations = [
                    ...currentVariations,
                    { img, color, stock },
                  ];
                  console.log("Updated Variations List:", updatedVariations); // DEBUG LOG

                  setValue("variations", updatedVariations, {
                    shouldValidate: true,
                  }); // Clear the form

                  setValue("newVariationImg", "", { shouldValidate: true });
                  setValue("newVariationColor", "", { shouldValidate: true });
                  setValue("newVariationStock", "", { shouldValidate: true });
                } else {
                  console.warn("Cannot add variation: Missing fields", {
                    img,
                    color,
                    stock,
                  });
                }
              }}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              {dictionary.productsPages.add_variation}
            </button>
          </div>
        </div>
      </div>

      {/* Description Group */}
      <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 dark:text-gray-400 border-b pb-2">
          {dictionary.productsPages.description}
        </h2>
        <div className="space-y-6">
          <div>
            <label className="block text-lg font-medium mb-2 dark:text-gray-400">
              {dictionary.productsPages.description_english}
            </label>
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
          </div>
          <div>
            <label className="block text-lg font-medium mb-2 text-gray-700 dark:text-gray-400">
              {dictionary.productsPages.description_italian}
            </label>
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
      </div>

      {/* Action Buttons */}
      <div className="col-span-2 flex gap-4 justify-center items-center mt-6">
        <button
          type="submit"
          disabled={isLoading}
          className="flex justify-center gap-1 items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          {isLoading ? (
            <>
              <Loader className="animate-spin" />{" "}
              {dictionary.productsPages.adding}
            </>
          ) : (
            <>
              <Blocks /> {dictionary.productsPages.add_product}
            </>
          )}
        </button>

        <button
          type="button"
          onClick={router.back}
          className="w-36 flex justify-center items-center gap-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
          <ShieldX /> {dictionary.activation.cancel}
        </button>
      </div>
    </form>
  );
}
