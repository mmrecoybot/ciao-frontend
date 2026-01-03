import { apiSlice } from "../api/apiSlice";

export const roleApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchRoles: builder.query({
      query: () => `/hr/roles`,
      providesTags: ["roles"],
    }),

    fetchRoleById: builder.query({
      query: (id) => `/hr/roles/${id}`,
      providesTags: ["role"],
    }),

    addRole: builder.mutation({
      query: (role) => ({
        url: "/hr/roles",
        method: "POST",
        body: role,
      }),
      invalidatesTags: ["roles"],
    }),

    updateRole: builder.mutation({
      query: (role) => ({
        url: `/hr/roles/${role.id}`,
        method: "PUT",
        body: role,
      }),
      invalidatesTags: ["roles","role"],
    }),

    deleteRole: builder.mutation({
      query: (id) => ({
        url: `/hr/roles/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["roles","role"],
    }),
    assignPermissionToRole: builder.mutation({
      query: ({ roleId, permissionIds }) => ({
        url: `/hr/roles/${roleId}/permissions`,
        method: "POST",
        body: { permissionIds },
      }),
      invalidatesTags: ["roles","role"],
    }),
    removePermissionFromRole: builder.mutation({
      query: ({ roleId, permissionId }) => ({
        url: `/hr/roles/${roleId}/permissions/${permissionId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["roles","role"],
    }),
  }),
});

export const {
  useFetchRolesQuery,
  useFetchRoleByIdQuery,
  useAddRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  useAssignPermissionToRoleMutation,
  useRemovePermissionFromRoleMutation,
} = roleApi;
