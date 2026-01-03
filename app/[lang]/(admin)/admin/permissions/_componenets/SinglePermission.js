import EditButton from "./EditButton";

const SinglePermission = ({ permission, i, dictionary }) => {
  return (
    <tr
      key={permission?.id}
      className="dark:hover:bg-gray-900 hover:bg-gray-200 duration-100 capitalize"
    >
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {i + 1}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {permission?.name}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {permission?.description}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-left text-sm ">
        <EditButton permission={permission} dictionary={dictionary} />
      </td>
    </tr>
  );
};

export default SinglePermission;
