"use client";

import {
  useAddBannerMutation,
  useUpdateBannerMutation,
} from "@/store/slices/bannerApi";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

import { toast } from "react-toastify";
import FormInput from "../../components/form/FormInput ";
import SimpleImageUpload from "../../products/new/components/SimpleImageUpload";
import { X } from "lucide-react";

const BannerModal = ({ banner, setOpenModal, dictionary }) => {
  const [
    addBanner,
    { isLoading: addLoading, isSuccess: addSuccess, isError: addError },
  ] = useAddBannerMutation();

  const [
    updateBanner,
    {
      isLoading: updateLoading,
      isSuccess: updateSuccess,
      isError: updateError,
    },
  ] = useUpdateBannerMutation();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: banner?.title || "",
      image: banner?.image || "",
    },
  });

  useEffect(() => {
    if (addSuccess) {
      toast.success("Banner added successfully!");
      setOpenModal(false); // Close the modal
    } else if (updateSuccess) {
      toast.success("Banner updated successfully!");
      setOpenModal(false); // Close the modal
    }

    if (addError) {
      toast.error("Failed to add banner.");
    } else if (updateError) {
      toast.error("Failed to update banner.");
    }
  }, [addSuccess, updateSuccess, addError, updateError, setOpenModal]);

  const onSubmit = (data) => {
    if (banner) {
      if (data.image) {
        // If banner exists, update it
        updateBanner({ ...data, id: banner.id });
      } else {
        toast.error("Please select an image.");
      }
    } else {
      if (data.image) {
        // Otherwise, add a new banner
        addBanner(data);
      } else {
        toast.error("Please select an image.");
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-1/4 bg-white dark:bg-gray-900  p-6 rounded-lg shadow-md relative"
      >
        {/* Close Button */}
        <button
          onClick={() => setOpenModal(false)}
          className="absolute top-3 right-3 bg-emerald-500 p-2  rounded-full flex items-center justify-center text-white"
        >
          <X size={12} />
        </button>
        <div className="flex flex-col gap-4">
          <FormInput
            label={dictionary.customerComponents.title}
            name="title"
            register={register}
            required={true}
            errors={errors}
            type="text"
            placeholder={dictionary.bannerPages.enter_title}
          />
          <Controller
            name="image"
            control={control}
            render={({ field }) => (
              <SimpleImageUpload
                onImageChange={field.onChange}
                folder="Banner"
                image={field.value}
                dictionary={dictionary}
              />
            )}
          />
        </div>
        <button
          type="submit"
          className="bg-emerald-500 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded mt-4"
        >
          {banner
            ? `${dictionary.bannerPages.update_banner}`
            : `${dictionary.bannerPages.add_banner}`}
        </button>
      </form>
    </div>
  );
};

export default BannerModal;
