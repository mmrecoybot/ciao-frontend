"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useAddPermissionMutation, useUpdatePermissionMutation } from "@/store/slices/permissionApi";

const PermissionForm = ({ permission, isEdit, setShowForm, dictionary }) => {

  const [
    addPermission,
    { isLoading: addLoading, isSuccess: addSuccess, isError: addError },
  ] = useAddPermissionMutation();

  const [
    updatePermission,
    {
      isLoading: updateLoading,
      isSuccess: updateSuccess,
      isError: updateError,
    },
  ] = useUpdatePermissionMutation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: permission?.name || "",
      description: permission?.description,
    },
  });

  useEffect(() => {
    if (addSuccess) {
      toast.success("Permission added successfully!");
      setShowForm();
    } else if (updateSuccess) {
      toast.success("Permission updated successfully!");
      setShowForm();
    }

    if (addError) {
      toast.error(
        `Failed to add permission: ${addError.message || "Unknown error occurred"}`
      );
    } else if (updateError) {
      toast.error(
        `Failed to update permission: ${updateError.message || "Unknown error occurred"
        }`
      );
    }
  }, [addSuccess, updateSuccess, addError, updateError]);

  const onSubmit = async (data) => {
    // console.log(data);

    if (isEdit) {
      updatePermission({ ...data, "id": permission?.id });
    } else {
      addPermission(data);
    }
  };

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
          {dictionary.permissionPage.permission_name}
        </label>
        <input
          id="name"
          type="text"
          placeholder={dictionary.permissionPage.enter_permission}
          {...register("name", { required: "permission is required" })}
          className="mt-1 h-8 px-4 w-full border border-gray-300 rounded-md shadow-sm text-black bg-inherit placeholder:text-gray-600 dark:placeholder:text-gray-500 sm:text-sm"
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
          className="mt-1 text-black h-8 px-4 w-full border border-gray-300 rounded-md shadow-sm bg-inherit placeholder:text-gray-600 dark:placeholder:text-gray-500 sm:text-sm"
        />
        {errors?.description && (
          <span className="text-red-500">{errors?.description?.message}</span>
        )}
      </div>

      <button
        type="submit"
        disabled={Object.keys(errors).length > 0 || addLoading || updateLoading}
        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white dark:text-gray-400 bg-emerald-600 dark:bg-emerald-800 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
      >
        {addLoading || updateLoading ? `${dictionary.customerComponents.submitting}...` : `${dictionary.customerComponents.submit}`}
      </button>
    </form>
  );
};

export default PermissionForm;
