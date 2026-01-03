
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import Processing from "@/app/[lang]/components/Processing"
import { useAddSignedContractMutation } from "@/store/slices/dealerApi"
import SimpleImageUpload from "../../../products/new/components/SimpleImageUpload"

const ContractForm = ({ dealer = {}, dealerId = "", setIsOpen, dictionary }) => {
  const [formData, setFormData] = useState({
    dealerId: parseInt(dealerId) ?? "",
    name: "",
    signedOn: "",
    fileUrl: ""
  })

  const [addContract, { isLoading, isSuccess, isError, error }] =
    useAddSignedContractMutation()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    addContract({
      ...formData,
      signedOn: new Date(formData.signedOn).toISOString(),
    })
  }

  useEffect(() => {
    if (isSuccess) {
      toast.success("Contract added successfully!")
      setIsOpen(false)
    } else if (isError) {
      toast.error(error?.data?.message || "Failed to add contract.")
    }
  }, [isSuccess, isError, error])

  return (
    <div
      className="max-w-md mt-8 p-6 bg-white dark:bg-gray-800 dark:text-gray-300 rounded-lg shadow-md mx-auto min-w-96"
      onClick={(e) => e.stopPropagation()}
    >
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200">
        {dictionary.dealersPage.contract_information}
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
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {dictionary.dealersPage.contract_name}
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
            htmlFor="signedOn"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {dictionary.dealersPage.signed_date}
          </label>
          <input
            type="datetime-local"
            id="signedOn"
            name="signedOn"
            value={formData.signedOn}
            onChange={handleChange}
            className="mt-1 px-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        <div>
          <label
            htmlFor="fileUrl"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
           {dictionary.dealerPages.documents}
          </label>
          <SimpleImageUpload dictionary={dictionary} image={formData.fileUrl} onImageChange={(url) => setFormData((prev) => ({ ...prev, fileUrl: url }))} folder="contract"/>
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
              signedOn: "",
              fileUrl: ""
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

export default ContractForm
