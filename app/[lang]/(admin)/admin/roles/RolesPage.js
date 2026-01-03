"use client";

import { useFetchRolesQuery } from "@/store/slices/roleApi";
import { useState } from "react";
import { AiFillAmazonSquare, AiFillCrown, AiFillProfile, AiOutlinePlus, AiOutlineSearch } from "react-icons/ai";
import Error from "../components/Error";
import Loading from "../components/Loading";
import NoDataFound from "../components/NoDataFound";
import RelativeModal from "../components/RelativeModal";
import RoleForm from "./_componenets/RoleForm";
import SingleRole from "./_componenets/SingleRole";
import { RollerCoaster } from "lucide-react";


const RolesPage = ({ dictionary }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const { data: roles, error, isError, isLoading, isSuccess } = useFetchRolesQuery();
    // console.log(roles);

    const toggleModal = () => {
        setIsOpen(!isOpen);
    };

    const filteredRoles = roles?.filter((role) =>
        role?.name.toLowerCase().includes(searchQuery.toLowerCase())
    );


    if (isLoading) {
        return (
            <div className="m-auto w-full h-[50vh]">
                <Loading />
            </div>
        );
    }

    if (error) {
        console.log(error);
        return <Error error={error?.error} />;
    }

    return (
        <div className="p-6 space-y-6 w-full">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-emerald-200 p-2 px-5 rounded-xl text-white">
                <h1 className="text-2xl font-bold text-gray-700 flex items-center gap-2"><AiFillCrown size={50} /> {dictionary.rolesPages.roles}</h1>
                <button
                    onClick={toggleModal}
                    className="inline-flex items-center px-4 py-2 bg-emerald-600 dark:bg-emerald-800 text-white dark:text-gray-400 font-medium rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors"
                >
                    <AiOutlinePlus className="w-4 h-4 mr-2" />
                    {dictionary.rolesPages.add_role}
                </button>

                {isOpen && (
                    <RelativeModal setShowForm={toggleModal} title={dictionary.rolesPages.add_role}>
                        <RoleForm setShowForm={toggleModal} dictionary={dictionary} />
                    </RelativeModal>
                )}
            </div>

            {/* Search */}
            <div className=" rounded-lg shadow">
                <div className="p-6">
                    <div className="relative">
                        <AiOutlineSearch className="absolute top-3 left-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder={dictionary.rolesPages.search_roles}
                            className="pl-10 w-full rounded-lg border dark:bg-inherit dark:text-gray-500 border-gray-300 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {filteredRoles?.length === 0 ? (
                <NoDataFound title={dictionary.rolesPages.role} />
            ) : (
                <div className=" rounded-lg shadow pb-10">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-600">{dictionary.rolesPages.roles_list}</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full ">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-gray-800">
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        #
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {dictionary.personalDataPage.name}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {dictionary.tariffPages.description}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {dictionary.rolesPages.assigned_permission}
                                    </th>
                                    {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {dictionary.activation.actions}
                                    </th> */}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredRoles?.map((role, i) => (
                                    <SingleRole key={role?.id} role={role} i={i + 1} dictionary={dictionary} />
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RolesPage;
