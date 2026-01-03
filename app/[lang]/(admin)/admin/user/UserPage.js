"use client";
import { useFetchUsersQuery } from "@/store/slices/userApi";
import { useState } from "react";
import { AiOutlinePlus, AiOutlineSearch } from "react-icons/ai";
import Loading from "../components/Loading";
import NoDataFound from "../components/NoDataFound";
import RelativeModal from "../components/RelativeModal";
import SingleUser from "./_components/SingleUser";
import UserFrom from "./_components/UserFrom";
import { User2 } from "lucide-react";
import Pagination from "../components/Pagination";

const UserPage = ({ dictionary, lang }) => {
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [userRole, setUserRole] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const { data: allUser, isLoading, isError, error } = useFetchUsersQuery();
  const uniqeRole = [...new Set(allUser?.map((user) => user?.role?.name))];

  const lowerCaseQuery = String(userSearchQuery).toLowerCase();
  const lowerCaseRole = String(userRole).toLowerCase();

  const filteredUsers = allUser?.filter((user) => {
    const matchesQuery =
      user?.name?.toLowerCase().includes(lowerCaseQuery) ||
      user?.email?.toLowerCase().includes(lowerCaseQuery);
    const matchesRole =
      lowerCaseRole === "" || user?.role?.name?.toLowerCase() === lowerCaseRole;
    return matchesQuery && matchesRole;
  });

  const totalPages = Math.ceil(filteredUsers?.length / usersPerPage);
  const paginatedUsers = filteredUsers?.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  const handleSeachChange = (event) => {
    setUserSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const handleUserRoleSelect = (event) => {
    setUserRole(event.target.value);
    setCurrentPage(1);
  };

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (isLoading) return <Loading />;
  if (isError) return <p>Error: {error?.message || "An error occurred"}</p>;

  return (
    <main className="w-full h-full overflow-scroll relative">
      <div className="p-6 space-y-6 w-full pb-16">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-emerald-200 p-4 rounded-lg shadow">
          <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <User2 size={40} />
            {dictionary.userPages.user_information}
          </h1>
          <button
            onClick={toggleModal}
            className="inline-flex items-center px-4 py-2 bg-emerald-600 dark:bg-emerald-800 text-white dark:text-gray-400 font-medium rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors"
          >
            <AiOutlinePlus className="w-4 h-4 mr-2" />
            {dictionary.userPages.create_user}
          </button>

          {isOpen && (
            <RelativeModal
              setShowForm={toggleModal}
              title={dictionary.userPages.create_user}
            >
              <UserFrom setShowForm={toggleModal} dictionary={dictionary} />
            </RelativeModal>
          )}
        </div>

        {/* Search and Select */}
        <section className="rounded-lg shadow grid grid-cols-12 gap-6 p-6">
          <div className="col-span-9">
            <div className="relative">
              <AiOutlineSearch className="absolute top-3 left-4 text-gray-400" />
              <input
                type="text"
                placeholder={dictionary.userPages.search_user_by_name_or_email}
                className="pl-10 w-full rounded-md border border-gray-300 py-2 px-4 outline-none transition-all duration-300 focus:border-blue-500"
                value={userSearchQuery}
                onChange={handleSeachChange}
              />
            </div>
          </div>
          <div className="col-span-3">
            <select
              className="w-full rounded-md border capitalize dark:bg-gray-900 dark:text-gray-300 border-gray-300 py-2 px-4 outline-none transition-all duration-300 focus:border-blue-500"
              onChange={handleUserRoleSelect}
            >
              <option value="">{dictionary.userPages.all_roles}</option>
              {uniqeRole?.map((role, index) => (
                <option key={index} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* Table with Scroll and Pagination */}
        <div className="h-[65vh] overflow-y-auto">
          {paginatedUsers?.length === 0 ? (
            <NoDataFound title={dictionary.userPages.user} />
          ) : (
            <div className="rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200 sticky top-0 bg-white dark:bg-gray-800">
                <h2 className="text-lg font-semibold text-gray-600">
                  {dictionary.userPages.user_list}
                </h2>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800 sticky top-0 z-10">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {dictionary.userPages.user_id}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {dictionary.userPages.image}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {dictionary.userPages.name}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {dictionary.userPages.email}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {dictionary.userPages.role}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {dictionary.simPage.dealer}
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {dictionary.activation.actions}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedUsers?.map((user, ind) => (
                    <SingleUser
                      key={ind}
                      user={user}
                      indx={ind}
                      dictionary={dictionary}
                      lang={lang}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {/* {filteredUsers?.length > usersPerPage && ( */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
        {/* )} */}
      </div>
    </main>
  );
};

export default UserPage;
