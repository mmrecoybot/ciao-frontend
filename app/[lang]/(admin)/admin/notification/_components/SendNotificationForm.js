"use client"

import { useCreateNotificationMutation } from "@/store/slices/notificationApi";
import { useFetchUsersQuery } from "@/store/slices/userApi";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";


export default function SendNotificationForm({dictionary}) {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    const { data: allUser, isLoading, isError, error } = useFetchUsersQuery();

    const [
        sendNotification,
        {
            isLoading: updateLoading,
            isSuccess: updateSuccess,
            isError: updateError,
        },
    ] = useCreateNotificationMutation();

    useEffect(() => {
        if (updateSuccess) {
            toast.success("Notification send successfully!");
            reset();
        }

        if (updateError) {
            toast.error(
                `Failed to send notification: ${updateError.message || "Unknown error occurred"
                }`
            );
        }
    }, [updateSuccess, updateError, reset]);

    const onSubmit = (data) => {
        // console.log(data);
        // const newNotification = { ...data, userId: parseInt(data?.userId) }
        // console.log(newNotification);
        sendNotification(
            {
                "title": data?.title,
                "body": data?.body,
                "userId": parseInt(data?.userId)
            }
        )
    };

    return (
        <div className="md:w-1/2 w-10/12 mx-auto mt-20 p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4 text-center py-2">{dictionary.sendNotificationForm.send_notification}</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block text-gray-700 dark:text-white font-medium">{dictionary.sendNotificationForm.title}</label>
                    <input
                        type="text"
                        {...register("title", { required: `${dictionary.sendNotificationForm.title_is_required}` })}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={dictionary.sendNotificationForm.notification_title}
                    />
                    {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
                </div>

                <div>
                    <label className="block text-gray-700 dark:text-white font-medium">{dictionary.sendNotificationForm.content}</label>
                    <textarea
                        {...register("body", { required: `${dictionary.sendNotificationForm.content_is_required}` })}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 dark:text-gray-300 focus:ring-blue-500"
                        placeholder="Notification Content"
                    />
                    {errors.body && <p className="text-red-500 text-sm">{errors.body.message}</p>}
                </div>

                <div>
                    <label className="block text-gray-700 dark:text-white font-medium">{dictionary.sendNotificationForm.select_recipient}</label>
                    <select
                        {...register("userId", { required: `${dictionary.sendNotificationForm.recipient_is_required}` })}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 dark:text-gray-300 focus:ring-blue-500">
                        <option value="" className="dark:bg-gray-900">{dictionary.sendNotificationForm.select_a_person}</option>
                        {
                            isLoading ||
                            allUser.map((user, indx) => (
                                <option key={indx} value={user?.id} className="dark:bg-gray-900">{user?.name}</option>
                            ))
                        }
                    </select>
                    {errors.userId && <p className="text-red-500 text-sm">{errors.userId.message}</p>}
                </div>

                <button
                    type="submit"
                    disabled={updateLoading}
                    className="w-full bg-emerald-500 text-white p-2 rounded-lg hover:bg-emerald-600 transition">
                    {updateLoading ? `${dictionary.sendNotificationForm.sending}...`: `${dictionary.sendNotificationForm.send_notification}`}
                </button>
            </form>
        </div>
    );
}
