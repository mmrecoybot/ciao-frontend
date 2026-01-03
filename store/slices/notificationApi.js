import { apiSlice } from "../api/apiSlice";

export const notificationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchNotifications: builder.query({
      query: () => `/hr/notifications`,
      providesTags: ["notifications"],
    }),

    markNotificationAsSeen: builder.mutation({
      query: (notificationId) => ({
        url: `/hr/notifications/${notificationId}/seen`,
        method: "PATCH",
      }),
      invalidatesTags: ["notifications", "notification"],
    }),

    fetchUserNotifications: builder.query({
      query: (userId) => `/hr/notifications/user/${userId}`,
      providesTags: ["notifications"],
    }),

    createNotification: builder.mutation({
      query: (data) => ({
        url: "/hr/notifications",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["notifications", "notification"],
    }),

    getNotification: builder.query({
      query: (id) => `/hr/notifications/${id}`,
      providesTags: ["notification"],
    }),

    deleteNotification: builder.mutation({
      query: (id) => ({
        url: `/hr/notifications/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["notifications", "notification"],
    }),
  }),
});

export const {
  useFetchNotificationsQuery,
  useMarkNotificationAsSeenMutation,
  useFetchUserNotificationsQuery,
  useCreateNotificationMutation,
  useGetNotificationQuery,
  useDeleteNotificationMutation,
} = notificationApi;
