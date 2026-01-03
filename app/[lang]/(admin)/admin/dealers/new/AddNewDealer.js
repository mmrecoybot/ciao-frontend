"use client";

import BackButton from "@/app/[lang]/(customer)/customer/components/ui/BackButton";
import { useAddDealerMutation } from "@/store/slices/dealerApi";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const AddNewDealer = ({ params, dictionary }) => {
  const router = useRouter();
  const [addDealer, { isLoading }] = useAddDealerMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      // Filter out empty optional fields if the API prefers that,
      // otherwise submit all fields including empty strings for optional ones.
      // Assuming submitting empty strings is acceptable:
      await addDealer(data).unwrap();
      toast.success("Dealer added successfully!");
      // Redirect to dealers list, assuming the route is correct
      router.push("/admin/dealers");
    } catch (error) {
      console.error("Failed to add dealer:", error); // Log error for debugging
      // Display a more informative error if possible, check error.data or error.message
      toast.error("Failed to add dealer. Please try again.");
    }
  };

  const handleClear = () => {
    reset();
  };

  const inputStyles =
    "w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5";
  const labelStyles = "block mb-2 text-sm font-medium text-gray-900";
  const errorStyles = "mt-1 text-sm text-red-600";

  // Define the internal field names that will be used for form registration and API payload
  const fieldNames = [
    "company_name",
    "admin_phone",
    "admin_email",
    "tax_code",
    "vat_number",
    "pec_email",
    "recovery_email",
    "iban",
    "account_number",
    "payment_method",
    "website_url",
  ];

  // Define which fields are mandatory
  const requiredFields = ["company_name", "admin_phone", "admin_email"];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Assuming BackButton works correctly in this context */}
        {/* <BackButton />  - Consider removing or adjusting BackButton if it's not universally applicable or styled */}
        <div className="bg-emerald-200 px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            {dictionary.dealersPage.add_new_dealer}
          </h1>
          {/* Add a BackButton here if needed, styled appropriately */}
          <button
            onClick={() => router.back()} // Use router.back() for simplicity
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            {/* Assuming 'back' is in your dictionary or use a static string if acceptable */}
            {dictionary.general?.back || "Back"}
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fieldNames.map((fieldName) => {
              const isRequired = requiredFields.includes(fieldName);
              // Get the label from the dictionary using the field name as the key.
              // Fallback to a basic formatted version of the field name if not found.
              const labelKey = fieldName;

              const label = dictionary.dealersPage[fieldName];

              return (
                <div key={fieldName}>
                  <label htmlFor={fieldName} className={labelStyles}>
                    {label}
                    {isRequired && <span className="text-red-500">*</span>}{" "}
                    {/* Add required indicator */}
                  </label>
                  <input
                    type={
                      fieldName.toLowerCase().includes("email")
                        ? "email"
                        : "text"
                    }
                    id={fieldName}
                    {...register(fieldName, {
                      required: isRequired ? `${label} is required` : false,
                    })}
                    className={inputStyles}
                  />
                  {errors[fieldName] && (
                    <p className={errorStyles}>{errors[fieldName]?.message}</p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex justify-center space-x-4">
            <button
              type="button"
              onClick={handleClear}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              {dictionary.dealersPage.clear}
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-emerald-400 rounded-lg hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
            >
              {isLoading
                ? `${dictionary.dealersPage.adding}...`
                : `${dictionary.dealersPage.add_dealer}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewDealer;

const toCamelCase = (snakeStr) => {
  return snakeStr.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
};
