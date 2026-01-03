"use client";

import { useFetchCompaniesQuery } from "@/store/slices/companyApi";
import {
  useAddTariffMutation,
  useUpdateTariffMutation,
} from "@/store/slices/tarrifApi";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const TarrifForm = ({ isEdit, tariff, setShowForm, dictionary }) => {
  const [
    addTariff,
    { isLoading: addLoading, isSuccess: addSuccess, isError: addError },
  ] = useAddTariffMutation();

  const [
    updateTariff,
    {
      isLoading: updateLoading,
      isSuccess: updateSuccess,
      isError: updateError,
    },
  ] = useUpdateTariffMutation();

  const { data: companies } = useFetchCompaniesQuery();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: tariff?.name || "",
      description: tariff?.description || "",
      companyId: tariff?.companyId || "",
      categoryOffer: tariff?.categoryOffer || "voice_data",
      categoryTarrif: tariff?.categoryTarrif || "standard",
      portability: tariff?.portability || "yes",
      client: tariff?.client || "consumer",
      price: tariff?.price || 0,
    },
  });

  useEffect(() => {
    if (addSuccess) {
      toast.success("Tariff added successfully!");
      setShowForm();
    } else if (updateSuccess) {
      toast.success("Tariff updated successfully!");
      setShowForm();
    }

    if (addError) {
      toast.error(
        `Failed to add Tariff: ${addError.message || "Unknown error occurred"}`
      );
    } else if (updateError) {
      toast.error(
        `Failed to update Tariff: ${
          updateError.message || "Unknown error occurred"
        }`
      );
    }
  }, [addSuccess, updateSuccess, addError, updateError]);

  const onSubmit = async (data) => {
    // const formData = new FormData();
    // formData.append("name", data?.name);
    // formData.append("description", data?.description);

    const Data = { ...data, companyId: parseInt(data.companyId) };
    // console.log(Data);

    if (isEdit) {
      // formData.append("id", category.id);
      updateTariff({ ...Data, id: tariff?.id });
    } else {
      addTariff(Data);
    }
  };

  const categoryOffer = [
    {
      id: 1,
      name: "Voice & Data",
      value: "voice_data",
    },
    {
      id: 2,
      name: "Fixed",
      value: "fixed",
    },
  ];

  // const categoryTarrif = [
  //   {
  //     id: 1,
  //     value: "Standard",
  //     name: "Standard",
  //   },
  // ];

  // const portability = [
  //   {
  //     id: 1,
  //     value: true,
  //     name: "Yes",
  //   },
  //   {
  //     id: 2,
  //     value: false,
  //     name: "No",
  //   },
  // ];

  const client = [
    {
      id: 1,
      name: "Consumer",
      value: "consumer",
    },
    {
      id: 2,
      name: "Business",
      value: "business",
    },
  ];

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 p-10 text-left rounded-md min-w-[30rem] xs:min-w-full dark:text-gray-400"
    >
      {/* Name Input */}
      <div>
        <label htmlFor="name" className="block text-sm font-bold text-gray-700">
          {dictionary.personalDataPage.name}
        </label>
        <input
          id="name"
          type="text"
          placeholder={dictionary.tariffPages.enter_name}
          {...register("name", {
            required: `${dictionary.tariffPages.name_is_required}`,
          })}
          className="mt-1 h-8 px-4 w-full border border-gray-300 rounded-md shadow-sm bg-inherit placeholder:text-gray-600 dark:placeholder:text-gray-500 sm:text-sm"
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
          {dictionary.tariffPages.description}
        </label>
        <input
          id="description"
          type="text"
          placeholder={dictionary.brandsPages.enter_description}
          {...register("description", {
            required: `${dictionary.tariffPages.description_is_required}`,
          })}
          className="mt-1 h-8 px-4 w-full border border-gray-300 rounded-md shadow-sm bg-inherit placeholder:text-gray-600 dark:placeholder:text-gray-500 sm:text-sm"
        />
        {errors?.description && (
          <span className="text-red-500">{errors?.description?.message}</span>
        )}
      </div>

      {/* Company Input */}
      <div>
        <label
          htmlFor="companyId"
          className="block text-sm font-bold text-gray-700"
        >
          {dictionary.companyPages.company}
        </label>
        <select
          id="companyId"
          {...register("companyId", {
            required: `${dictionary.tariffPages.company_is_required}`,
          })}
          className="mt-1 h-8 px-4 w-full border border-gray-300 bg-inherit rounded-md shadow-sm sm:text-sm"
        >
          <option value="">{dictionary.tariffPages.select_company}</option>
          {companies?.map((company) => (
            <option key={company?.id} value={company?.id}>
              {company.name}
            </option>
          ))}
        </select>
      </div>

      {/* categoryOffer Input */}
      <div>
        <label
          htmlFor="categoryOffer"
          className="block text-sm font-bold text-gray-700"
        >
          {dictionary.tariffPages.offer_category}
        </label>
        <select
          id="categoryOffer"
          {...register("categoryOffer", {
            // required: `${dictionary.tariffPages.offer_category_is_required}`,
          })}
          className="mt-1 h-8 px-4 w-full border border-gray-300 bg-inherit rounded-md shadow-sm sm:text-sm"
        >
          <option value="">{dictionary.tariffPages.select_category}</option>
          {categoryOffer?.map((category) => (
            <option key={category?.id} value={category?.value}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* categoryTarrif Input */}
      {/* <div>
        <label
          htmlFor="categoryTarrif"
          className="block text-sm font-bold text-gray-700"
        >
          {dictionary.tariffPages.tarrif_category}
        </label>
        <select
          id="categoryTarrif"
          {...register("categoryTarrif", {
            // required: `${dictionary.tariffPages.tariff_category_is_required}`,
          })}
          className="mt-1 h-8 px-4 w-full border border-gray-300 bg-inherit rounded-md shadow-sm sm:text-sm"
        >
          <option value="">
            {dictionary.tariffPages.select_tarrif_category}
          </option>
          {categoryTarrif?.map((category_tarrif) => (
            <option key={category_tarrif?.id} value={category_tarrif?.value}>
              {category_tarrif.name}
            </option>
          ))}
        </select>
      </div> */}

      {/* portability Input */}
      {/* <div>
        <label
          htmlFor="portability"
          className="block text-sm font-bold text-gray-700"
        >
          {dictionary.tariffPages.portability}
        </label>
        <select
          id="portability"
          {...register("portability", {
            // required: `${dictionary.tariffPages.portability_is_required}`,
          })}
          className="mt-1 h-8 px-4 w-full border border-gray-300 bg-inherit rounded-md shadow-sm sm:text-sm"
        >
          <option value="">{dictionary.tariffPages.select_portability}</option>
          {portability?.map((port) => (
            <option key={port?.id} value={port?.value}>
              {port?.name}
            </option>
          ))}
        </select>
      </div> */}

      {/* client Input */}
      <div>
        <label
          htmlFor="client"
          className="block text-sm font-bold text-gray-700"
        >
          {dictionary.tariffPages.client}
        </label>
        <select
          id="client"
          {...register("client", {
            required: `${dictionary.tariffPages.client_is_required}`,
          })}
          className="mt-1 h-8 px-4 w-full border border-gray-300 bg-inherit rounded-md shadow-sm sm:text-sm"
        >
          <option value="">{dictionary.tariffPages.select_client}</option>
          {client?.map((cli) => (
            <option key={cli?.id} value={cli?.value}>
              {cli.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label
          htmlFor="price"
          className="block text-sm font-bold text-gray-700"
        >
          {dictionary.tariffPages.price}
        </label>
        <input
          type="decimal"
          id="price"
          {...register("price", {
            required: `${dictionary.tariffPages.price_is_required}`,
          })}
          className="mt-1 h-8 px-4 w-full border border-gray-300 bg-inherit rounded-md shadow-sm sm:text-sm"
        />
        {errors.price && (
          <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={Object.keys(errors).length > 0 || addLoading || updateLoading}
        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white dark:text-gray-400 bg-emerald-500 dark:bg-emerald-800 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
      >
        {addLoading || updateLoading
          ? `${dictionary.customerComponents.submitting}...`
          : `${dictionary.customerComponents.submit}`}
      </button>
    </form>
  );
};

export default TarrifForm;
