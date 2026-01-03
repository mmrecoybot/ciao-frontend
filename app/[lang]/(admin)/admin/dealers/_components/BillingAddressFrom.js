import { useUpdateBillingAddressMutation } from "@/store/slices/dealerApi";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

// Styles
const inputFieldStyles =
  "w-full rounded-md border border-gray-300 py-2 px-4 outline-none transition-all duration-300 focus:border-blue-500 mt-2";
const labelStyles = "text-sm font-semibold text-gray-700 mt-2 capitalize";

function BillingAddressForm({ onSubmit, billingAddress, dealerId }) {
  const [formData, setFormData] = useState({
    street: "",
    number: "",
    zipCode: "",
    country: "",
    municipality: "",
    province: "",
  });

  const [updateBillingAddress, { isLoading, isError, isSuccess, error }] =
    useUpdateBillingAddressMutation();

  // Populate form with existing billing address
  useEffect(() => {
    if (billingAddress) {
      setFormData({
        street: billingAddress.street || "",
        number: billingAddress.number || "",
        zipCode: billingAddress.zipCode || "",
        country: billingAddress.country || "",
        municipality: billingAddress.municipality || "",
        province: billingAddress.province || "",
      });
    }
  }, [billingAddress]);

  // Handle toast messages for success and error
  useEffect(() => {
    if (isSuccess) {
      toast.success("Billing address updated successfully!");
      if (onSubmit) onSubmit();
    } else if (isError) {
      toast.error(error?.data?.message || "Failed to update billing address.");
    }
  }, [isSuccess, isError, error, onSubmit]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateBillingAddress({ ...formData, id: dealerId }).unwrap();
    } catch (err) {
      console.error("Error updating billing address:", err);
    }
  };

  // Handle form reset
  const handleReset = () => {
    setFormData({
      street: "",
      number: "",
      zipCode: "",
      country: "",
      municipality: "",
      province: "",
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {Object.keys(formData).map((key, index) => (
        <div key={index} className="mb-4 flex flex-col items-start">
          <label htmlFor={key} className={labelStyles}>
            {key.replace(/([A-Z])/g, " $1")}
          </label>
          <input
            type="text"
            id={key}
            name={key}
            value={formData[key]}
            onChange={handleInputChange}
            placeholder={`Enter ${key}`}
            className={inputFieldStyles}
          />
        </div>
      ))}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={handleReset}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
        >
          Reset
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-[#3c8dde] rounded hover:bg-[#327acb]"
        >
          {isLoading ? "Updating..." : "Update Address"}
        </button>
      </div>
    </form>
  );
}

export default BillingAddressForm;
