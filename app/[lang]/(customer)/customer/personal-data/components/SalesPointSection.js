import UniversalAddButton from "@/app/[lang]/(admin)/admin/dealers/_components/AddButton";
import SalesPointForm from "@/app/[lang]/(admin)/admin/dealers/_components/forms/SalesPointForm";


function SalesPointsSection({ data, dealerId, dictionary }) {
 
    if (!data || data.length === 0) return null;
  
    return (
      <section className="bg-gradient-to-r from-teal-50 via-blue-100 to-sky-200 dark:from-gray-900 dark:via-slate-800 dark:to-gray-950 rounded-lg shadow-md p-6 relative">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100  pb-2 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <span className="text-xl capitalize">{dictionary.dealerPages.sales_points}</span>
          <UniversalAddButton buttonText={`+ ${dictionary.dealerPages.add_new} ${dictionary.dealerPages.sales_points}`}>
            <SalesPointForm dealerId={dealerId} dictionary={dictionary} />
          </UniversalAddButton>
        </h2>
  
        <div className="space-y-4">
          {data.map((point, index) => (
            <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded p-3">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {point.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {point.address}, {point.city}, {point.province}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {point.phoneNumber}
              </p>
            </div>
          ))}
        </div>
      </section>
    );
  }
  
  export default SalesPointsSection;