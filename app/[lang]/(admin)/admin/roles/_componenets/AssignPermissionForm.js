// 'use client'

// import { useEffect, useState } from "react";
// import { useFetchPermissionsQuery } from "@/store/slices/permissionApi";
// import { useAssignPermissionToRoleMutation } from "@/store/slices/roleApi";
// import { toast } from "react-toastify";

// const AssignPermissionForm = ({ permissions, i, setShowForm }) => {
//     const [selectedItems, setSelectedItems] = useState(permissions || []);

//     const { data = [], error, isError, isLoading } = useFetchPermissionsQuery();

//     const [
//         updateRole,
//         {
//             isLoading: updateLoading,
//             isSuccess: updateSuccess,
//             isError: updateError,
//         },
//     ] = useAssignPermissionToRoleMutation();

//     useEffect(() => {
//         if (updateSuccess) {
//           toast.success("Permissions added successfully!");
//           setShowForm();
//         }

//         if (updateError) {
//           toast.error(
//             `Failed to update Permissions: ${updateError.message || "Unknown error occurred"
//             }`
//           );
//         }
//       }, [ updateSuccess, updateError]);


//     // Sync state with permissions prop
//     useEffect(() => {
//         setSelectedItems(permissions);
//     }, [permissions]);

//     const handleCheckboxChange = (item) => {
//         if (selectedItems.some((i) => i.id === item.id)) {
//             setSelectedItems(selectedItems.filter((i) => i.id !== item.id));
//         } else {
//             setSelectedItems([...selectedItems, item]);
//         }
//     };

//     const handleRemoveItem = (item) => {
//         setSelectedItems(selectedItems.filter((i) => i.id !== item.id));
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         const ids = selectedItems.map(selectedItem => selectedItem.id);

//         // console.log(ids);
//         updateRole({"roleId": i, "permissionIds": ids});
//     };

//     return (
//         <div className="p-6 max-w-md mx-auto">
//             {/* Selected Items Display */}
//             <div className="mb-4 border rounded-lg p-4 bg-gray-100">
//                 <h2 className="text-lg font-semibold mb-4 text-center">Selected Permissions:</h2>
//                 <div className="flex flex-wrap gap-2">
//                     {selectedItems.length > 0 ? (
//                         selectedItems.map((item) => (
//                             <div
//                                 key={item.id}
//                                 className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full"
//                             >
//                                 <span>{item.name}</span>
//                                 <button
//                                     className="text-red-500 hover:text-red-700"
//                                     onClick={() => handleRemoveItem(item)}
//                                 >
//                                     ✕
//                                 </button>
//                             </div>
//                         ))
//                     ) : (
//                         <p className="text-gray-500">No Permission selected.</p>
//                     )}
//                 </div>
//             </div>

//             {/* Checkbox Options */}
//             <form onSubmit={handleSubmit} className="border rounded-lg p-4">
//                 <h2 className="text-lg font-semibold mb-4 text-center">Select Permissions:</h2>
//                 <div className="space-y-2">
//                     {isLoading ? (
//                         <p className="text-center">Loading...</p>
//                     ) : (
//                         data.map((item) => (
//                             <label key={item.id} className="flex items-center gap-2">
//                                 <input
//                                     type="checkbox"
//                                     className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//                                     checked={selectedItems.some((i) => i.id === item.id)}
//                                     onChange={() => handleCheckboxChange(item)}
//                                 />
//                                 <span>{item.name}</span>
//                             </label>
//                         ))
//                     )}
//                 </div>
//                 <button
//                     type="submit"
//                     className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//                 >
//                     {updateLoading ? "Submitting..." : "Submit"} 
//                     {/* Submit */}
//                 </button>
//             </form>
//         </div>
//     );
// };

// export default AssignPermissionForm;
'use client'

import { useFetchPermissionsQuery } from "@/store/slices/permissionApi";
import { useAssignPermissionToRoleMutation } from "@/store/slices/roleApi";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Processing from "@/app/[lang]/components/Processing";
import { Plus } from "lucide-react";
import { X } from "lucide-react";

const AssignPermissionForm = ({ permissions, i, setShowForm, dictionary }) => {
    const [selectedItems, setSelectedItems] = useState(permissions || []);
    const { data = [], isLoading } = useFetchPermissionsQuery();
    const [updateRole, { isLoading: updateLoading, isSuccess: updateSuccess, isError: updateError }] = useAssignPermissionToRoleMutation();

    useEffect(() => {
        if (updateSuccess) {
            toast.success("Permissions added successfully!");
            setShowForm();
        }

        if (updateError) {
            toast.error(`Failed to update Permissions: ${updateError.message || "Unknown error occurred"}`);
        }
    }, [updateSuccess, updateError]);

    useEffect(() => {
        setSelectedItems(permissions);
    }, [permissions]);

    // Filter out selected permissions from available permissions
    const availablePermissions = data.filter(
        permission => !selectedItems.some(selected => selected.id === permission.id)
    );

    const handleAddPermission = (item) => {
        setSelectedItems(prev => [...prev, item]);
    };

    const handleRemoveItem = (item) => {
        setSelectedItems(prev => prev.filter(i => i.id !== item.id));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const ids = selectedItems.map(item => item.id);
        updateRole({ roleId: i, permissionIds: ids });

    };

    return (
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-8">
                {/* Header */}
                <h1 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                    {dictionary.userPages.permission_assignment}
                </h1>

                {/* Selected Permissions Section */}
                <div className="mb-8">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">
                        {dictionary.userPages.selected_permissions}
                    </h2>
                    <div className="min-h-24 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex flex-wrap gap-2">
                            {selectedItems.length > 0 ? (
                                selectedItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="group flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-2 rounded-lg transition-all hover:bg-blue-100"
                                    >
                                        <span className="text-sm font-medium">{item.name}</span>
                                        <button
                                            onClick={() => handleRemoveItem(item)}
                                            className="w-5 h-5 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-sm">{dictionary.userPages.no_permissions_selected}</p>
                            )}
                        </div>
                    </div>
                </div>


                {/* Available Permissions Section */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">
                            {dictionary.userPages.available_permissions}
                        </h2>

                        {isLoading ? (
                            <div className="flex justify-center py-8">
                                <div className="animate-pulse text-gray-500">{dictionary.userPages.loading_permissions}</div>
                            </div>
                        ) : availablePermissions.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {availablePermissions.map((item) => (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => handleAddPermission(item)}
                                        className="flex items-center border p-3 rounded-lg hover:bg-blue-50 transition-colors text-left group"
                                    >
                                        <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600">
                                            {item.name}
                                        </span>
                                        <span className="ml-auto opacity-0 group-hover:opacity-100 text-blue-600">
                                            <Plus className="h-4 w-4" />
                                        </span>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-gray-500 py-4">{dictionary.userPages.no_more_permissions_available}</p>
                        )}
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={updateLoading}
                            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {updateLoading ? (
                                <Processing />
                            ) : (
                                `${ dictionary.userPages.save_permissions }`
                            )}
                        </button>
                    </div>
                </form>
            </div>

        </div>
    );
};

export default AssignPermissionForm;