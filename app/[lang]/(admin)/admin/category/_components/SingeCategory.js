import Image from "next/image";
import EditButton from "./EditButton";
import DeleteButton from "./DeleteButton";

export default function SingeCategory({ category, i, dictionary, lang }) {
  return (
    <tr
      key={category?.id}
      className="dark:hover:bg-gray-700 hover:bg-gray-200 duration-100 capitalize"
    >
      <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
        {i + 1}
      </td>
      {/* <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
        <Image
          src={category?.logo}
          width={50}
          height={50}
          alt="Logo"
          className="object-contain bg-gray-200 h-16 w-16 rounded-full"
        />
      </td>{" "} */}
      <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
        {category?.name}
      </td>
      <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
        {category?.description}
      </td>
      <td className="px-6 py-3 whitespace-nowrap text-right text-sm flex gap-2 justify-end">
        <EditButton category={category} dictionary={dictionary} lang={lang} />
        <DeleteButton
          categoryId={category.id}
          dictionary={dictionary}
          label={dictionary.bannerPages.delete}
          lang={lang}
        />
      </td>
    </tr>
  );
}
