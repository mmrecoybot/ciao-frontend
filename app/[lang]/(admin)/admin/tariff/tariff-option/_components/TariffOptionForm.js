"use client";

import { useFetchTariffsQuery } from "@/store/slices/tarrifApi";
import { useAddTariffOptionMutation, useUpdateTariffOptionMutation } from "@/store/slices/tarrifOptionApi";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AiFillCloseCircle } from "react-icons/ai";
import { BiCloudUpload } from "react-icons/bi";
import { toast } from "react-toastify";

const TariffOptionForm = ({ tariffOption, isEdit, setShowForm }) => {

  const [
    addTariffOption,
    { isLoading: addLoading, isSuccess: addSuccess, isError: addError },
  ] = useAddTariffOptionMutation();

  const [
    updateTariffOption,
    {
      isLoading: updateLoading,
      isSuccess: updateSuccess,
      isError: updateError,
    },
  ] = useUpdateTariffOptionMutation();

  const {
          data: tariffs,
      } = useFetchTariffsQuery();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: tariffOption?.name || "",
      description: tariffOption?.description || "",
      tarrifId: tariffOption?.tarrifId,
    },
  });

  useEffect(() => {
    if (addSuccess) {
      toast.success("Tariff Option added successfully!");
      setShowForm();
    } else if (updateSuccess) {
      toast.success("Tariff Option updated successfully!");
      setShowForm();
    }

    if (addError) {
      toast.error(
        `Failed to add tariff option: ${addError.message || "Unknown error occurred"}`
      );
    } else if (updateError) {
      toast.error(
        `Failed to update tariff option: ${updateError.message || "Unknown error occurred"
        }`
      );
    }
  }, [addSuccess, updateSuccess, addError, updateError]);

  const onSubmit = async (data) => {
    // const formData = new FormData();
    // formData.append("name", data.name);
    // formData.append("description", data.description);
    // formData.append("category", data.category);



    if (isEdit) {
      // formData.append("id", subCategory.id);
      updateTariffOption({...data, id:tariffOption?.id});
    } else {
      addTariffOption({...data, tarrifId:parseInt(data?.tarrifId)});
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
          Name
        </label>
        <input
          id="name"
          type="text"
          placeholder="Enter tariff option"
          {...register("name", { required: "Tariff option is required" })}
          className="mt-1 h-8 px-4 w-full border border-gray-300 rounded-md shadow-sm bg-inherit placeholder:text-gray-600 dark:placeholder:text-gray-500 sm:text-sm"
        />
        {errors?.name && (
          <span className="text-red-500">{errors?.name.message}</span>
        )}
      </div>

      {/* Description Input */}
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-bold text-gray-700"
        >
          Description
        </label>
        <input
          id="description"
          type="text"
          placeholder="Sub category description"
          {...register("description", { required: "Description is required" })}
          className="mt-1 h-8 px-4 w-full border border-gray-300 rounded-md shadow-sm bg-inherit placeholder:text-gray-600 dark:placeholder:text-gray-500 sm:text-sm"
        />
        {errors?.description && (
          <span className="text-red-500">{errors?.description.message}</span>
        )}
      </div>

      {/* Category Input */}
      <div>
        <label
          htmlFor="tarrifId"
          className="block text-sm font-bold text-gray-700"
        >
          Category
        </label>
        <select
          id="tarrifId"
          {...register("tarrifId")}
          className="mt-1 h-8 px-4 w-full border border-gray-300 bg-inherit rounded-md shadow-sm sm:text-sm"
          defaultValue={1}
        >
          <option value="">select tariff</option>
          {tariffs?.map((tariff) => (
            <option
              key={tariff?.id}
              value={tariff?.id}
            >
              {tariff?.name}
            </option>
          ))}
        </select>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={Object.keys(errors).length > 0 || addLoading || updateLoading}
        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white dark:text-gray-400 bg-indigo-600 dark:bg-indigo-800 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {addLoading || updateLoading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
};

export default TariffOptionForm;
