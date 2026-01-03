import { useFetchDealersQuery } from "@/store/slices/dealerApi";
import { useFetchRolesQuery } from "@/store/slices/roleApi";
import { useSingleUserUpgradeByIdMutation } from "@/store/slices/userApi";
import { User } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loading from "../../components/Loading";
import EditButton from "./EditButton";
import DeleteButton from "./DeleteButton";

const SingleUser = ({ user, indx, dictionary, lang }) => {
  const [isEdit, setIsEdit] = useState(false);
  const [isAssignDealer, setIsAssignDealer] = useState(false);

  const [
    updateUserRole,
    {
      isLoading: updateLoading,
      isSuccess: updateSuccess,
      isError: updateError,
    },
  ] = useSingleUserUpgradeByIdMutation();

  const {
    data: roles,
    isLoading: rolesLoading,
    isError: rolesError,
  } = useFetchRolesQuery();
  const {
    data: dealers,
    isLoading: dealersLoading,
    isError: dealersError,
  } = useFetchDealersQuery();

  useEffect(() => {
    if (updateSuccess) {
      toast.success("User role updated successfully!");
    }

    if (updateError) {
      toast.error(
        `Failed to change role: ${
          updateError.message || "Unknown error occurred"
        }`
      );
    }
  }, [updateSuccess, updateError]);

  const handleAssignDealer = useCallback(() => setIsAssignDealer(true), []);
  const handleCancelAssignDealer = useCallback(
    () => setIsAssignDealer(false),
    []
  );

  const handleUserRoleSelect = useCallback(
    async (event) => {
      try {
        await updateUserRole({
          roleId: parseInt(event.target.value),
          name: user?.name,
          id: user?.id,
        }).unwrap();
        setIsEdit(false);
      } catch (error) {
        toast.error(`Failed to update role: ${error.message}`);
      }
    },
    [updateUserRole, user]
  );

  const handleUserDealerAssign = useCallback(
    async (id) => {
      try {
        await updateUserRole({
          dealerId: parseInt(id) || user?.dealer?.id,
          name: user?.name,
          id: user?.id,
        }).unwrap();
        setIsAssignDealer(false);
      } catch (error) {
        toast.error(`Failed to assign dealer: ${error.message}`);
      }
    },
    [updateUserRole, user]
  );

  const handleChangeRole = useCallback(() => setIsEdit(true), []);
  const handleCancel = useCallback(() => setIsEdit(false), []);

  if (rolesLoading || dealersLoading) return <Loading className="w-6 h-6" />;
  if (rolesError || dealersError) return <div>Error loading data</div>;

  return (
    <tr
      key={user?.id}
      className="dark:hover:bg-gray-900 hover:bg-gray-200 duration-100 capitalize"
    >
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {user?.id}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <User />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {user?.name}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 lowercase">
        {user?.email}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {isEdit ? (
          <select
            className="w-full rounded-md border border-gray-300 py-2 px-4 outline-none transition-all duration-300 focus:border-blue-500"
            onChange={handleUserRoleSelect}
            defaultValue={user?.roleId}
          >
            <option value="">{dictionary.userPages.select_role}</option>
            {roles?.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
        ) : (
          user?.role?.name
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {isAssignDealer ? (
          <select
            className="w-full rounded-md border border-gray-300 py-2 px-4 outline-none transition-all duration-300 focus:border-blue-500"
            onChange={(e) => handleUserDealerAssign(e.target.value)}
            defaultValue={user?.dealer?.id}
          >
            <option value="">{dictionary.userPages.select_dealer}</option>
            {dealers?.map((dealer) => (
              <option key={dealer.id} value={dealer.id}>
                {dealer.companyName}
              </option>
            ))}
          </select>
        ) : (
          user?.dealer?.companyName
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm space-x-2 flex gap-2 justify-end">
        {isEdit ? (
          <button
            onClick={handleCancel}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium text-white bg-orange-600 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {dictionary.activation.cancel}
          </button>
        ) : (
          <button
            onClick={handleChangeRole}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {dictionary.userPages.assign_role}
          </button>
        )}
        {!isAssignDealer ? (
          <button
            onClick={handleAssignDealer}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {dictionary.userPages.assign_dealer}
          </button>
        ) : (
          <button
            onClick={handleCancelAssignDealer}
            className="inline-flex items-center px-3 py-1.5 border bg-orange-600 border-gray-300 text-sm font-medium rounded text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {dictionary.activation.cancel}
          </button>
        )}
        {/* edit button */}
        <EditButton user={user} dictionary={dictionary} lang={lang} />
        <DeleteButton
          user={user}
          dictionary={dictionary}
          userId={user?.id}
          lang={lang}
          label={dictionary.bannerPages.delete}
        />
      </td>
    </tr>
  );
};

export default SingleUser;
