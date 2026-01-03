import { useMarkNotificationAsSeenMutation } from "@/store/slices/notificationApi";
import { Info, Loader } from "lucide-react";
import { AlertTriangle } from "lucide-react";
import React from "react";
import { useEffect } from "react";
import { CgDanger } from "react-icons/cg";
import { toast } from "react-toastify";

export default function NotificationBar({ dictionary, notification }) {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  const date = new Date(notification.createdAt).toLocaleString(
    "en-US",
    options
  );
  const [markNotificationAsSeen, { isLoading, isError, error, isSuccess }] =
    useMarkNotificationAsSeenMutation();
  const handleMarkAsSeen = () => {
    // Implement the logic to mark the notification as seen
    markNotificationAsSeen(notification.id);
  };
  useEffect(() => {
    if (isError) {
      toast.error(error.data.message);
    }
    if (isSuccess) {
      toast.success("Notification marked as seen");
    }
  }, [isError, error, isSuccess]);
  return (
    <div
      className={`flex items-center flex-wrap gap-4 p-4 ${
        notification.seen ? "bg-gray-100 dark:bg-gray-800" : "bg-lime-100 dark:bg-gray-700"
      } shadow-md rounded-md`}
    >
      {/* Sign Label */}
      <div className="bg-yellow-100 dark:bg-yellow-800  text-yellow-800 dark:text-yellow-400 px-2 py-1 text-sm font-medium rounded">
        {notification.title}
      </div>

      {/* Warning Icon */}
      {/* <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0" /> */}
      <Info className="w-5 h-5 text-green-500 flex-shrink-0" />
      {/* <CgDanger className="w-5 h-5 text-red-500 flex-shrink-0" /> */}

      {/* Message Content */}
      <div className="flex-grow">
        <p className="text-gray-700">{notification.body}</p>
      </div>

      {/* Timestamp */}
      <div className="text-sm text-gray-500 whitespace-nowrap">{date}</div>

      {/* Sign Button */}
      {notification.seen === false && (
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded text-sm transition-colors"
          onClick={handleMarkAsSeen}
          disabled={isLoading || notification.seen}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Loader className="w-4 h-4 animate-spin" /> {dictionary.notificationPage.processing}...
            </span>
          ) : (
            `${dictionary.notificationPage.mark_as_seen}`
          )}
        </button>
      )}
    </div>
  );
}
