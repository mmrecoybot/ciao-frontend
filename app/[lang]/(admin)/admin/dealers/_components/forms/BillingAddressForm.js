
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import Processing from "@/app/[lang]/components/Processing"
import { useUpdateBillingAddressMutation } from "@/store/slices/dealerApi"

const BillingAddressForm = ({ dealer = {}, dealerId = "", setIsOpen, dictionary }) => {
  const [formData, setFormData] = useState({
    id: parseInt(dealerId) || "",
    dealerId: parseInt(dealerId) || "",
    street: dealer.billingAddress?.street || "",
    number: dealer.billingAddress?.number || "",
    zipCode: dealer.billingAddress?.zipCode || "",
    country: dealer.billingAddress?.country || "",
    municipality: dealer.billingAddress?.municipality || "",
    province: dealer.billingAddress?.province || "",
  })

  const [updateBillingAddress, { isLoading, isSuccess, isError, error }] =
    useUpdateBillingAddressMutation();

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    updateBillingAddress(formData)
  }

  useEffect(() => {
    if (isSuccess) {
      toast.success("Billing address updated successfully!")
      setIsOpen(false)
    } else if (isError) {
      toast.error(error?.data?.message || "Failed to update billing address.")
    }
  }, [isSuccess, isError, error])

  return (
    <div
      className="max-w-md mt-8 p-6 bg-white dark:bg-gray-800 dark:text-gray-300 rounded-lg shadow-md mx-auto min-w-96"
      onClick={(e) => e.stopPropagation()}
    >
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200">
        {dictionary.dealersPage.billing_address}
      </h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="dealerId"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {dictionary.orderPages.dealer_name}
          </label>
          <p className="mt-1 px-2 block w-full rounded-md border-gray-300 shadow-sm">
            {dealer.companyName}
          </p>
        </div>

        <div>
          <label
            htmlFor="street"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {dictionary.dealerPages.street}
          </label>
          <input
            type="text"
            id="street"
            name="street"
            value={formData.street}
            onChange={handleChange}
            className="mt-1 px-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        <div>
          <label
            htmlFor="number"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {dictionary.dealerPages.number}
          </label>
          <input
            type="text"
            id="number"
            name="number"
            value={formData.number}
            onChange={handleChange}
            className="mt-1 px-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        <div>
          <label
            htmlFor="zipCode"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {dictionary.dealerPages.zipCode}
          </label>
          <input
            type="text"
            id="zipCode"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleChange}
            className="mt-1 px-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        <div>
          <label
            htmlFor="country"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {dictionary.dealerPages.country}
          </label>
          <input
            type="text"
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="mt-1 px-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        <div>
          <label
            htmlFor="municipality"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {dictionary.dealerPages.municipality}
          </label>
          <input
            type="text"
            id="municipality"
            name="municipality"
            value={formData.municipality}
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
              street: "",
              number: "",
              zipCode: "",
              country: "",
              municipality: "",
              province: ""
            })}
            type="reset"
            className="w-full bg-amber-600 text-white py-2 px-4 rounded-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
          >
            {dictionary.loginPage.reset}
          </button>
        </div>
      </form>
    </div>
  )
}

export default BillingAddressForm
