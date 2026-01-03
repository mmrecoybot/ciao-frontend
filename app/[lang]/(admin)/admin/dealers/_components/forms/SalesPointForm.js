import Processing from "@/app/[lang]/components/Processing";
import { useAddSalesPointMutation } from "@/store/slices/dealerApi";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const SalesPointForm = ({ dealer = {}, dealerId = "", setIsOpen, dictionary }) => {
  const [formData, setFormData] = useState({
    dealerId: parseInt(dealerId) ?? "",
    name: dealer.name ?? "",
    address: dealer.address ?? "",
    city: dealer.city ?? "",
    province: dealer.province ?? "",
    phoneNumber: dealer.phoneNumber ?? "",
  });
  const [addSalesPoint, { isLoading, isSuccess, isError, error }] =
    useAddSalesPointMutation();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    addSalesPoint(formData);
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Sales point added successfully!");
      setIsOpen(false);
    } else if (isError) {
      toast.error(error?.data?.message || "Failed to add sales point.");
    }
  }, [isSuccess, isError, error]);

  return (
    <div
      className="max-w-md mt-8 p-6 bg-white dark:bg-gray-800 dark:text-gray-300 rounded-lg shadow-md mx-auto min-w-96"
      onClick={(e) => e.stopPropagation()}
    >
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200">
        {dictionary.dealersPage.sales_point_information}
      </h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="dealerId"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {dictionary.orderPages.dealer_name}
          </label>
          <p className="mt-1 px-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
            {dealer.companyName}
          </p>
        </div>

        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {dictionary.personalDataPage.name}
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 px-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        <div>
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {dictionary.personalDataPage.address}
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="mt-1 px-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        <div>
          <label
            htmlFor="city"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {dictionary.personalDataPage.city}
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="mt-1 px-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        <div>
          <label
            htmlFor="province"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {dictionary.dealerPages.province}
          </label>
          <input
            type="text"
            id="province"
            name="province"
            value={formData.province}
            onChange={handleChange}
            className="mt-1 px-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        <div>
          <label
            htmlFor="phoneNumber"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {dictionary.dealersPage.phone_number}
          </label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="mt-1 px-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {isLoading ? <Processing /> : `${dictionary.customerComponents.submit}`}
        </button>
        <div className="flex gap-2">

          <button
            onClick={() => setIsOpen(false)}
            className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            {dictionary.activation.cancel}
          </button>
          <button
            onClick={() => setFormData({
              dealerId: parseInt(dealerId) ?? "",
              name: "",
              address: "",
              city: "",
              province: "",
              phoneNumber: "",
            })}
            type="reset" className="w-full bg-amber-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">{dictionary.loginPage.reset}</button>
        </div>
      </form>
    </div>
  );
};

export default SalesPointForm;
