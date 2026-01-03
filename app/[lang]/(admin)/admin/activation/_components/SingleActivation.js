import { useFetchSingleActivationsQuery } from "@/store/slices/activationApi";
import Image from "next/image";
import React from "react";
import Loading from "../../components/Loading";
import { DocumentPreview } from "../../orders/_components/AdminDashboard";
import EditButtonActivation from "./EditButton";

const ClientDetails = ({ dictionary, id, customer = false }) => {
  const { data: singleActivationData, isLoading } =
    useFetchSingleActivationsQuery(id);
  if (isLoading) return <Loading />;
  if (!singleActivationData) return null;
  const {
    client,
    portability,
    categoryOffer,
    categoryTarrif,
    moodOfPayment,
    paymentDocument,
    paymentDate,
    paymentStatus,
    activationDate,
    status,
    serialNumber,
    createdAt,
    updatedAt,
    company,
    tarrif,
    name,
    details,
    price,
    user,
  } = singleActivationData;


  return (
    <div className="max-w-6xl mx-auto p-6 relative">
      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Client Card */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {dictionary.activation.client_information}
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">
                  {dictionary.activation.client_type}
                </p>
                <p className="text-gray-700 font-medium">{client}</p>
              </div>
              {/* <div>
                <p className="text-sm text-gray-500">
                  {dictionary.tariffPages.portability}
                </p>
                <p className="text-gray-700 font-medium">
                  {portability ? "Available" : "Not Available"}
                </p>
              </div> */}
              <div>
                <p className="text-sm text-gray-500">
                  {dictionary.activation.offer_category}
                </p>
                <p className="text-gray-700 font-medium">{categoryOffer}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">
                  {dictionary.activation.category_tariff}
                </p>
                <p className="text-gray-700 font-medium">{categoryTarrif}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">
                  {dictionary.activation.mood_of_payment}
                </p>
                <p className="text-gray-700 font-medium">{moodOfPayment}</p>
              </div>
            </div>
          </div>

          {/* Payment Card */}
          <div className="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {dictionary.activation.payment_details}
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">
                  {dictionary.activation.payment_document}
                </p>
                <DocumentPreview title="" url={paymentDocument} />
              </div>
              <div>
                <p className="text-sm text-gray-500">
                  {dictionary.activation.payment_date}
                </p>
                <p className="text-gray-700 font-medium">
                  {new Date(paymentDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">
                  {dictionary.activationsPages.payment_status}
                </p>
                <p className="text-gray-700 font-medium">
                  {paymentStatus || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">
                  {dictionary.activation.activation_date}
                </p>
                <p className="text-gray-700 font-medium">
                  {activationDate
                    ? new Date(activationDate).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* serial Number */}
          <div className="bg-gradient-to-br from-green-200 to-blue-50 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {dictionary.activation.activation_number}
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-gray-700 font-medium">
                  {serialNumber?.number}
                </p>
              </div>
            </div>
          </div>
          {/* Company Card */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {dictionary.activation.company_details}
            </h2>
            <div className="flex items-center space-x-4">
              <Image
                width={64}
                height={64}
                src={company.logo}
                alt="Company Logo"
                className="p-2 w-16 h-16 rounded-md border-2 border-white shadow-md"
              />
              <div>
                <p className="text-lg font-semibold text-gray-800">
                  {company.name}
                </p>
                <p className="text-sm text-gray-500">{company.description}</p>
              </div>
            </div>
          </div>

          {/* Tariff Card */}
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {dictionary.activation.tariff_details}
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">
                  {dictionary.activation.tariff_name}
                </p>
                <p className="text-gray-700 font-medium">{name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">
                  {dictionary.activation.tariff_description}
                </p>
                <p className="text-gray-700 font-medium">
                  {details}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">
                  {dictionary.orderPages.price}
                </p>
                <p className="text-gray-700 font-medium">€{price}</p>
              </div>
            </div>
          </div>

          {/* User Card */}
          <div className="bg-gradient-to-br from-pink-50 to-red-50 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {dictionary.userPages.user_information}
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">
                  {dictionary.personalDataPage.name}
                </p>
                <p className="text-gray-700 font-medium">{user.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">
                  {dictionary.loginPage.email}
                </p>
                <p className="text-gray-700 font-medium">{user.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Badge */}
      <div className="absolute top-10 right-8">
        <div
          className={`px-6 py-3 rounded-full shadow-lg text-white font-semibold capitalize ${
            status === "active"
              ? "bg-gradient-to-r from-green-500 to-teal-500"
              : "bg-gradient-to-r from-red-500 to-pink-500"
          }`}
        >
          {status}
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
        {!customer && (
          <EditButtonActivation
            activation={singleActivationData}
            dictionary={dictionary}
            className="bg-emerald-500 text-white hover:bg-emerald-600 p-2 px-4 rounded-full "
            title={dictionary.personalDataPage.edit}
          />
        )}
      </div>
    </div>
  );
};

export default ClientDetails;
