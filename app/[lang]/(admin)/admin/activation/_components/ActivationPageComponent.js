"use client";

import { useFetchActivationsQuery } from "@/store/slices/activationApi";
import { useMemo, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import Error from "../../components/Error";
import Loading from "../../components/Loading";
import NoDataFound from "../../components/NoDataFound";
import SingleActivation from "./SingleActivationSingle";
import { CgAttachment } from "react-icons/cg";
import { File } from "lucide-react";
// import ActivationForm from "./_components/ActivationForm";

const ActivationPageComponent = ({ dictionary }) => {
  const [searchQuery, setSearchQuery] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedOffer, setSelectedOffer] = useState("all");
  const [selectedSort, setSelectedSort] = useState("newest");
  const {
    data: activations,
    error,
    isError,
    isLoading,
    isSuccess,
  } = useFetchActivationsQuery();

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };
  const getCompany = [
    ...new Set(activations?.map((activation) => activation?.company.name)),
  ];
  const getOffer = [
    ...new Set(activations?.map((activation) => activation?.categoryOffer)),
  ];

  const filteredActivations = useMemo(() => {

    const result = activations?.filter((activation) => {
      const matchesSearchQuery = searchQuery
        ? activation?.user?.email
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        activation?.user?.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        activation?.serialNumber == searchQuery ||
        activation?.id == searchQuery
        : true;

      const matchesFilters =
        (selectedCompany === "all" ||
          activation?.company?.name === selectedCompany) &&
        (selectedStatus === "all" ||
          activation?.status?.toLowerCase() === selectedStatus.toLowerCase()) &&
        (selectedOffer === "all" ||
          activation?.categoryOffer?.toLowerCase() ===
          selectedOffer.toLowerCase());

      return matchesSearchQuery && matchesFilters;
    });
    return result;
  }, [
    activations,
    searchQuery,
    selectedCompany,
    selectedStatus,
    selectedOffer,
  ]);

  const sortedActivations = useMemo(() => {
    if (selectedSort === "newest") {
      return filteredActivations?.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    } else if (selectedSort === "oldest") {
      return filteredActivations?.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
    } else {
      return filteredActivations;
    }
  }, [filteredActivations, selectedSort]);
  if (isLoading) {
    return (
      <div className="m-auto w-full h-[50vh]">
        <Loading />
      </div>
    );
  }

  if (error) {
    // console.log(error);
    return <Error error={error?.error} />;
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 text-gray-500 min-h-screen w-full mb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-emerald-200 px-6 py-4  rounded-lg shadow">
        <h1 className="text-2xl font-bold text-gray-700 flex items-center gap-2"><File size={50} /> {dictionary.activationsPages.activations}</h1>
      </div>
      <div className="bg-white px-2 py-2 dark:bg-gray-950 rounded-lg shadow flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {/* Search */}

        <div className="relative w-full">
          <AiOutlineSearch className="absolute top-3 left-4 text-gray-400" />
          <input
            type="text"
            placeholder={dictionary.activationsPages.search_by_name_serial_number_mail}
            className="pl-10 w-full bg-inherit rounded-lg border border-gray-300 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-4">
          <div>
            <select
              className="px-4 py-2 border rounded-md bg-inherit focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">{dictionary.customerComponents.all_status}</option>
              <option value="pending">{dictionary.orderPages.pending}</option>
              <option value="active">{dictionary.customerComponents.active}</option>
              <option value="expired">{dictionary.activationsPages.expired}</option>
            </select>
          </div>
          <div>
            <select
              className="px-4 py-2 border rounded-md bg-inherit focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedOffer}
              onChange={(e) => setSelectedOffer(e.target.value)}
            >
              <option value="all">{dictionary.activationsPages.all_offers}</option>
              {getOffer?.map((offer, index) => (
                <option key={index} value={offer} className="capitalize">
                  {offer}
                </option>
              ))}
            </select>
          </div>
          <div>
            <select
              className="px-4 py-2 border rounded-md bg-inherit focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
            >
              <option value="all">{dictionary.simPage.all_companies}</option>
              {getCompany?.map((company, index) => (
                <option key={index} value={company} className="capitalize">
                  {company}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {filteredActivations?.length === 0 ? (
        <NoDataFound title={dictionary.activationsPages.activations} />
      ) : (
        <>
          {/* Categories Table */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow h-[75vh] overflow-y-scroll">
            <div className="px-6 py-4 border-b border-gray-200  bg-white dark:bg-gray-900 flex justify-between">
              <h2 className="text-lg font-semibold text-gray-500">
                {dictionary.activationsPages.activation_list}
              </h2>
              <div className="flex gap-2">
                <div>
                  <span className="text-gray-500 capitalize mr-2">{dictionary.activationsPages.sort_by}</span>

                  <select
                    className="px-4 py-2 border rounded-md bg-inherit focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedSort}
                    onChange={(e) => setSelectedSort(e.target.value)}
                  >
                    <option value="newest">{dictionary.activationsPages.newest}</option>
                    <option value="oldest">{dictionary.activationsPages.oldest}</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="">
              <table className="w-full">
                <thead className="sticky top-0 bg-white dark:bg-gray-900">
                  <tr className="bg-gray-50 dark:bg-gray-800">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {dictionary.activation.activation_id}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {dictionary.personalDataPage.name}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {dictionary.dealerPages.email}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {dictionary.tariffPages.company}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {dictionary.activationsPages.offer_selection}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {dictionary.activationsPages.tarrif_category}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {dictionary.activation.sim_serial}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {dictionary.activationsPages.payment_method}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {dictionary.activationsPages.status}
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {dictionary.activation.actions}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {sortedActivations
                    .map((activation, i) => (
                      <SingleActivation
                        key={activation?.id}
                        activation={activation}
                        dictionary={dictionary}
                        i={i}
                      />
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ActivationPageComponent;
