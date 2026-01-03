import React from "react";
import { Search, RotateCw } from "lucide-react";
import { useForm } from "react-hook-form";

export default function FilterForm({ dictionary, filterValue, setFilterValue}) {
  const { register, handleSubmit, reset } = useForm();
  const onSubmit = (data) => {
    setFilterValue(data);
  };
  return (
    <form
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="space-y-2">
        <label className="text-sm text-gray-500">{dictionary.activation.company_name}</label>
        <input
          {...register("companyName")}
          type="text"
          placeholder={dictionary.activation.company_name}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm text-gray-500">{dictionary.activation.sim_serial}</label>
        <input
          {...register("simSerial")}
          type="text"
          placeholder={dictionary.activation.sim_serial}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm text-gray-500">{dictionary.activation.creation_date}</label>
        <input
          {...register("creationDate")}
          type="date"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm text-gray-500">{dictionary.activation.activation_id}</label>
        <input
          {...register("activationId")}
          type="text"
          placeholder={dictionary.activation.activation_id}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm text-gray-500">{dictionary.activation.mood_of_payment}</label>
        <input
          {...register("moodOfPayment")}
          type="text"
          placeholder={dictionary.activation.mood_of_payment}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm text-gray-500">{dictionary.activation.activation_date}</label>
        <input
          {...register("activationDate")}
          type="date"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>


      <div className="flex items-end gap-2">
        <button
          type="submit"
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <Search className="w-4 h-4" />
          {dictionary.activation.search}
        </button>
        <button
          type="reset"
          onClick={() => {
            reset();
            setFilterValue({
              companyName: "",
              simSerial: "",
              creationDate: "",
              activationId: "",
              activationDate: "",
              moodOfPayment: "",
            });
          }}
          className="p-2 px-6 border flex items-center gap-2 border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <RotateCw className="w-4 h-4 text-gray-500" /> {dictionary.ordersPages.reset}
        </button>
      </div>
    </form>
  );
}
