"use client";

import { useAddRoleMutation, useUpdateRoleMutation } from "@/store/slices/roleApi";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const RoleForm = ({ role, isEdit, setShowForm, dictionary }) => {

  const [
    addRole,
    { isLoading: addLoading, isSuccess: addSuccess, isError: addError },
  ] = useAddRoleMutation();

  const [
    updateRole,
    {
      isLoading: updateLoading,
      isSuccess: updateSuccess,
      isError: updateError,
    },
  ] = useUpdateRoleMutation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: role?.name || "",
      description: role?.description,
    },
  });

  useEffect(() => {
    if (addSuccess) {
      toast.success("Role added successfully!");
      setShowForm();
    } else if (updateSuccess) {
      toast.success("Role updated successfully!");
      setShowForm();
    }

    if (addError) {
      toast.error(
        `Failed to add Role: ${addError.message || "Unknown error occurred"}`
      );
    } else if (updateError) {
      toast.error(
        `Failed to update Role: ${updateError.message || "Unknown error occurred"
        }`
      );
    }
  }, [addSuccess, updateSuccess, addError, updateError]);

  const onSubmit = async (data) => {
    // console.log(data);

    if (isEdit) {
      updateRole({ ...data, "id": role.id });

    } else {
      addRole(data);
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
          {dictionary.personalDataPage.name}
        </label>
        <input
          id="name"
          type="text"
          placeholder={dictionary.tariffPages.enter_name}
          {...register("name", { required: "Name is required" })}
          className="mt-1 h-8 text-black px-4 w-full border border-gray-300 rounded-md shadow-sm bg-inherit placeholder:text-gray-600 dark:placeholder:text-gray-500 sm:text-sm"
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
          className="mt-1 h-8 px-4  text-black w-full border border-gray-300 rounded-md shadow-sm bg-inherit placeholder:text-gray-600 dark:placeholder:text-gray-500 sm:text-sm"
        />
        {errors?.description && (
          <span className="text-red-500">{errors?.description?.message}</span>
        )}
      </div>

      <button
        type="submit"
        disabled={Object.keys(errors).length > 0 || addLoading || updateLoading}
        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white dark:text-gray-400  bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
      >
        {addLoading || updateLoading ? `${dictionary.customerComponents.submitting}...` : `${dictionary.customerComponents.submit}`}
      </button>
    </form>
  );
};

export default RoleForm;
