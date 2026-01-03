import { useFetchRoleByIdQuery } from '@/store/slices/roleApi';
import AssignPermission from './AssignPermission';
import EditButton from "./EditButton";


const SingleRole = ({ role, i, dictionary }) => {

  const { data, error, isLoading } = useFetchRoleByIdQuery(i)
  const permissions = data?.permissions
  // console.log(permissions);
  // console.log(i);

  return (
    <tr
      key={role?.id}
      className="dark:hover:bg-gray-900 hover:bg-gray-200 duration-100 capitalize"
    >
      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
        {i}
      </td>
      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
        {role?.name}
      </td>
      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
        {role?.description}
      </td>
      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 gap-2 grid grid-cols-4">
        {
          isLoading ? (
            <p>{dictionary.rolesPages.loading}</p>
          ) : (
            permissions?.length > 0 && permissions.map((item) => (
              <span key={item?.id} className='bg-blue-100 text-blue-800 px-3 py-1 rounded-full mr-1'>{item?.name}</span>
            ))
          )
        }
      </td>
      <td className="px-3 py-4 whitespace-nowrap text-right text-sm flex items-center gap-3">
        <AssignPermission permissions={permissions} isLoading={isLoading} i={i} dictionary={dictionary} />
        <EditButton role={role} dictionary={dictionary} />
      </td>
    </tr>
  );
};

export default SingleRole;
