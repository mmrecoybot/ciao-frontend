import Image from "next/image";
import EditSubCategoryButton from "./EditSubCategoryButton";
import DeleteButton from "./DeleteButton";

export default function SingeSubCategory({ subCategory, i, dictionary, lang }) {
  return (
    <tr
      key={subCategory?.id}
      className="dark:hover:bg-gray-700 hover:bg-gray-200 duration-100 capitalize"
    >
      <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
        {i + 1}
      </td>
      {/* <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
        <Image
          src={subCategory?.logo}
          width={50}
          height={50}
          alt="Logo"
          className="object-contain bg-gray-200 h-16 w-16 rounded-full"
        />
      </td>{" "} */}
      <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
        {subCategory?.name}
      </td>
      <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
        {subCategory?.description}
      </td>
      <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
        {subCategory?.category?.name}
      </td>
      <td className="px-6 py-3 whitespace-nowrap text-right text-sm flex gap-2 justify-end">
        <EditSubCategoryButton subCategory={subCategory} dictionary={dictionary} />
        <DeleteButton
          subCategoryId={subCategory.id}
          dictionary={dictionary}
          label={dictionary.bannerPages.delete}
          lang={lang}
        />
      </td>
    </tr>
  );
}
