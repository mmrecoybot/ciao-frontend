"use client";

import { useSendMailMutation } from "@/store/slices/sendMailApi";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import CodeEditor from "./CodeEditor";
import { useRef } from "react";
const emailTemp=`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Company Newsletter</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td align="center" style="padding: 0;">
                <table role="presentation" style="width: 600px; border-collapse: collapse; border: 0; border-spacing: 0; background-color: #ffffff;">
                    <!-- Header -->
                    <tr>
                        <td align="center" style="padding: 40px 0 30px 0; background-color: #70bbd9;">
                            <h1 style="font-size: 24px; margin: 0 0 20px 0; color: #ffffff;">Ciao Mobile</h1>
                        </td>
                    </tr>
                    <!-- Main Content -->
                    <tr>
                        <td style="padding: 36px 30px 42px 30px;">
                            <table role="presentation" style="width: 100%; border-collapse: collapse; border: 0; border-spacing: 0;">
                                <tr>
                                    <td style="padding: 0 0 36px 0; color: #153643;">
                                        <h2 style="font-size: 24px; margin: 0 0 20px 0; color: #153643;">Hello [Customer Name],</h2>
                                        <p style="margin: 0 0 12px 0; line-height: 24px; color: #153643;">Lorem ipsum dolor sit amet, consectetur adipiscing elit. In tempus adipiscing felis, sit amet blandit ipsum volutpat sed. Morbi porttitor, eget accumsan dictum, nisi libero ultricies ipsum, in posuere mauris neque at erat.</p>
                                        <p style="margin: 0; line-height: 24px; color: #153643;">Lorem ipsum dolor sit amet, consectetur adipiscing elit. In tempus adipiscing felis, sit amet blandit ipsum volutpat sed. Morbi porttitor, eget accumsan dictum, nisi libero ultricies ipsum, in posuere mauris neque at erat.</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 0;">
                                        <a href="https://www.example.com" style="display: inline-block; padding: 16px 36px; font-size: 16px; color: #ffffff; text-decoration: none; background-color: #70bbd9; border-radius: 6px;">Call To Action</a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 30px; background-color: #70bbd9;">
                            <table role="presentation" style="width: 100%; border-collapse: collapse; border: 0; border-spacing: 0; font-size: 9px; color: #ffffff;">
                                <tr>
                                    <td style="padding: 0; width: 50%;" align="left">
                                        <p style="margin: 0; font-size: 14px; line-height: 16px;">&copy; 2023 Ciao Mobile. All rights reserved.</p>
                                    </td>
                                    
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`
export default function SendMailForm({dictionary}) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm();

  const codeRef = useRef();

  const [
    sendMail,
    {
      isLoading: updateLoading,
      isSuccess: updateSuccess,
      isError: updateError,
    },
  ] = useSendMailMutation();

  useEffect(() => {
    if (updateSuccess) {
      toast.success("Mail send successfully!");
      reset();
    }

    if (updateError) {
      toast.error(
        `Failed to send mail: ${
          updateError.message || "Unknown error occurred"
        }`
      );
    }
  }, [updateSuccess, updateError]);

  const onSubmit = (data) => {
    sendMail({
      ...data,
      html: codeRef.current.getContent(),
    });
  };

  return (
    <div className="md:container w-10/12 mx-auto mt-10 mb-20 p-6 bg-gray-50 rounded-2xl shadow-lg ">
      <h2 className="text-2xl text-center font-semibold text-gray-800 mb-4 py-2">
        {dictionary.mailPage.send_mail}
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium">To</label>
          <input
            type="email"
            {...register("to", { required: `${dictionary.mailPage.recipient_email_is_required}` })} 
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={dictionary.mailPage.recipient_email}
          />
          {errors.to && (
            <p className="text-red-500 text-sm">{errors.to.message}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-700 font-medium">{dictionary.mailPage.subject}</label>
          <input
            type="text"
            {...register("subject", { required: `${dictionary.mailPage.subject_is_required}` })}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={dictionary.mailPage.email_subject}
          />
          {errors.subject && (
            <p className="text-red-500 text-sm">{errors.subject.message}</p>
          )}
        </div>

        {/* <div>
          <label className="block text-gray-700 font-medium">Text (Optional)</label>
          <textarea
            {...register("text")}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Email Content"
          />
          {errors.text && (
            <p className="text-red-500 text-sm">{errors.text.message}</p>
          )}
        </div> */}

        {/* vai ai jaigate apni kaj koren */}
        <div>
          <label
            htmlFor="html"
            className="block font-medium text-gray-700 dark:text-gray-400"
          >
            {dictionary.mailPage.mail_template}
          </label>

          <CodeEditor ref={codeRef} content={emailTemp} />
        </div>

        <button
          type="submit"
          disabled={updateLoading}
          className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
        >
          {updateLoading ? `${dictionary.sendNotificationForm.sending}` : `${dictionary.mailPage.send_mail}`}
        </button>
      </form>
    </div>
  );
}
