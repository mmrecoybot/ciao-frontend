import { apiSlice } from "../api/apiSlice";

export const simApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchSims: builder.query({
      query: () => "/activation/serialnumbers",
      providesTags: ["sims"],
    }),
    fetchNonActivatedSimByDealerId: builder.query({
      query: (id) => `/activation/serialnumbers/dealer/${id}/nonactivated`,
      providesTags: ["sim"],
    }),
    addSim: builder.mutation({
      query: (sim) => ({
        url: "/activation/serialnumbers",
        method: "POST",
        body: sim,
      }),
      invalidatesTags: ["sims", "dealer", "dealers"],
    }),
    updateSim: builder.mutation({
      query: (sim) => ({
        url: `/activation/serialnumbers/${sim.id}`,
        method: "PUT",
        body: sim,
      }),
      invalidatesTags: ["sims", "sim", "dealer", "dealers"],
    }),
    deleteSim: builder.mutation({
      query: (id) => ({
        url: `/activation/serialnumbers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["sims", "sim", "dealer", "dealers"],
    }),
  }),
});

export const {
  useFetchSimsQuery,
  useFetchSimByIdQuery,
  useAddSimMutation,
  useUpdateSimMutation,
  useDeleteSimMutation,
} = simApi;
