import { apiSlice } from "../api/apiSlice";

export const tariffApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchTariffs: builder.query({
      query: () => `/activation/tarrifs`,
      providesTags: ["tariffs"],
    }),

    fetchSingleTariff: builder.query({
      query: (id) => `/activation/tarrifs/${id}`,
      providesTags: ["tariff"],
    }),

    addTariff: builder.mutation({
      query: (tariff) => ({
        url: "/activation/tarrifs",
        method: "POST",
        body: tariff,
      }),
      invalidatesTags: ["tariffs"],
    }),

    updateTariff: builder.mutation({
      query: (tariff) => ({
        url: `/activation/tarrifs/${tariff.id}`,
        method: "PUT",
        body: tariff,
      }),
      invalidatesTags: ["tariffs", "tariff"],
    }),

    deleteTariff: builder.mutation({
      query: (id) => ({
        url: `/activation/tarrifs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["tariffs", "tariff"],
    }),
  }),
});

export const {
  useFetchTariffsQuery,
  useFetchSingleTariffQuery,
  useAddTariffMutation,
  useUpdateTariffMutation,
  useDeleteTariffMutation,
} = tariffApi;
