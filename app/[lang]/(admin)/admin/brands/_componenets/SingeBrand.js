"use client";
import DeleteButton from "./DeleteButton";
import EditButton from "./EditButton";

export default function SingeBrand({ brand, i, dictionary, lang }) {
  return (
    <tr
      key={brand?.id}
      className="dark:hover:bg-gray-900 hover:bg-gray-200 duration-100 capitalize"
    >
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {i + 1}
      </td>
      {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <Image
          src={brand?.logo}
          width={50}
          height={50}
          alt="Logo"
          className="h-16 w-16 rounded-full bg-gray-200"
        />
      </td>{" "} */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {brand?.name}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {brand?.description}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm gap-2 flex justify-end">
        <EditButton brand={brand} dictionary={dictionary} lang={lang} />
        <DeleteButton
          id={brand?.id}
          dictionary={dictionary}
          label={dictionary.bannerPages.delete}
          lang={lang}
        />
      </td>
    </tr>
  );
}
