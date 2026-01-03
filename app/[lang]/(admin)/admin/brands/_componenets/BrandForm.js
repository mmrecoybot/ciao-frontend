"use client";

import {
  useAddBrandMutation,
  useUpdateBrandMutation,
} from "@/store/slices/brandApi";
import { useFetchCategoriesQuery } from "@/store/slices/CategoryApi";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AiFillCloseCircle } from "react-icons/ai";
import { BiCloudUpload } from "react-icons/bi";
import { toast } from "react-toastify";

const BrandForm = ({ brand, isEdit, setShowForm, dictionary }) => {

  const [
    addBrand,
    { isLoading: addLoading, isSuccess: addSuccess, isError: addError },
  ] = useAddBrandMutation();

  const [
    updateBrand,
    {
      isLoading: updateLoading,
      isSuccess: updateSuccess,
      isError: updateError,
    },
  ] = useUpdateBrandMutation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: brand?.name || "",
      description: brand?.description,
      // logo: brand?.logo || null,
      logo: brand?.logo || "",
    },
  });

  // const [logoPreview, setLogoPreview] = useState(brand?.logo);

  useEffect(() => {
    if (addSuccess) {
      toast.success("Brand added successfully!");
      setShowForm();
    } else if (updateSuccess) {
      toast.success("Brand updated successfully!");
      setShowForm();
    }

    if (addError) {
      toast.error(
        `Failed to add brand: ${addError.message || "Unknown error occurred"}`
      );
    } else if (updateError) {
      toast.error(
        `Failed to update brand: ${
          updateError.message || "Unknown error occurred"
        }`
      );
    }
  }, [addSuccess, updateSuccess, addError, updateError]);

  const onSubmit = async (data) => {
    // console.log(Data);
    

    // const formData = new FormData();
    // formData.append("name", data.name);
    // formData.append("description", data.description);

    // if (data.logo) {
    //   if (data.logo.size > 2000000) {
    //     toast.error("File size should be less than 2MB.");
    //     return;
    //   }
    //   formData.append("file", data.logo);
    // }

    if (isEdit) {

      updateBrand({...data, "id": brand.id});

    } else {
      addBrand({...data, "logo":""});
    }
  };

  // const handleLogoChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file.size > 2000000) {
  //     toast.error("File size should be less than 2MB.");
  //     return;
  //   }
  //   setLogoPreview(URL.createObjectURL(file));
  //   setValue("logo", file);
  // };

  // const handleRemoveLogo = (e) => {
  //   e.preventDefault();
  //   setValue("logo", null);
  //   setLogoPreview(null);
  // };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 p-10 text-left rounded-md min-w-[30rem] xs:min-w-full dark:text-gray-400"
    >
      {/* Name Input */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-bold text-gray-700"
        >
          {dictionary.personalDataPage.name}
        </label>
        <input
          id="name"
          type="text"
          placeholder={dictionary.brandsPages.enter_your_brand_name}
          {...register("name", { required: "Name is required" })}
          className="mt-1 h-8 px-4 w-full border border-gray-300 rounded-md shadow-sm bg-inherit placeholder:text-gray-600 dark:placeholder:text-gray-500 sm:text-sm"
        />
        {errors.name && (
          <span className="text-red-500">{errors?.name?.message}</span>
        )}
      </div>

      {/* Description Input */}
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-bold text-gray-700"
        >
          {dictionary.tariffPages.description}
        </label>
        <input
          id="description"
          type="text"
          placeholder={dictionary.brandsPages.enter_description}
          {...register("description", { required: "Description is required" })}
          className="mt-1 h-8 px-4  w-full border border-gray-300 rounded-md shadow-sm bg-inherit placeholder:text-gray-600 dark:placeholder:text-gray-500 sm:text-sm"
        />
        {errors?.description && (
          <span className="text-red-500">{errors?.description?.message}</span>
        )}
      </div>

      {/* Logo Upload */}
      {/* <div>
        <label
          htmlFor="logo"
          className="block text-sm font-bold text-gray-700 "
        >
          Logo
        </label>
        <div className="flex items-center justify-center">
          <label
            htmlFor="logo-input"
            className="relative border  overflow-hidden border-dashed border-gray-600 dark:text-gray-400 px-4 py-2 rounded-full cursor-pointer w-48 h-48 text-sm flex items-center justify-center flex-col gap-2"
          >
            <BiCloudUpload className="text-3xl" /> Upload Logo
            {logoPreview && (
              <div className="absolute top-0 left-0 right-0 bg-black rounded-full">
                <Image
                  src={logoPreview}
                  alt="Logo Preview"
                  className="object-fill w-48 h-48 rounded-full opacity-40"
                  width={150}
                  height={150}
                />
                <button
                  onClick={handleRemoveLogo}
                  className="absolute top-20 right-[4.5rem] ring-1 rounded-full bg-red-500 hover:bg-red-600 p-1"
                  aria-label="Remove Logo"
                >
                  <AiFillCloseCircle className="text-4xl" />
                </button>
              </div>
            )}
          </label>
          <input
            id="logo-input"
            type="file"
            {...register("logo")}
            className="hidden"
            onChange={handleLogoChange}
          />
        </div>
      </div> */}

      {/* Category Input */}
      {/* <div>
        <label
          htmlFor="category"
          className="block text-sm font-bold text-gray-700"
        >
          Category
        </label>
        <select
          id="category"
          {...register("category")}
          className="mt-1 h-8 px-4 w-full border border-gray-300 bg-inherit rounded-md shadow-sm sm:text-sm"
          defaultValue={"smartphone"}
          // disabled
        >
          <option value="">select category</option>
          {data?.categories?.map((category) => (
            <option
              key={category._id}
              value={category?._id}
            >
              {category.categoryName}
            </option>
          ))}
        </select>
      </div> */}

      <button
        type="submit"
        disabled={Object.keys(errors).length > 0 || addLoading || updateLoading}
        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-400 bg-emerald-100 dark:bg-emerald-800 hover:bg-emerald-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
      >
        {addLoading || updateLoading ? `${dictionary.customerComponents.submitting}...` : `${dictionary.customerComponents.submit}`}
      </button>
    </form>
  );
};

export default BrandForm;
