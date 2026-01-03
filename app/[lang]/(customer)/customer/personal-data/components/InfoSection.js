import UniversalAddButton from "@/app/[lang]/(admin)/admin/dealers/_components/AddButton";
import GeneralInfoForm from "@/app/[lang]/(admin)/admin/dealers/_components/forms/GeneralInfoForm";
import { camelCaseToWords } from "@/utils/camelCaseToWords";

function InfoSection({ title, data, dictionary }) {
    if (!data) return null;
  
    return (
      <section className="bg-gradient-to-r from-teal-50 via-blue-100 to-emerald-200 dark:from-gray-900 dark:via-slate-800 dark:to-gray-950 rounded-lg shadow-md p-6">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <span className="text-xl capitalize">{title}</span>
          {title == dictionary.dealerPages.dealer_information && (
            <UniversalAddButton buttonText={`+ Update ${title}`}>
             <GeneralInfoForm dealer={data} dealerId={data.id} dictionary={dictionary}/>
            </UniversalAddButton>
          )}
        </h2>
        <div className="space-y-3">
          {Object.entries(data).map(([key, value]) => {
            if (
              typeof value === "object" ||
              key === "id" ||
              key === "createdAt" ||
              key === "updatedAt" ||
              key === "dealerId" ||
              key === "companyName"
            ) {
              return null;
            }
            return (
              <div key={key} className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400 capitalize">
                  {dictionary.dealerPages[key]}
                </span>
                <span className="text-sm text-gray-900 dark:text-gray-100">
                  {value}
                </span>
              </div>
            );
          })}
        </div>
      </section>
    );
  }
  
  export default InfoSection;  