import { apiSlice } from "../api/apiSlice";

export const workflowApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchWorkflows: builder.query({
      query: () => `/hr/workflows`,
    }),

    fetchWorkflowById: builder.query({
      query: (id) => `/hr/workflows/${id}`,
    }),

    createWorkflow: builder.mutation({
      query: (workflow) => ({
        url: "/hr/workflows",
        method: "POST",
        body: workflow,
      }),
    }),

    postStep: builder.mutation({
      query: (data) => ({
        url: `/hr/workflows/${data.workflowId}/steps`,
        method: "POST",
        body: data.step,
      }),
    }),
    updateWorkflow: builder.mutation({
      query: (workflow) => ({
        url: `/hr/workflows/${workflow.id}`,
        method: "PUT",
        body: workflow,
      }),
    }),
    cancelWorkflow: builder.mutation({
      query: (workflowId) => ({
        url: `/hr/workflows/${workflowId}/cancel`,
        method: "POST",
      }),
    }),
    deleteWorkflow: builder.mutation({
      query: (id) => ({
        url: `/hr/workflows/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useFetchWorkflowsQuery,
  useFetchWorkflowByIdQuery,
  useCreateWorkflowMutation,
  useUpdateWorkflowMutation,
  useDeleteWorkflowMutation,
  useCancelWorkflowMutation,
  usePostStepMutation,
} = workflowApi;
