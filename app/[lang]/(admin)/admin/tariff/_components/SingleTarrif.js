import DeleteButton from "./DeleteButton";
import EditTarrifButton from "./EditTarrifButton";

const SingleTarrif = ({ tarrif, i, dictionary, lang }) => {

  return (
    <tr
      key={tarrif?.id}
      className="dark:hover:bg-gray-700 hover:bg-gray-200 duration-100 capitalize"
    >
      <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
        {i + 1}
      </td>
      <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
        {tarrif?.name}
      </td>
      <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
        {tarrif?.description}
      </td>
      <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
        {tarrif?.price}
      </td>
      <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
        {tarrif?.company?.name}
      </td>
      <td className="px-6 py-3 whitespace-nowrap text-right text-sm flex justify-end gap-2">
        <EditTarrifButton tarrif={tarrif} dictionary={dictionary} />
        <DeleteButton tariffId={tarrif?.id} label={dictionary.bannerPages.delete} lang={lang} dictionary={dictionary} />
      </td>
    </tr>
  );
};

export default SingleTarrif;
