import PaginationWrapper from "@/app/[lang]/components/PAginationWrapper";
import EditButton from "../../sims/components/EditButton";
import DeleteButton from "../../products/components/DeleteButton";

export default function SimNumber({ dealerData, dictionary, lang, params }) {
  if (dealerData.serialNumber.length === 0) {
    return <p>{dictionary.dealersPage.no_sim_numbers_assigned}</p>;
  }

  return (
    <PaginationWrapper
      data={dealerData.serialNumber}
      itemsPerPage={10}
    >
      {(paginatedData) => (
        <table className="min-w-full dark:bg-gray-800 dark:text-gray-200">
          <thead>
            <tr>
              <th className="py-2">##</th>
              <th className="py-2">{dictionary.dealersPage.numbers}</th>
              <th className="py-2">{dictionary.companyPages.company}</th>
              <th className="py-2">{dictionary.navItems.activations}</th>
              <th className="py-2">{dictionary.activation.actions}</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((serial, index) => (
              <tr
                key={index}
                className="border-b border-gray-300 dark:border-gray-600 text-center"
              >
                <td className="py-2">{index + 1}</td>
                <td className="py-2">{serial.number}</td>
                <td className="py-2">{serial.company.name}</td>
                <td className="py-2">
                  {serial.Activation.length > 0 ? (
                    serial.Activation.map((activation, activationIndex) => (
                      <p
                        key={activationIndex}
                        className={`${
                          activation.status === "active"
                            ? "text-green-500"
                            : "text-red-100"
                        }`}
                      >
                        {activation.status}
                      </p>
                    ))
                  ) : (
                    <p className="text-red-500">inactive</p>
                  )}
                </td>
                <td className="py-2 flex gap-2 justify-center">
                 <EditButton label={dictionary.customerComponents.edit} lang={lang} simId={serial.id} simToEdit={{
                  id: serial.id,
                  number: serial.number,
                  companyId: serial.company.id,
                  dealerId: params.id
                 }} dictionary={dictionary} isDealer={true} />
                 <DeleteButton label={dictionary.customerComponents.delete} lang={lang}  productId={serial.id} dictionary={dictionary} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </PaginationWrapper>
  );
}
