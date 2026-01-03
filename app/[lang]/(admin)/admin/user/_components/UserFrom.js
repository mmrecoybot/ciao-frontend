// // export default UserFrom;
// import { useState, useEffect } from "react";
// import { useFetchRolesQuery } from "@/store/slices/roleApi";
// // We only need useAddUserMutation here.
// // If you update name/email/role, you'll need a separate updateUserMutation
// // without the password field in its endpoint payload structure.
// // For this example, let's assume updateUser handles everything *except* password.
// import {
//   useAddUserMutation,
//   useSingleUserUpgradeByIdMutation,
// } from "@/store/slices/userApi";
// import { toast } from "react-toastify";

// import { Eye, EyeOff } from "lucide-react"; // Import eye icons
// import Loading from "../../loadding";

// // The form will now handle Adding (with password) and Editing Details (without password)
// function AddEditUserForm({ setShowForm, dictionary, userToEdit }) {
//   // Determine if we are in editing mode
//   const isEditing = !!userToEdit;

//   // Initialize state based on userToEdit
//   const [name, setName] = useState(userToEdit?.name || "");
//   const [email, setEmail] = useState(userToEdit?.email || "");
//   // Password and confirmPassword states are ONLY relevant for Adding,
//   // but we still need them in state to manage the inputs when adding.
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   // State for showing/hiding password (relevant only when password fields are shown)
//   const [showPassword, setShowPassword] = useState(false);
//   // Convert roleId to string for the select input's value attribute
//   const [roleId, setRoleId] = useState(userToEdit?.roleId?.toString() || "");

//   // Fetch roles for the select dropdown
//   const {
//     data: roles,
//     isLoading: isLoadingRoles,
//     isError: isRolesError,
//     error: rolesError,
//   } = useFetchRolesQuery();

//   // Add mutation hook (used ONLY when adding)
//   const [
//     addUser,
//     {
//       isLoading: isAdding,
//       isError: isAddError,
//       isSuccess: isAddSuccess,
//       error: addError,
//     },
//   ] = useAddUserMutation();

//   // Update mutation hook (used ONLY when editing details)
//   // Ensure your updateUserMutation endpoint accepts payload WITHOUT a password field
//   const [
//     updateUser,
//     {
//       isLoading: isUpdating,
//       isError: isUpdateError,
//       isSuccess: isUpdateSuccess,
//       error: updateError,
//     },
//   ] = useSingleUserUpgradeByIdMutation();

//   // Combine loading and error states for simpler checks
//   const isSaving = isAdding || isUpdating;
//   const isSaveError = isAddError || isUpdateError;
//   const isSaveSuccess = isAddSuccess || isUpdateSuccess;
//   // Use error from whichever mutation failed
//   const saveError = isAddError ? addError : updateError;

//   // Effect for showing errors
//   useEffect(() => {
//     if (isSaveError) {
//       toast.error(
//         saveError?.data?.message ||
//           dictionary.general.an_error_occurred ||
//           "An error occurred."
//       );
//     }
//   }, [isSaveError, saveError, dictionary]);

//   // Effect for handling success
//   useEffect(() => {
//     if (isSaveSuccess) {
//       const successMessage = isEditing
//         ? dictionary.userPages.update_success ||
//           "User details updated successfully!" // Adjusted message for details
//         : dictionary.userPages.add_success || "User added successfully!";

//       toast.success(successMessage);
//       setShowForm(false); // Close the form on success
//     }
//   }, [isSaveSuccess, setShowForm, isEditing, dictionary]);

//   // Frontend password match validation (only relevant when adding)
//   const validatePasswordMatch = () => {
//     // This validation ONLY applies when adding a user
//     if (!isEditing) {
//       if (password !== confirmPassword) {
//         toast.error(
//           dictionary.userPages.password_mismatch || "Passwords do not match."
//         );
//         return false;
//       }
//       // Also check if password is provided when adding
//       if (!password) {
//         toast.error(
//           dictionary.userPages.password_required ||
//             "Password is required for new users."
//         );
//         return false;
//       }
//     }
//     // If editing, or if passwords match when adding, return true
//     return true;
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     // Validate passwords ONLY if adding
//     if (!isEditing && !validatePasswordMatch()) {
//       return; // Stop submission if adding and passwords don't match/are missing
//     }

//     const payload = {
//       name,
//       email,
//       roleId: parseInt(roleId), // Parse back to number for the API
//     };

//     if (isEditing) {
//       // If editing, call updateUserMutation with just details
//       // Ensure an ID is present
//       if (!userToEdit?.id) {
//         toast.error(
//           dictionary.general.missing_user_id ||
//             "Error: User ID missing for update."
//         );
//         return;
//       }
//       // IMPORTANT: The updateUser endpoint should NOT require or expect the password field here.
//       updateUser({ id: userToEdit.id, ...payload });
//     } else {
//       // If adding, call addUserMutation with all fields including password
//       payload.password = password; // Include password in payload only when adding
//       addUser(payload);
//     }
//   };

//   // Toggle show password state (only relevant when password fields are shown)
//   const toggleShowPassword = () => {
//     setShowPassword(!showPassword);
//   };

//   // styles
//   const inputFieldStyles =
//     "w-full rounded-md border border-gray-300 py-2 px-4 outline-none transition-all duration-300 focus:border-blue-500 mt-2 lowercase dark:bg-slate-600 dark:text-gray-200";
//   const labelStyles =
//     "block text-sm font-semibold text-gray-700 mt-4 capitalize dark:text-gray-400";
//   // Styles for password fields (only used when !isEditing)
//   const passwordInputContainerStyles = "relative mt-2";
//   const passwordToggleStyles =
//     "absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200";
//   const passwordInputWithPaddingStyles = `${inputFieldStyles} pr-10`;

//   // Determine modal title and button text
//   const modalTitle = isEditing
//     ? dictionary.userPages.edit_user_details || "Edit User Details" // Adjusted title for clarity
//     : dictionary.userPages.add_new_user || "Add New User";

//   const submitButtonText = isSaving
//     ? isEditing
//       ? dictionary.userPages.saving || "Saving..."
//       : dictionary.userPages.creating || "Creating..."
//     : isEditing
//     ? dictionary.userPages.save_changes || "Save Changes"
//     : dictionary.userPages.create;

//   return (
//     // Assuming this form is inside a modal or a visible panel triggered by setShowForm
//     <form
//       onSubmit={handleSubmit}
//       className="px-10 py-5 bg-white dark:bg-slate-700 rounded-md shadow-lg"
//     >
//       <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-gray-100">
//         {modalTitle}
//       </h2>

//       <label htmlFor="name" className={labelStyles}>
//         {dictionary.userPages.name}:
//       </label>
//       <input
//         type="text"
//         id="name"
//         name="name"
//         value={name}
//         onChange={(e) => setName(e.target.value)}
//         required
//         className={inputFieldStyles}
//       />

//       <label htmlFor="email" className={labelStyles}>
//         {dictionary.userPages.email}:
//       </label>
//       <input
//         type="email"
//         id="email"
//         name="email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//         required
//         className={inputFieldStyles}
//       />

//       {/* Password Fields - ONLY RENDER WHEN ADDING */}
//       {!isEditing && (
//         <>
//           <div>
//             <label htmlFor="password" className={labelStyles}>
//               {dictionary.loginPage.password}:
//             </label>
//             <div className={passwordInputContainerStyles}>
//               <input
//                 type={showPassword ? "text" : "password"}
//                 id="password"
//                 name="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required={!isEditing} // Required only when adding (redundant check but safe)
//                 className={passwordInputWithPaddingStyles}
//               />
//               <button
//                 type="button"
//                 onClick={toggleShowPassword}
//                 className={passwordToggleStyles}
//               >
//                 {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//               </button>
//             </div>
//           </div>

//           <div>
//             <label htmlFor="confirmPassword" className={labelStyles}>
//               {dictionary.userPages.confirm_password || "Confirm Password"}:
//             </label>
//             <div className={passwordInputContainerStyles}>
//               <input
//                 type={showPassword ? "text" : "password"}
//                 id="confirmPassword"
//                 name="confirmPassword"
//                 value={confirmPassword}
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//                 required={!isEditing} // Required only when adding (redundant check but safe)
//                 className={passwordInputWithPaddingStyles}
//               />
//               <button
//                 type="button"
//                 onClick={toggleShowPassword}
//                 className={passwordToggleStyles}
//               >
//                 {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//               </button>
//             </div>
//           </div>
//         </>
//       )}

//       <div>
//         <label htmlFor="roleId" className={labelStyles}>
//           {dictionary.userPages.role}:
//         </label>
//         {isLoadingRoles ? (
//           <Loading className="w-5 h-5 mt-2" />
//         ) : isRolesError ? (
//           <p className="text-red-500 mt-2">
//             {dictionary.general.error_loading_roles || "Error loading roles."}
//           </p>
//         ) : (
//           <select
//             name="roleId"
//             id="roleId"
//             value={roleId}
//             onChange={(e) => setRoleId(e.target.value)}
//             className={`${inputFieldStyles} capitalize`}
//             required
//           >
//             <option value="">{dictionary.userPages.select_role}</option>
//             {roles?.map((role) => (
//               <option key={role.id} value={role.id}>
//                 {role.name}
//               </option>
//             ))}
//           </select>
//         )}
//       </div>

//       <div className="mt-6 flex justify-end">
//         <button
//           type="button"
//           onClick={() => setShowForm(false)}
//           className="mr-4 bg-red-400 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded shadow transition duration-300 ease-in-out"
//         >
//           {dictionary.activation.cancel}
//         </button>
//         <button
//           type="submit"
//           disabled={isSaving || isLoadingRoles}
//           className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-4 rounded shadow transition duration-300 ease-in-out"
//         >
//           {isSaving ? (
//             <div className="flex items-center">
//               <Loading className="w-5 h-5 mr-2" /> {submitButtonText}
//             </div>
//           ) : (
//             submitButtonText
//           )}
//         </button>
//       </div>
//     </form>
//   );
// }

// export default AddEditUserForm;
"use client";

import { useState, useEffect, useMemo } from "react"; // Import useMemo
import { useFetchRolesQuery } from "@/store/slices/roleApi";
import { useSession } from "next-auth/react"; // Import useSession
// We only need useAddUserMutation and useSingleUserUpgradeByIdMutation here.
import {
  useAddUserMutation,
  useSingleUserUpgradeByIdMutation,
} from "@/store/slices/userApi";
import { toast } from "react-toastify";

import { Eye, EyeOff } from "lucide-react";
import Loading from "../../loadding";

// The form will now handle Adding (with password) and Editing Details (without password)
function AddEditUserForm({ setShowForm, dictionary, userToEdit }) {
  // Determine if we are in editing mode
  const isEditing = !!userToEdit;

  // Get session data for the logged-in user
  const { data: session } = useSession();
  const loggedInUser = session?.user; // The user whose session this is

  // Initialize state based on userToEdit
  const [name, setName] = useState(userToEdit?.name || "");
  const [email, setEmail] = useState(userToEdit?.email || "");
  // Password and confirmPassword states are ONLY relevant for Adding
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // State for showing/hiding password (relevant only when password fields are shown)
  const [showPassword, setShowPassword] = useState(false);
  // Convert roleId to string for the select input's value attribute
  const [roleId, setRoleId] = useState(userToEdit?.roleId?.toString() || "");

  // Fetch roles for the select dropdown (fetches ALL roles initially)
  const {
    data: roles, // Renamed to allRoles as we will filter it
    isLoading: isLoadingRoles,
    isError: isRolesError,
    error: rolesError,
  } = useFetchRolesQuery();

  // Add mutation hook (used ONLY when adding)
  const [
    addUser,
    {
      isLoading: isAdding,
      isError: isAddError,
      isSuccess: isAddSuccess,
      error: addError,
    },
  ] = useAddUserMutation();

  // Update mutation hook (used ONLY when editing details)
  const [
    updateUser,
    {
      isLoading: isUpdating,
      isError: isUpdateError,
      isSuccess: isUpdateSuccess,
      error: updateError,
    },
  ] = useSingleUserUpgradeByIdMutation(); // Assuming this is the update endpoint

  // Combine loading and error states
  const isSaving = isAdding || isUpdating;
  const isSaveError = isAddError || isUpdateError;
  const isSaveSuccess = isAddSuccess || isUpdateSuccess;
  const saveError = isAddError ? addError : updateError; // Use error from whoever failed


  // Effect for showing errors
  useEffect(() => {
    if (isSaveError) {
      toast.error(
        saveError?.data?.message ||
        dictionary.general.an_error_occurred ||
        "An error occurred."
      );
    }
  }, [isSaveError, saveError, dictionary]);

  // Effect for handling success
  useEffect(() => {
    if (isSaveSuccess) {
      const successMessage = isEditing
        ? dictionary.userPages.update_success ||
        "User details updated successfully!"
        : dictionary.userPages.add_success || "User added successfully!";

      toast.success(successMessage);
      setShowForm(false); // Close the form on success
    }
  }, [isSaveSuccess, setShowForm, isEditing, dictionary]);

  // Frontend password match validation (only relevant when adding)
  const validatePasswordMatch = () => {
    // This validation ONLY applies when adding a user
    if (!isEditing) {
      if (password !== confirmPassword) {
        toast.error(
          dictionary.userPages.password_mismatch || "Passwords do not match."
        );
        return false;
      }
      // Also check if password is provided when adding
      if (!password) {
        toast.error(
          dictionary.userPages.password_required ||
          "Password is required for new users."
        );
        return false;
      }
    }
    // If editing, or if passwords match when adding, return true
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate passwords ONLY if adding
    if (!isEditing && !validatePasswordMatch()) {
      return; // Stop submission if adding and passwords don't match/are missing
    }

    // Basic validation for name, email, and roleId even when editing
    if (!name || !email || !roleId) {
      toast.error(dictionary.general.missing_required_fields || "Please fill in all required fields.");
      return;
    }


    const payload = {
      name,
      email,
      roleId: parseInt(roleId), // Parse back to number for the API
    };

    if (isEditing) {
      // If editing, call updateUserMutation with just details
      if (!userToEdit?.id) {
        toast.error(
          dictionary.general.missing_user_id ||
          "Error: User ID missing for update."
        );
        return;
      }
      // IMPORTANT: The updateUser endpoint should NOT require or expect the password field here.
      updateUser({ id: userToEdit.id, ...payload });
    } else {
      // If adding, call addUserMutation with all fields including password
      payload.password = password; // Include password in payload only when adding
      addUser(payload);
    }
  };

  // Toggle show password state (only relevant when password fields are shown)
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // --- Styles ---
  const inputFieldStyles =
    "w-full rounded-md border border-gray-300 py-2 px-4 outline-none transition-all duration-300 focus:border-blue-500 mt-2 lowercase dark:bg-slate-600 dark:text-gray-200";
  const labelStyles =
    "block text-sm font-semibold text-gray-700 mt-4 capitalize dark:text-gray-400";
  const passwordInputContainerStyles = "relative mt-2";
  const passwordToggleStyles =
    "absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200";
  const passwordInputWithPaddingStyles = `${inputFieldStyles} pr-10`;


  // Determine modal title and button text
  const modalTitle = isEditing
    ? dictionary.userPages.edit_user_details || "Edit User Details"
    : dictionary.userPages.add_new_user || "Add New User";

  const submitButtonText = isSaving
    ? isEditing
      ? dictionary.userPages.saving || "Saving..."
      : dictionary.userPages.creating || "Creating..."
    : isEditing
      ? dictionary.userPages.save_changes || "Save Changes"
      : dictionary.userPages.create;

  return (
    // Assuming this form is inside a modal or a visible panel triggered by setShowForm
    <form
      onSubmit={handleSubmit}
      className="px-10 py-5 bg-white dark:bg-slate-700 rounded-md shadow-lg"
    >
      <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        {modalTitle}
      </h2>

      <label htmlFor="name" className={labelStyles}>
        {dictionary.userPages.name}:
      </label>
      <input
        type="text"
        id="name"
        name="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className={inputFieldStyles}
      />

      <label htmlFor="email" className={labelStyles}>
        {dictionary.userPages.email}:
      </label>
      <input
        type="email"
        id="email"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className={inputFieldStyles}
      />

      {/* Password Fields - ONLY RENDER WHEN ADDING */}
      {!isEditing && (
        <>
          <div>
            <label htmlFor="password" className={labelStyles}>
              {dictionary.loginPage.password}:
            </label>
            <div className={passwordInputContainerStyles}>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required // Required only when adding
                className={passwordInputWithPaddingStyles}
              />
              <button
                type="button"
                onClick={toggleShowPassword}
                className={passwordToggleStyles}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className={labelStyles}>
              {dictionary.userPages.confirm_password || "Confirm Password"}:
            </label>
            <div className={passwordInputContainerStyles}>
              <input
                type={showPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required // Required only when adding
                className={passwordInputWithPaddingStyles}
              />
              <button
                type="button"
                onClick={toggleShowPassword}
                className={passwordToggleStyles}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
        </>
      )}

      <div>
        <label htmlFor="roleId" className={labelStyles}>
          {dictionary.userPages.role}:
        </label>
        {isLoadingRoles ? (
          <Loading className="w-5 h-5 mt-2" />
        ) : isRolesError ? (
          <p className="text-red-500 mt-2">
            {dictionary.general.error_loading_roles || "Error loading roles."}
          </p>
        ) : (
          <select
            name="roleId"
            id="roleId"
            value={roleId}
            onChange={(e) => setRoleId(e.target.value)}
            className={`${inputFieldStyles} capitalize`}
            required
            // Disable select if no roles are available after filtering
            disabled={roles.length === 0 && !roleId}
          >
            <option value="">{dictionary.userPages.select_role}</option>
            {/* Render options from filteredRoles */}
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
            {/* If editing and the current role is not in the filtered list,
                 we still want to show it as the selected value initially.
                 The useMemo logic adds the current role to filteredRoles when editing,
                 so this block is not strictly needed if that logic works. */}
            {/* {isEditing && userToEdit?.role && !filteredRoles.some(r => r.id === userToEdit.role.id) && (
                <option key={userToEdit.role.id} value={userToEdit.role.id} disabled>
                    {userToEdit.role.name} (Current)
                </option>
             )} */}
          </select>
        )}
        {/* Optional: Display a message if no roles are available to assign */}
        {!isLoadingRoles && !isRolesError && roles.length === 0 && !isEditing && (
          <p className="text-sm text-gray-500 mt-1">
            You do not have permission to assign roles.
            {/* If editing, this message might be misleading if they can see the current role */}
          </p>
        )}
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={() => setShowForm(false)}
          className="mr-4 bg-red-400 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded shadow transition duration-300 ease-in-out"
        >
          {dictionary.activation.cancel}
        </button>
        <button
          type="submit"
          disabled={isSaving || isLoadingRoles || (roles.length === 0 && !isEditing)} // Disable if no roles to pick (unless editing)
          className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-4 rounded shadow transition duration-300 ease-in-out"
        >
          {isSaving ? (
            <div className="flex items-center">
              <Loading className="w-5 h-5 mr-2" /> {submitButtonText}
            </div>
          ) : (
            submitButtonText
          )}
        </button>
      </div>
    </form>
  );
}

export default AddEditUserForm;