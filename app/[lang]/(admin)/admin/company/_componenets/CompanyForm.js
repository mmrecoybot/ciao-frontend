"use client";

import {
  useAddCompanyMutation,
  useUpdateCompanyMutation,
} from "@/store/slices/companyApi";
import { useEffect } from "react";

import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import ImageUpload from "../../products/new/components/ImageUpload";
import SimpleImageUpload from "../../products/new/components/SimpleImageUpload";

const CompanyForm = ({ company, isEdit, setShowForm, dictionary }) => {
  const [
    addCompany,
    { isLoading: addLoading, isSuccess: addSuccess, isError: addError },
  ] = useAddCompanyMutation();

  const [
    updateCompany,
    {
      isLoading: updateLoading,
      isSuccess: updateSuccess,
      isError: updateError,
    },
  ] = useUpdateCompanyMutation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: company?.name || "",
      description: company?.description || "",
      logo: company?.logo || "",
    },
  });

  // const [logoPreview, setLogoPreview] = useState(brand?.logo);

  useEffect(() => {
    if (addSuccess) {
      toast.success("Company added successfully!");
      setShowForm();
    } else if (updateSuccess) {
      toast.success("Company updated successfully!");
      setShowForm();
    }

    if (addError) {
      toast.error(
        `Failed to add Company: ${addError.message || "Unknown error occurred"}`
      );
    } else if (updateError) {
      toast.error(
        `Failed to update Company: ${
          updateError.message || "Unknown error occurred"
        }`
      );
    }
  }, [addSuccess, addError, updateSuccess, updateError]);

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);

    if (data.logo) {
      if (data.logo.size > 2000000) {
        toast.error("File size should be less than 2MB.");
        return;
      }
      formData.append("file", data.logo);
    }

    if (isEdit) {
      updateCompany({
        id: company.id,
        name: data.name,
        description: data.description,
        logo: data.logo
      });
    } else {
      addCompany({
        name: data.name,
        description: data.description,
        logo: data.logo
      });
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
  const handleLogoChange = (file) => {
    setValue("logo", file);
  };
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
      {/* name Input */}
      <div>
        <label htmlFor="name" className="block text-sm font-bold text-gray-700">
        {dictionary.personalDataPage.name}
        </label>
        <input
          id="name"
          type="text"
          placeholder={dictionary.companyPages.please_write_a_name_of_your_company}
          {...register("name", { required: "name is required" })}
          className="mt-1 h-8 px-4 lowercase w-full border border-gray-300 rounded-md shadow-sm bg-inherit placeholder:text-gray-600 dark:placeholder:text-gray-500 sm:text-sm"
        />
        {errors.name && (
          <span className="text-red-500">{errors.name.message}</span>
        )}
      </div>

      {/* description */}
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
          className="mt-1 h-8 px-4 lowercase w-full border border-gray-300 rounded-md shadow-sm bg-inherit placeholder:text-gray-600 dark:placeholder:text-gray-500 sm:text-sm"
        />
        {errors.description && (
          <span className="text-red-500">{errors.description.message}</span>
        )}
      </div>

      {/* Logo Upload */}
      <div className="mt-4">
        <label className="block text-sm font-bold text-gray-700">{dictionary.customerComponents.logo}</label>
        <SimpleImageUpload
          dictionary={dictionary}
          onImageChange={handleLogoChange}
          image={company?.logo}
          className="w-full"
          folder={`company/${company?.name}`}
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={Object.keys(errors).length > 0 || addLoading || updateLoading}
        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white dark:text-gray-400 bg-emerald-500 dark:bg-emerald-800 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
      >
        {addLoading || updateLoading ? `${dictionary.customerComponents.submitting}...` : `${dictionary.customerComponents.submit}`}
      </button>
    </form>
  );
};

export default CompanyForm;
