"use client";
import Loading from "@/app/[lang]/(customer)/customer/components/Loading";
import { useFetchSingleDealerQuery } from "@/store/slices/dealerApi";
import { useState } from "react";
import BillingAddress from "../_components/BillingAddress";
import Contracts from "../_components/Contracts";
import CreditSections from "../_components/CreditSections";
import Documents from "../_components/Documents";
import GeneralInformation from "../_components/GeneralInformation";
import SalesPoint from "../_components/SalesPoint";
import SectionCard from "../_components/SectionCard";
import SimNumber from "../_components/SimNumber";
import UsersSection from "../_components/UsersSection";
import BillingAddressForm from "../_components/forms/BillingAddressForm";
import ContractForm from "../_components/forms/ContactForm";
import DocumentForm from "../_components/forms/DocumentsForm";
import GeneralInfoForm from "../_components/forms/GeneralInfoForm";
import SalesPointForm from "../_components/forms/SalesPointForm";
import AddPhoneNumberModal from "../../sims/components/AddPhoneNumberModal";
import PhoneNumberForm from "../_components/forms/NumberForm";

const DealerDashboard = ({ dictionary, params, lang }) => {
  const {
    data: dealerData,
    error,
    isLoading,
    isSuccess,
  } = useFetchSingleDealerQuery(params?.id);

  const [expandedSections, setExpandedSections] = useState({
    general: true,
    shopAddress: true,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  if (isLoading) return <Loading />;
  if (error) return <div>{dictionary.dealersPage.error_fetching_dealer_data}</div>; 
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 font-bold mb-8 p-4 dark:text-gray-100">
        {dealerData.companyName} {dictionary.dealersPage.dashboard}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SectionCard
          buttonText={`+ ${dictionary.dealerPages.edit} ${dictionary.dealerPages.dealer_information}`}
          addButton={<GeneralInfoForm dealer={dealerData} dictionary={dictionary} dealerId={params?.id} />}
          title={dictionary.dealerPages.dealer_information}
          sectionKey="general"
          expandedSections={expandedSections}
          toggleSection={toggleSection}
        >
          <GeneralInformation dealerData={dealerData} dictionary={dictionary} />
        </SectionCard>

        <SectionCard
          buttonText={`+ ${dictionary.dealerPages.edit} ${dictionary.dealerPages.address}`}
          title={dictionary.dealerPages.address}
          sectionKey="shopAddress"
          expandedSections={expandedSections}
          toggleSection={toggleSection}
          addButton={
            <BillingAddressForm dictionary={dictionary} dealer={dealerData} dealerId={params?.id} />
          }
        >
          <BillingAddress dictionary={dictionary} dealerData={dealerData} />
        </SectionCard>
      </div>

      <SectionCard
        buttonText={`+ ${dictionary.dealerPages.add_new} ${dictionary.dealerPages.sales_points}`}
        addButton={<SalesPointForm dictionary={dictionary} dealer={dealerData} dealerId={params?.id} />}
        title={dictionary.dealerPages.sales_points}
        sectionKey="salePoints"
        expandedSections={expandedSections}
        toggleSection={toggleSection}
      >
        <SalesPoint dictionary={dictionary} dealerData={dealerData} />
      </SectionCard>

      <SectionCard
        buttonText={`+ ${dictionary.dealerPages.add_new} ${dictionary.dealerPages.contracts}`}
        addButton={<ContractForm dictionary={dictionary} dealer={dealerData} dealerId={params?.id} />}
        title={dictionary.dealerPages.contracts}
        sectionKey="contracts"
        expandedSections={expandedSections}
        toggleSection={toggleSection}
      >
        <Contracts dictionary={dictionary} dealerData={dealerData} />
      </SectionCard>

      <SectionCard
        buttonText={`+ ${dictionary.dealerPages.add_new} ${dictionary.dealerPages.documents}`}
        addButton={<DocumentForm dictionary={dictionary} dealer={dealerData} dealerId={params?.id} />}
        title={dictionary.dealerPages.documents}
        sectionKey="documents"
        expandedSections={expandedSections}
        toggleSection={toggleSection}
      >
        <Documents dictionary={dictionary} dealerData={dealerData} />
      </SectionCard>

      <SectionCard
        buttonText={`+ ${dictionary.dealerPages.add_new} ${dictionary.ordersPages.serial_number}`}
        addButton={<PhoneNumberForm dictionary={dictionary} dealer={dealerData} dealerId={params?.id} />}
        title={dictionary.ordersPages.serial_number}
        sectionKey="serialNumbers"
        expandedSections={expandedSections}
        toggleSection={toggleSection}
      >
        <SimNumber dictionary={dictionary} dealerData={dealerData} lang={lang} params={params}/>
      </SectionCard>
      <SectionCard
        title={dictionary.userPages.user}
        sectionKey="users"
        expandedSections={expandedSections}
        toggleSection={toggleSection}
      >
        <UsersSection
          dealerData={dealerData}
          expandedSections={expandedSections}
          toggleSection={toggleSection}
          dictionary={dictionary}
        />
      </SectionCard>


      {/* <SectionCard
        title="Credit Details"
        sectionKey="credit"
        expandedSections={expandedSections}
        toggleSection={toggleSection}
      >
        <CreditSections dealerData={dealerData} />
      </SectionCard> */}
    </div>
  );
};

export default DealerDashboard;
