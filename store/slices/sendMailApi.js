import { apiSlice } from "../api/apiSlice";

export const sendMailApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    sendMail: builder.mutation({
      query: (data) => ({
        url: `/lib/mail`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});
export const { useSendMailMutation } = sendMailApi;
