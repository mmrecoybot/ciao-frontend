import { apiSlice } from "../api/apiSlice";

export const usersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchUsers: builder.query({
      query: () => "/users",
      providesTags: ["users"],
    }),

    fetchUserById: builder.query({
      query: (id) => ({
        url: `/users/${id}`,
        method: "GET",
        providesTags: ["users"],
      }),
    }),

    addUser: builder.mutation({
      query: (user) => ({
        url: "/auth/register",
        method: "POST",
        body: user,
      }),
      invalidatesTags: ["users"],
    }),

    singleUserUpgradeById: builder.mutation({
      query: (user) => ({
        url: `/users/${user.id}`,
        method: "PUT",
        body: user,
      }),
      invalidatesTags: ["users"],
    }),
    changeUserPassword: builder.mutation({
      query: (user) => ({
        url: `/auth/password/change`,
        method: "PUT",
        body: user,
      }),
      invalidatesTags: ["users"],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["users"],
    }),
  }),
});

export const {
  useFetchUsersQuery,
  useFetchUserByIdQuery,
  useAddUserMutation,
  useSingleUserUpgradeByIdMutation,
  useChangeUserPasswordMutation,
  useDeleteUserMutation,
} = usersApi;
