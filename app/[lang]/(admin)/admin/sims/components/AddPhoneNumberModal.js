import { useState, useEffect } from "react"; // useEffect is already there, just keeping it explicit
import { XIcon } from "lucide-react";
import { useFetchDealersQuery } from "@/store/slices/dealerApi";
import { useFetchCompaniesQuery } from "@/store/slices/companyApi";
import Loading from "@/app/[lang]/(customer)/customer/components/Loading";
// Import the update mutation hook as well
import { useAddSimMutation, useUpdateSimMutation } from "@/store/slices/simApi";
import { toast } from "react-toastify";

// Add simToEdit prop to handle editing
export default function AddEditPhoneNumberModal({
  onClose,
  dictionary,
  simToEdit,
  isDealer,
}) {
  console.log(simToEdit);
  // Initialize state based on simToEdit
  const [number, setNumber] = useState(simToEdit?.number || "");
  // Convert IDs to strings for the select input's value attribute
  const [companyId, setCompanyId] = useState(
    simToEdit?.companyId?.toString() || ""
  );
  const [dealerId, setDealerId] = useState(
    simToEdit?.dealerId?.toString() || ""
  );

  // Fetch data for dropdowns
  const { data: dealers, isLoading: isLoadingDealers } = useFetchDealersQuery();
  const { data: companies, isLoading: isLoadingCompanies } =
    useFetchCompaniesQuery();

  // Add mutation hook
  const [
    addSim,
    {
      isLoading: isAdding,
      isError: isAddError,
      isSuccess: isAddSuccess,
      error: addError,
    },
  ] = useAddSimMutation();

  // Update mutation hook
  const [
    updateSim,
    {
      isLoading: isUpdating,
      isError: isUpdateError,
      isSuccess: isUpdateSuccess,
      error: updateError,
    },
  ] = useUpdateSimMutation();

  // Combine loading and error states for simpler checks
  const isSaving = isAdding || isUpdating;
  const isSaveError = isAddError || isUpdateError;
  const isSaveSuccess = isAddSuccess || isUpdateSuccess;
  const saveError = isAddError ? addError : updateError; // Use error from whichever mutation failed

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      number,
      companyId: Number.parseInt(companyId),
      dealerId: Number.parseInt(dealerId),
    };

    if (simToEdit) {
      // If simToEdit exists, we are updating
      updateSim({ id: simToEdit.id, ...payload });
    } else {
      // Otherwise, we are adding
      addSim(payload);
    }
  };

  // Effect for showing errors
  useEffect(() => {
    if (isSaveError) {
      // Use the error from whichever mutation failed
      toast.error(saveError?.data?.message || "An error occurred."); // Provide a fallback message
    }
  }, [isSaveError, saveError]); // Depend on combined error state and error object

  // Effect for handling success
  useEffect(() => {
    if (isSaveSuccess) {
      // Show different messages based on whether it was add or edit
      const successMessage = simToEdit
        ? dictionary.simPage.update_success ||
          "Phone number updated successfully!" // Use dictionary key if available
        : dictionary.simPage.add_success || "Phone number added successfully!"; // Use dictionary key if available

      toast.success(successMessage);
      onClose(); // Close modal on success
    }
  }, [isSaveSuccess, onClose, simToEdit, dictionary]); // Depend on success state, onClose, simToEdit, and dictionary

  // Determine modal title and button text based on whether we are editing
  const isEditing = !!simToEdit;
  const modalTitle = isEditing
    ? dictionary.simPage.edit_phone_number || "Edit Phone Number" // Add this key to your dictionary
    : dictionary.simPage.add_new_phone_number;

  const submitButtonText = isSaving
    ? isEditing
      ? dictionary.simPage.saving || "Saving..."
      : dictionary.simPage.adding // Add saving key
    : isEditing
    ? dictionary.simPage.save_changes || "Save Changes"
    : dictionary.simPage.add_number; // Add save_changes key

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
      <div className="bg-white dark:bg-slate-700 p-16 rounded-lg shadow-xl max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-gray-700"
        >
          <XIcon className="h-6 w-6" />
        </button>
        <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-gray-100">
          {modalTitle}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="number"
              className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1"
            >
              {dictionary.simPage.phone_number}
            </label>
            <input
              type="tel" // Use tel for phone number
              id="number"
              value={number}
              maxLength={13} // Adjust max/min length as needed
              minLength={10}
              placeholder="+39 320 123 4567" // Placeholder example
              onChange={(e) => setNumber(e.target.value)}
              className="w-full dark:bg-slate-600 dark:text-gray-200 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="companyId"
              className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1"
            >
              {dictionary.activation.company}{" "}
              {/* Assuming this dictionary key is correct */}
            </label>
            {isLoadingCompanies ? (
              <Loading className="w-5 h-5" />
            ) : (
              <>
                <select
                  id="companyId" // Add ID for label association
                  className="w-full dark:bg-slate-600 dark:text-gray-200 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={companyId}
                  required
                  onChange={(e) => setCompanyId(e.target.value)}
                >
                  <option value="">
                    {dictionary.companyPages.select_a_company}{" "}
                    {/* Assuming this dictionary key is correct */}
                  </option>
                  {companies?.map((company) => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
                </select>
              </>
            )}
          </div>
          {!isDealer && (
            <div className="mb-6">
              <label
                htmlFor="dealerId"
                className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1"
              >
                {dictionary.simPage.dealer}
              </label>

              {isLoadingDealers ? (
                <Loading className="w-5 h-5" />
              ) : (
                <>
                  <select
                    id="dealerId" // Add ID for label association
                    className="w-full dark:bg-slate-600 dark:text-gray-200 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={dealerId}
                    required
                    onChange={(e) => setDealerId(e.target.value)}
                  >
                    <option value="">
                      {dictionary.simPage.select_a_dealer}
                    </option>
                    {dealers?.map((dealer) => (
                      <option key={dealer.id} value={dealer.id}>
                        {dealer.companyName}{" "}
                        {/* Assuming dealer object has companyName */}
                      </option>
                    ))}
                  </select>
                </>
              )}
            </div>
          )}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-4 bg-red-400 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded shadow transition duration-300 ease-in-out"
            >
              {dictionary.activation.cancel}{" "}
              {/* Assuming this dictionary key is correct */}
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-4 rounded shadow transition duration-300 ease-in-out"
            >
              {isSaving ? (
                <div className="flex items-center">
                  <Loading className="w-5 h-5 mr-2" /> {submitButtonText}
                </div>
              ) : (
                submitButtonText
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
