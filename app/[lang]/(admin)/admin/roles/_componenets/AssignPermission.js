"use client";
import { useState } from "react";

import RelativeModal from "../../components/RelativeModal";
import AssignPermissionForm from "./AssignPermissionForm";

const AssignPermission = ({ permissions, isLoading, i, dictionary }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleModal = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="">
            <button
                onClick={toggleModal}
                // onClick={handelClick}
                disabled={isLoading}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded text-white dark:text-gray-300 dark:bg-gray-800 bg-emerald-600  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
                {isLoading ? `${dictionary.userPages.loading}...` : `${dictionary.userPages.assign_permission}`}
            </button>
            {isOpen && (
                <RelativeModal setShowForm={toggleModal} title={dictionary.userPages.assign_permission}>
                    <AssignPermissionForm setShowForm={toggleModal} permissions={permissions} i={i} dictionary={dictionary} />
                </RelativeModal>
            )}
        </div>
    );
};

export default AssignPermission;