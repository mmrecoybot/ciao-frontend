"use client";
import { useFetchCompaniesQuery } from "@/store/slices/companyApi";
import { useAddActivationMutation } from "@/store/slices/activationApi";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import {
  ArrowRightLeft,
  BriefcaseBusiness,
  Check,
  CreditCard,
  DollarSign,
  Loader,
  PhoneCall,
  ShieldAlert,
  UserRound,
  X,
  Save,
  Trash,
  Calendar,
} from "lucide-react";
import { BiSolidBank } from "react-icons/bi";
import { FaMobile } from "react-icons/fa";
import { useGetAllNonActiveSimByDealerQuery } from "@/store/slices/dealerApi";
import Image from "next/image";
import Loading from "../../components/Loading";
import SimpleImageUpload from "@/app/[lang]/(admin)/admin/products/new/components/SimpleImageUpload";

const sectionData = [
  {
    category: "client",
    options: [
      {
        value: "consumer",
        label: "consumer",
        icon: <UserRound className="w-6 h-6" />,
        id: 2,
      },
      {
        value: "business",
        label: "business",
        icon: <BriefcaseBusiness className="w-6 h-6" />,
        id: 3,
      },
    ],
  },
  // {
  //   category: "portability",
  //   options: [
  //     { value: "yes", label: "Yes", icon: <Check className="w-6 h-6" />, id: 4 },
  //     { value: "no", label: "No", icon: <X className="w-6 h-6" />, id: 5 },
  //   ],
  // },
  {
    category: "offer_category",
    options: [
      {
        value: "voice_data",
        label: "voice_data",
        icon: <FaMobile className="w-6 h-6" />,
        id: 6,
      },
      {
        value: "fixed",
        label: "fixed",
        icon: <PhoneCall className="w-6 h-6" />,
        id: 8,
      },
    ],
  },
  {
    category: "payment_method",
    options: [
      {
        value: "cash",
        label: "cash",
        icon: <DollarSign className="w-6 h-6" />,
        id: 11,
      },
      {
        value: "credit_card",
        label: "credit_card",
        icon: <CreditCard className="w-6 h-6" />,
        id: 10,
      },
      {
        value: "bank_transfer",
        label: "bank_transfer",
        icon: <BiSolidBank className="w-6 h-6" />,
        id: 12,
      },
    ],
  },
];

export default function ActivationForm({ dictionary, params }) {
  const [selectedOptions, setSelectedOptions] = useState({
    client: "consumer",
    payment_method: "cash",
    offer_category: "voice_data",
    tariff_category: "standard",
    portability: "yes",
    paymentDocument: null,
    paymentDate: null,
  });
  const [addActivation, { isLoading, isSuccess, data, isError, error }] =
    useAddActivationMutation();
  const router = useRouter();
  const { data: session } = useSession();
  const { data: companies = [], isLoading: companiesLoading } =
    useFetchCompaniesQuery();
  const { data: simOptions = [], isLoading: simOptionsLoading } =
    useGetAllNonActiveSimByDealerQuery(session?.user?.dealerId);

  const handleOptionChange = (section, value) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [section]: value,
    }));
  };

  const selectedOperatore = companies?.find(
    (option) => option.id === selectedOptions.Operator
  );

  const tariffOptions =
    selectedOperatore?.Tarrif?.filter(
      (option) =>
        option.categoryOffer === selectedOptions.offer_category &&
        option.client === selectedOptions.client
    ) || [];
  const selectedTarrif = tariffOptions?.find(
    (option) => option.id == selectedOptions.Tariff
  );

  const selectedCompanySim = simOptions?.filter(
    (option) => option.companyId === selectedOptions.Operator
  );

  const handlePaymentDocument = (document) => {
    setSelectedOptions((prev) => ({
      ...prev,
      paymentDocument: document,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !selectedOptions.Operator ||
      !selectedOptions.Tariff ||
      !selectedOptions.serialeSim ||
      !selectedOptions.offer_category ||
      !selectedOptions.tariff_category ||
      !selectedOptions.payment_method
    ) {
      toast.error("Please select all the fields");
      return;
    }

    if (!selectedOptions.paymentDocument) {
      toast.error("Please upload your payment proof!");
      return;
    }
    if (!selectedOptions.paymentDate) {
      toast.error("Please select your payment date!");
      return;
    }
    const data = {
      userId: parseInt(session.user.sub), //session.user.sub,
      companyId: selectedOptions.Operator,
      client: selectedOptions.client,
      portability: selectedOptions.portability === "yes",
      categoryOffer: selectedOptions.offer_category,
      categoryTarrif: selectedOptions.tariff_category,
      moodOfPayment: selectedOptions.payment_method,
      tarrifId: parseInt(selectedOptions.Tariff),
      offer: "solo-sim",
      serialNumberId: parseInt(selectedOptions.serialeSim),
      paymentDocument: selectedOptions.paymentDocument,
      paymentDate: selectedOptions.paymentDate,
    };
    addActivation(data);
  };

  const handleClear = () => {
    setSelectedOptions({
      tariff_category: "standard",
    });
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Activation added successfully");
      router.push(`/customer/activation`);
    }
    if (isError) {
      console.log(error);
      toast.error(error?.data?.error);
    }
  }, [isSuccess, data, isError, error]);

  return (
    <div className="min-h-screen w-full bg-emerald-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {dictionary.activation.new_activation}
        </h1>

        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Operator Selection */}
              <div>
                <h2 className="text-xl font-semibold text-gray-700 mb-4">
                  {dictionary.activation.select_operator}
                </h2>
                <div className="grid grid-cols-5 gap-4">
                  {companiesLoading ? (
                    <Loading className="w-10 h-10" />
                  ) : (
                    companies?.map((company) => (
                      <button
                        key={company.id}
                        type="button"
                        onClick={() =>
                          handleOptionChange("Operator", company.id)
                        }
                        className={`p-1 text-xs rounded-lg border-2 font-bold capitalize grid grid-cols-1 place-items-center text-black transition-colors  ${
                          selectedOptions.Operator === company.id
                            ? "border-blue-500 bg-blue-50 text-blue-600 "
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <Image
                          src={company.logo}
                          width={150}
                          height={150}
                          alt="Logo"
                          className="h-10 w-12  bg-gray-200"
                        />
                        <span className="">{company.name}</span>
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* Other Sections */}
              {sectionData.map((section) => (
                <div key={section.category}>
                  <h2 className="text-xl font-semibold text-gray-700 mb-4 capitalize">
                    {/* {section.category.replace("_", " ")} */}
                    {dictionary.activation[section.category]}
                  </h2>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                    {section.options.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() =>
                          handleOptionChange(section.category, option.value)
                        }
                        className={`p-4 rounded-lg border-2 flex flex-col items-center justify-center transition-colors ${
                          selectedOptions[section.category] === option.value
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        {option.icon}
                        <span className="mt-2 text-sm">
                          {dictionary.activation[option.label]}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {/* Tariff and SIM Selection */}
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="tariff"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {dictionary.activation.tariff}
                  </label>
                  <select
                    id="tariff"
                    required
                    className="border mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    value={selectedOptions.Tariff || ""}
                    onChange={(e) =>
                      handleOptionChange("Tariff", e.target.value)
                    }
                  >
                    <option value="">
                      {dictionary.activation.select_tariff}
                    </option>
                    {tariffOptions.map((tariff) => (
                      <option key={tariff?.id} value={tariff?.id}>
                        {tariff?.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="sim"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {dictionary.activation.sim_serial_number}
                  </label>
                  <select
                    id="sim"
                    required
                    className="border mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    value={selectedOptions.serialeSim || ""}
                    onChange={(e) =>
                      handleOptionChange("serialeSim", e.target.value)
                    }
                  >
                    <option value="">
                      {dictionary.activation.select_sim_number}
                    </option>
                    {selectedCompanySim.map((sim) => (
                      <option key={sim.id} value={sim.id}>
                        {sim?.number}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex col-span-2  gap-8 justify-start">
                  <div>
                    <label
                      htmlFor="paymentDocument"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      {dictionary.activation.payment_document}
                    </label>
                    <SimpleImageUpload
                      dictionary={dictionary}
                      image={selectedOptions.paymentDocument}
                      onImageChange={handlePaymentDocument}
                      folder={"activation/payment_document"}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="paymentDate"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      {dictionary.activation.payment_date}
                    </label>
                    <input
                      type="date"
                      id="paymentDate"
                      required
                      className="block w-full pl-3 pr-10 py-3 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      value={selectedOptions.paymentDate}
                      onChange={(e) =>
                        handleOptionChange("paymentDate", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>
              {selectedTarrif && (
                <div className="border p-4 max-w-lg">
                  <h2 className="text-xl font-semibold text-gray-700 mb-4 capitalize">
                    {selectedTarrif.description}
                  </h2>
                  <p className="text-gray-600">
                    Only{" "}
                    <span className="font-bold text-xl">
                      {selectedTarrif.price.replace(".", ",")}
                    </span>
                    €
                  </p>
                </div>
              )}
              {/* Action Buttons */}
              <div className="flex justify-start space-x-4">
                <button
                  type="button"
                  onClick={handleClear}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Trash className="mr-2 h-5 w-5" />
                  {dictionary.activation.clear_selections}
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {isLoading ? (
                    <>
                      <Loader className="animate-spin mr-2 h-5 w-5" />
                      {dictionary.activation.saving}...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-5 w-5" />
                      {dictionary.activation.save_and_continue}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Summary Section */}
          {/* {Object.keys(selectedOptions).length > 1 && (
            <div className="bg-gray-50 px-6 py-4 sm:px-8 sm:py-6 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">{dictionary.activation.selection_summary}</h3>
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                {Object.entries(selectedOptions).map(([key, value]) => (
                  selectedOptionsView({key,value,companies,simOptions,tariffOptions,dictionary})
                ))}
              </dl>
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
}

const selectedOptionsView = ({
  key,
  value,
  companies,
  simOptions,
  tariffOptions,
  dictionary,
}) => {
  if (key == "paymentDocument") return null;
  if (key === "Operator") {
    value = companies.find((c) => c.id === value)?.name;
  } else if (key === "serialeSim") {
    value = simOptions.find((c) => c.id == value)?.number;
  } else if (key === "Tariff") {
    value = tariffOptions.find((c) => c.id == value);
    value = value?.name + " (" + value?.price + "€ )";
  }

  return (
    <div>
      <dt className="text-sm font-medium text-gray-500 capitalize">
        {dictionary.activation[key]}
      </dt>
      <dd className="mt-1 text-sm text-gray-900">{value || "N/A"}</dd>
    </div>
  );
};
