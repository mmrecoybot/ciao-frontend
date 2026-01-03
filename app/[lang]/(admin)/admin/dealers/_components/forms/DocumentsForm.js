
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import Processing from "@/app/[lang]/components/Processing"
import SimpleImageUpload from "../../../products/new/components/SimpleImageUpload"
import { useAddDocumentMutation } from "@/store/slices/dealerApi"

const DocumentForm = ({ dealer = {}, dealerId = "", setIsOpen, dictionary }) => {
  const [formData, setFormData] = useState({
    dealerId: parseInt(dealerId) ?? "",
    name: "",
    fileUrl: ""
  })

  const [addDocument, { isLoading, isSuccess, isError, error }] =
    useAddDocumentMutation()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    addDocument(formData)
  }

  useEffect(() => {
    if (isSuccess) {
      toast.success("Document added successfully!")
      setIsOpen(false)
    } else if (isError) {
      toast.error(error?.data?.message || "Failed to add document.")
    }
  }, [isSuccess, isError, error])

  return (
    <div
      className="max-w-md mt-8 p-6 bg-white dark:bg-gray-800 dark:text-gray-300 rounded-lg shadow-md mx-auto min-w-96"
      onClick={(e) => e.stopPropagation()}
    >
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200">
        {dictionary.dealersPage.add_document}
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
           {dictionary.dealersPage.document_name}
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
            htmlFor="fileUrl"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {dictionary.dealersPage.file_url}
          </label>
          <SimpleImageUpload dictionary={dictionary} image={formData.fileUrl} onImageChange={(url) => setFormData({ ...formData, fileUrl: url })} folder="documents"/>
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {isLoading ? <Processing /> : `${dictionary.dealersPage.upload_document}`}
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

export default DocumentForm
