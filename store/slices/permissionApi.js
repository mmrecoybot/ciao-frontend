import { apiSlice } from "../api/apiSlice";

export const permissionApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchPermissions: builder.query({
      query: () => `/hr/permissions`,
    }),

    fetchPermissionById: builder.query({
      query: (id) => `/hr/permissions/${id}`,
    }),
    fetchPermissionByUserId: builder.query({
      query: (id) => `/hr/permissions/user/${id}`,
    }),

    addPermission: builder.mutation({
      query: (permission) => ({
        url: "/hr/permissions",
        method: "POST",
        body: permission,
      }),
    }),

    updatePermission: builder.mutation({
      query: (permission) => ({
        url: `/hr/permissions/${permission.id}`,
        method: "PUT",
        body: permission,
      }),
    }),

    deletePermission: builder.mutation({
      query: (id) => ({
        url: `/hr/permissions/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useFetchPermissionsQuery,
  useFetchPermissionByIdQuery,
  useFetchPermissionByUserIdQuery,
  useAddPermissionMutation,
  useUpdatePermissionMutation,
  useDeletePermissionMutation,
} = permissionApi;
