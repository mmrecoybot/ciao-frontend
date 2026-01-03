import ContractForm from "@/app/[lang]/(admin)/admin/dealers/_components/forms/ContactForm";
import DownloadPdf from "../../components/DownloadPdf";
import DocumentForm from "@/app/[lang]/(admin)/admin/dealers/_components/forms/DocumentsForm";
import UniversalAddButton from "@/app/[lang]/(admin)/admin/dealers/_components/AddButton";

function DocumentsSection({ data, title, dealerId,dictionary }) {
    if (!data || data.length === 0) return null;
  
    return (
      <section className="bg-gradient-to-r from-teal-50 via-blue-100 to-sky-200 dark:from-gray-900 dark:via-slate-800 dark:to-gray-950 rounded-lg shadow-md p-6">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <span className="text-xl capitalize">{title}</span>
          <UniversalAddButton buttonText={`+ ${dictionary.dealerPages.add_new} ${title}`}>
            {title === "Documents" ? (
              <DocumentForm dealerId={dealerId} dictionary={dictionary}/>
            ) : (
              <ContractForm dealerId={dealerId} dictionary={dictionary}/>
            )}
          </UniversalAddButton>
        </h2>
        <div className="space-y-3">
          {data.map((doc, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {doc.name}
              </span>
              <DownloadPdf
                link={doc.fileUrl}
                title={dictionary.dealerPages.view}
                fileName={doc.name}
                className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              />
            </div>
          ))}
        </div>
      </section>
    );
  }
export default DocumentsSection;