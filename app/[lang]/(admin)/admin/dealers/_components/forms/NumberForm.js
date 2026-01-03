import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Processing from "@/app/[lang]/components/Processing";
import { useAddSimMutation } from "@/store/slices/simApi";
import { useFetchCompaniesQuery } from "@/store/slices/companyApi";

const PhoneNumberForm = ({ dealerId, setIsOpen, dictionary }) => {
  const [formData, setFormData] = useState({
    number: "",
    dealerId: parseInt(dealerId),
    companyId: "",
  });

  const [addPhoneNumber, { isLoading, isSuccess, isError, error }] =
    useAddSimMutation();
  const {
    data: companies,
    isLoading: isCompaniesLoading,
    isError: isCompaniesError,
  } = useFetchCompaniesQuery();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    if(formData.number === "") return;
    e.preventDefault();
    addPhoneNumber({
      ...formData,
      companyId: parseInt(formData.companyId),
      dealerId: parseInt(formData.dealerId),
    });
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Phone number added successfully!");
      setIsOpen(false);
    } else if (isError) {
      toast.error(error?.data?.message || "Failed to add phone number.");
    }
  }, [isSuccess, isError, error]);


  return (
    <div className="max-w-md mt-8 min-w-96 p-6 bg-white dark:bg-gray-800 dark:text-gray-300 rounded-lg shadow-md mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200">
        {dictionary.dealersPage.add_phone_number}
      </h2>
      <form className="space-y-8" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="number"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {dictionary.dealersPage.phone_number}
          </label>
          <input
            type="tel"
            id="number"
            name="number"
            value={formData.number}
            onChange={handleChange}
            required
            className="mt-1 px-2 h-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            placeholder="+393671234569"
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="companyId"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {dictionary.activation.company}
          </label>
          <select
            name="companyId"
            id="companyId"
            value={formData.companyId}
            onChange={handleChange}
            className="mt-1 h-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            {isCompaniesLoading ? <option>Loading...</option> : null}
            <option value="">{dictionary.dealersPage.select_company}</option>
            {companies?.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {isLoading ? <Processing /> : `${dictionary.simPage.add_number}`}
          </button>

          <button
            onClick={() => setIsOpen(false)}
            className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            {dictionary.activation.cancel}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PhoneNumberForm;
