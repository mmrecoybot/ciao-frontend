import Image from "next/image";
import EditTariffOptionButton from "./EditTariffOptionButton";

export default function SingleTariffOption({ tariffOption, i }) {
  return (
    <tr
      key={tariffOption?.id}
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
        {tariffOption?.name}
      </td>
      <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
        {tariffOption?.description}
      </td>
      <td className="px-6 py-3 whitespace-nowrap text-right text-sm">
        <EditTariffOptionButton tariffOption={tariffOption} />
      </td>
    </tr>
  );
}
