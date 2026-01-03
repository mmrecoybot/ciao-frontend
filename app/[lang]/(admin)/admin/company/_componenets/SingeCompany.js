import DeleteButton from "./DeleteButton";
import EditButton from "./EditButton";
import Image from "next/image";

export default function SingeCompany({ company, i, dictionary, lang }) {
  const handleDeleteCompany = (id) => {
    // TODO: Replace this with your delete API/Redux logic
  };

  return (
    <tr className="dark:hover:bg-gray-900 hover:bg-gray-200 duration-100 capitalize">
      <td className="px-6 py-4 text-sm text-gray-500">{i + 1}</td>
      <td className="px-6 py-4 text-sm text-gray-500">
        <Image
          src={company.logo}
          width={50}
          height={50}
          alt="Logo"
          className="h-16 w-16 rounded bg-gray-200 p-1"
        />
      </td>
      <td className="px-6 py-4 text-sm text-gray-500">{company.name}</td>
      <td className="px-6 py-4 text-sm text-gray-500">{company.description}</td>
      <td className="px-6 py-4 text-sm text-right space-x-2 flex gap-2 justify-end">
        <EditButton company={company} dictionary={dictionary} lang={lang} />
        <DeleteButton
          companyId={company.id}
          onDelete={handleDeleteCompany}
          dictionary={dictionary}
          label={dictionary.bannerPages.delete}
          lang={lang}
        />
      </td>
    </tr>
  );
}
