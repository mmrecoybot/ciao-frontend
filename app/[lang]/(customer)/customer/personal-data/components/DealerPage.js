"use client";

import { useFetchSingleDealerQuery } from "@/store/slices/dealerApi";
import { useSession } from "next-auth/react";
import DocumentsSection from "./DocumentSection";
import InfoSection from "./InfoSection";
import SalesPointsSection from "./SalesPointSection";

function PersonalData({ dictionary }) {
  const { data: session } = useSession();
  const { data: dealer, isLoading } = useFetchSingleDealerQuery(
    session?.user?.dealerId
  );

  if (isLoading) return <LoadingSkeleton />;

  return (
    <main className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          <span className="text-emerald-400 dark:text-emerald-400">
            {dealer?.companyName}
          </span>{" "}
          {dictionary.dealerPages.profile}
        </h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <InfoSection title={dictionary.dealerPages.dealer_information} data={dealer} dictionary={dictionary}/>
        <InfoSection title={dictionary.dealerPages.address} data={dealer?.billingAddress} dictionary={dictionary}/>
        <div className="grid grid-cols-1 md:grid-cols-3 col-span-3 gap-8">
          <SalesPointsSection data={dealer?.salePoints} dealerId={dealer?.id} dictionary={dictionary}/>
          <DocumentsSection
            data={dealer?.Documents}
            title={dictionary.dealerPages.documents}
            dealerId={dealer?.id}
            dictionary={dictionary}
          />
          <DocumentsSection
            data={dealer?.signedContracts}
            title={dictionary.dealerPages.contracts}
            dealerId={dealer?.id}
            dictionary={dictionary}
          />
        </div>
      </div>
    </main>
  );
}

function LoadingSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="h-10 w-2/3 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-4">
            <div className="h-8 w-1/2 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
            {[...Array(5)].map((_, j) => (
              <div
                key={j}
                className="h-6 w-full bg-gray-200 dark:bg-gray-700 animate-pulse rounded"
              ></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default PersonalData;
