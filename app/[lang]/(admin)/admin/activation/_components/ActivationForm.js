"use client";

import { useAddActivationMutation, useUpdateactivAtionMutation } from "@/store/slices/activationApi";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const ActivationForm = ({ activation, isEdit, setShowForm }) => {

      const [
        addCategory,
        { isLoading: addLoading, isSuccess: addSuccess, isError: addError },
      ] = useAddActivationMutation();

      const [
        updateActivation,
        {
          isLoading: updateLoading,
          isSuccess: updateSuccess,
          isError: updateError,
        },
      ] = useUpdateactivAtionMutation();

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm();
    // {
    //     defaultValues: {
    //         name: activation?.name || "",
    //         description: activation?.description || ""
    //     }
    // }

    useEffect(() => {
        if (addSuccess) {
            toast.success("Category added successfully!");
            setShowForm();
        } else if (updateSuccess) {
            toast.success("Category updated successfully!");
            setShowForm();
        }

        if (addError) {
            toast.error(
                `Failed to add Category: ${addError.message || "Unknown error occurred"
                }`
            );
        } else if (updateError) {
            toast.error(
                `Failed to update Category: ${updateError.message || "Unknown error occurred"
                }`
            );
        }
    }, [addSuccess, updateSuccess, addError, updateError]);

    const onSubmit = async (data) => {

        // const formData = new FormData();
        // formData.append("name", data?.name);
        // formData.append("description", data?.description);

        if (isEdit) {
            // formData.append("id", category.id);
            updateCategory({ ...data, "id": category.id });
        } else {
            addCategory({ ...data, "logo": "" });
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
                    placeholder="Enter category name"
                    {...register("name", { required: "Name is required" })}
                    className="mt-1 h-8 px-4 lowercase w-full border border-gray-300 rounded-md shadow-sm bg-inherit placeholder:text-gray-600 dark:placeholder:text-gray-500 sm:text-sm"
                />
                {errors?.name && (
                    <span className="text-red-500">{errors?.name?.message}</span>
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
                    placeholder="Enter category description"
                    {...register("description", { required: "Description is required" })}
                    className="mt-1 h-8 px-4 w-full border border-gray-300 rounded-md shadow-sm bg-inherit placeholder:text-gray-600 dark:placeholder:text-gray-500 sm:text-sm"
                />
                {errors?.description && (
                    <span className="text-red-500">{errors?.description?.message}</span>
                )}
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

export default ActivationForm;