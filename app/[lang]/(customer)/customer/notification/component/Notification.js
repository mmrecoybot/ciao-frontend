"use client";
import { useFetchUserNotificationsQuery } from "@/store/slices/notificationApi";
import NotificationBar from "./NotificationBar";
import Loading from "../../components/Loading";

export default function Notification({ dictionary, params, user }) {
  const { data, isLoading } = useFetchUserNotificationsQuery(user.sub, {
    skip: !user?.sub,
  });
  if (isLoading) return <Loading />;
  return (
    <div className="space-y-2 p-2 ">
      {data?.map((notification) => (
        <NotificationBar
          dictionary={dictionary}
          key={notification.id}
          notification={notification}
        />
      ))}
    </div>
  );
}
