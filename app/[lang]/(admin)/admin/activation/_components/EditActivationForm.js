"use client";

import { useUpdateActivationMutation } from "@/store/slices/activationApi";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import FormSelect from "../../components/form/FormSelect";
import FormInput from "../../components/form/FormInput ";
import SimpleImageUpload from "../../products/new/components/SimpleImageUpload";

const statusOptions = [
  { id: 1, name: "pending", value: "pending" },
  { id: 2, name: "processing", value: "processing" },
  { id: 3, name: "active", value: "active" },
  { id: 5, name: "cancelled", value: "cancelled" },
];

const EditActivationForm = ({
  activation,
  isEdit,
  setShowForm,
  dictionary,
}) => {
  const [
    updateActivation,
    {
      isLoading: updateLoading,
      isSuccess: updateSuccess,
      isError: updateError,
    },
  ] = useUpdateActivationMutation();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues:{
      status:activation.status
    }
  });

  useEffect(() => {
    if (updateSuccess) {
      toast.success("Activation updated successfully!");
      setShowForm();
    }

    if (updateError) {
      toast.error(
        `Failed to update Activation: ${
          updateError.message || "Unknown error occurred"
        }`
      );
    }
  }, [updateSuccess, updateError]);

  const onSubmit = async (data) => {
    if (isEdit) {
      updateActivation({ ...data, id: activation.id });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 p-10 text-left rounded-md min-w-[30rem] xs:min-w-full dark:text-gray-400"
    >
      <FormSelect
        name="status"
        label={dictionary.ordersPages.status}
        register={register}
        errors={errors}
        options={statusOptions.map((option) => ({
          ...option,
          label: option.name,
        }))}
        setValue={setValue}
        required={true}
      />

      <FormInput
        name="remarks"
        label={dictionary.orderPages.comments_or_remarks}
        register={register}
        errors={errors}
        setValue={setValue}
        required={true}
        placeholder={dictionary.orderPages.enter_comments_or_remarks}
      />
      {watch("status") === "active" && (
        <>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">
            Activation Document
          </label>
          <SimpleImageUpload
            dictionary={dictionary}
            onImageChange={(image) => setValue("activationDocuments", image)}
            image={activation?.activationDocuments}
            folder="activation"
            // display="block"
          />
        </>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={Object.keys(errors).length > 0 || updateLoading}
        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white dark:text-gray-400 bg-emerald-600 dark:bg-emerald-800 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
      >
        {updateLoading ? dictionary.customerComponents.submitting : dictionary.customerComponents.submit}
      </button>
    </form>
  );
};

export default EditActivationForm;
