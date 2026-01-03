import { apiSlice } from "../api/apiSlice";

export const activationsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchActivations: builder.query({
      query: (searchTerm) => `/activation/activations`,
      providesTags: ["activations"],
    }),

    fetchSingleActivations: builder.query({
      query: (id) => `/activation/activations/${id}`,
      providesTags: ["activation"],
    }),

    fetchActivationsByCustomer: builder.query({
      query: (id) => `/activation/activations/user/${id}`,
      providesTags: ["activations"],
    }),

    addActivation: builder.mutation({
      query: (activation) => ({
        url: "/activation/activations",
        method: "POST",
        body: activation,
      }),
      invalidatesTags: ["activations",'dealers'],
    }),

    updateActivation: builder.mutation({
      query: (activation) => ({
        url: `/activation/activations/${activation.id}`,
        method: "PUT",
        body: activation,
      }),
      invalidatesTags: ["activations",'dealer',"activation"],
    }),
    deleteActivation: builder.mutation({
      query: (id) => ({
        url: `/activation/activations/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["activations", "activation"],
    }),
  }),
});

export const {
  useAddActivationMutation,
  useDeleteActivationMutation,
  useFetchActivationsQuery,
  useFetchSingleActivationsQuery,
  useUpdateActivationMutation,
  useFetchActivationsByCustomerQuery,
} = activationsApi;
