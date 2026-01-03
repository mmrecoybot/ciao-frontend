
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import Processing from "@/app/[lang]/components/Processing"
import { useUpdateDealerMutation } from "@/store/slices/dealerApi"

const GeneralInfoForm = ({ dealer, setIsOpen, dictionary }) => {
  const [formData, setFormData] = useState({
    id: dealer.id || "",
    company_name: dealer.companyName || "",
    vat_number: dealer.vatNumber || "",
    tax_code: dealer.taxCode || "",
    admin_phone: dealer.adminPhone || "",
    pec_email: dealer.pecEmail || "",
    admin_email: dealer.adminEmail || "",
    iban: dealer.iban || "",
    payment_method: dealer.paymentMethod || "",
    account_number: dealer.accountNumber || "",
    recovery_email: dealer.recoveryEmail || "",
    website_url: dealer.websiteUrl || ""
  })

  const [updateDealer, { isLoading, isSuccess, isError, error }] =
    useUpdateDealerMutation()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    updateDealer(formData)
  }

  useEffect(() => {
    if (isSuccess) {
      toast.success("Dealer information updated successfully!")
      setIsOpen(false)
    } else if (isError) {
      toast.error(error?.data?.message || "Failed to update dealer information.")
    }
  }, [isSuccess, isError, error])

  return (
    <div
      className="max-w-2xl mt-8 p-6 bg-white dark:bg-gray-800 dark:text-gray-300 rounded-lg shadow-md mx-auto"
      onClick={(e) => e.stopPropagation()}
    >
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200">
        {dictionary.dealersPage.update_dealer_information}
      </h2>
      <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="company_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {dictionary.dealersPage.company_name}
          </label>
          <input
            type="text"
            id="company_name"
            name="company_name"
            value={formData.company_name}
            onChange={handleChange}
            className="mt-1 px-2 h-10 border block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        <div>
          <label htmlFor="vat_number" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {dictionary.dealerPages.vatNumber}
          </label>
          <input
            type="text"
            id="vat_number"
            name="vat_number"
            value={formData.vat_number}
            onChange={handleChange}
            className="mt-1 px-2 h-10 border block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        <div>
          <label htmlFor="tax_code" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {dictionary.dealerPages.taxCode}
          </label>
          <input
            type="text"
            id="tax_code"
            name="tax_code"
            value={formData.tax_code}
            onChange={handleChange}
            className="mt-1 px-2 h-10 border block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        <div>
          <label htmlFor="admin_phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {dictionary.dealerPages.adminPhone}
          </label>
          <input
            type="tel"
            id="admin_phone"
            name="admin_phone"
            value={formData.admin_phone}
            onChange={handleChange}
            className="mt-1 px-2 h-10 border block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        <div>
          <label htmlFor="pec_email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {dictionary.dealerPages.pecEmail}
          </label>
          <input
            type="email"
            id="pec_email"
            name="pec_email"
            value={formData.pec_email}
            onChange={handleChange}
            className="mt-1 px-2 h-10 border block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        <div>
          <label htmlFor="admin_email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {dictionary.dealerPages.adminEmail}
          </label>
          <input
            type="email"
            id="admin_email"
            name="admin_email"
            value={formData.admin_email}
            onChange={handleChange}
            className="mt-1 px-2 h-10 border block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        <div>
          <label htmlFor="iban" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {dictionary.dealerPages.iban}
          </label>
          <input
            type="text"
            id="iban"
            name="iban"
            value={formData.iban}
            onChange={handleChange}
            className="mt-1 px-2 h-10 border block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        <div>
          <label htmlFor="payment_method" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {dictionary.dealerPages.paymentMethod}
          </label>
          <input
            type="text"
            id="payment_method"
            name="payment_method"
            value={formData.payment_method}
            onChange={handleChange}
            className="mt-1 px-2 h-10 border block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        <div>
          <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {dictionary.dealerPages.accountNumber}
          </label>
          <input
            type="text"
            id="account_number"
            name="account_number"
            value={formData.account_number}
            onChange={handleChange}
            className="mt-1 px-2 h-10 border block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        <div>
          <label htmlFor="recovery_email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {dictionary.dealerPages.recoveryEmail}
          </label>
          <input
            type="email"
            id="recovery_email"
            name="recovery_email"
            value={formData.recovery_email}
            onChange={handleChange}
            className="mt-1 px-2 h-10 border block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        <div className="col-span-2">
          <label htmlFor="website_url" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {dictionary.dealerPages.websiteUrl}
          </label>
          <input
            type="url"
            id="website_url"
            name="website_url"
            value={formData.website_url}
            onChange={handleChange}
            className="mt-1 px-2 h-10 border block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        <div className="col-span-2 flex gap-2">
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {isLoading ? <Processing /> : `${dictionary.dealersPage.update_dealer}`}
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
  )
}

export default GeneralInfoForm
