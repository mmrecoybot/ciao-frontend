import { apiSlice } from "../api/apiSlice";

export const tariffOptionsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchTariffOptions: builder.query({
      query: () => `/activation/tarrifoptions`,
    }),

    fetchSingleTariffOption: builder.query({
      query: (id) => `/activation/tarrifoptions/${id}`,
    }),

    addTariffOption: builder.mutation({
      query: (tariffOption) => ({
        url: "/activation/tarrifoptions",
        method: "POST",
        body: tariffOption,
      }),
    }),

    updateTariffOption: builder.mutation({
      query: (tariffOption) => ({
        url: `/activation/tarrifoptions/${tariffOption.id}`,
        method: "PUT",
        body: tariffOption,
      }),
    }),

    deleteTariffOption: builder.mutation({
      query: (id) => ({
        url: `/activation/tariffoptions/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useFetchTariffOptionsQuery,
  useFetchSingleTariffOptionQuery,
  useAddTariffOptionMutation,
  useUpdateTariffOptionMutation,
  useDeleteTariffOptionMutation,
} = tariffOptionsApi;
