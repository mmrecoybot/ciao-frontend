"use client";
import { useFetchActivationsByCustomerQuery } from "@/store/slices/activationApi";
import { useMemo, useState } from "react";
import Loading from "../../components/Loading";
import ActivationRow from "./ActivationRow";
import FilterForm from "./FilterForm";

export default function ActivationPageSub({ dictionary, user, params: { lang } }) {
  const [filterValue, setFilterValue] = useState({
    companyName: "",
    simSerial: "",
    creationDate: "",
    activationId: "",
    activationDate: "",
    moodOfPayment: "",
  });

  const { data: activations = [], isLoading } =
    useFetchActivationsByCustomerQuery(user?.sub);

  const filteredActivations = useMemo(() => {
    return activations?.filter((activation) => {
      const activationDate = new Date(activation.updatedAt);
      const filterActivationDate = new Date(filterValue.activationDate);
      const creationDate = new Date(activation.createdAt);
      const filterCreationDate = new Date(filterValue.creationDate);
      return (
        (filterValue.companyName === "" ||
          activation?.company?.name
            .toLowerCase()
            .includes(filterValue.companyName.toLowerCase())) &&
        (filterValue.simSerial === "" ||
          activation?.serialNumber?.number
            .toLowerCase()
            .includes(filterValue.simSerial.toLowerCase())) &&
        (filterValue.creationDate === "" ||
          creationDate >= filterCreationDate) &&
        (filterValue.activationId === "" ||
          activation?.id.toString().includes(filterValue.activationId)) &&
        (filterValue.activationDate === "" ||
          activationDate <= filterActivationDate) &&
        (filterValue.moodOfPayment === "" ||
          activation?.moodOfPayment
            ?.toLowerCase()
            .includes(filterValue.moodOfPayment.toLowerCase()))
      );
    });
  }, [activations, filterValue]);

  if (isLoading) return <Loading />;

  return (
    <div className="p-6 space-y-6 w-full ">
      {/* Header */}
      <div className="flex items-center text-gray-800 gap-2 text-xl font-black uppercase bg-emerald-200 dark:bg-emerald-200/20 p-2 rounded">
        <h1>{dictionary.activation.activations}</h1>
      </div>

      {/* Search Form */}
      <FilterForm dictionary={dictionary} filterValue={filterValue} setFilterValue={setFilterValue} />

      {/* Results Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800 border-b">
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">
                {dictionary.activation.activation_id}
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">
                {dictionary.activation.creation_date}
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">
                {dictionary.activation.offer_category}
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">
                {dictionary.activation.mood_of_payment}
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">
                {dictionary.activation.sim_number}
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">
                {dictionary.activation.company}
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">
                {dictionary.customerComponents.status}
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">
                {dictionary.activation.progress}
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">
                {dictionary.activation.actions}
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredActivations?.length > 0 ? (
              filteredActivations?.map((activation) => (
                <ActivationRow dictionary={dictionary} key={activation.id} activation={activation} />
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  <span className="text-gray-500 dark:text-gray-400">
                    {dictionary.activation.no_results_found}
                  </span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
