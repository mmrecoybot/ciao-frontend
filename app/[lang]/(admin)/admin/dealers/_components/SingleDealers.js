import { FullscreenIcon } from "lucide-react";
import Link from "next/link";
import DeleteBtn from "./DeleteBtn";

function SingleDealers({ dealer, dictionary, lang }) {
  return (
    <tr
      key={dealer?.id}
      className="dark:hover:bg-gray-900 hover:bg-gray-200 duration-100 capitalize"
    >
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {dealer?.dealerCode}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {dealer?.companyName}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {dealer?.adminEmail}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {dealer?.adminPhone}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm flex gap-2 justify-end">
        <Link
          href={`/${lang}/admin/dealers/${dealer?.id}`}
          className="inline-flex gap-2 items-center dark:text-slate-500"
        >
          <FullscreenIcon className="w-5 h-5 text-blue-600  cursor-pointer" />
          {dictionary.dealersPage.details}
        </Link>
       
          <DeleteBtn dealerId={dealer?.id} dictionary={dictionary} lang={lang} label={dictionary.bannerPages.delete}/>
        
      </td>
    </tr>
  );
}

export default SingleDealers;


