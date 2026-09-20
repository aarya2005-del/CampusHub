import { useEffect, useState } from "react";
import {
  Bell,
  Check,
  CheckCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";

function NotificationsPage() {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [markingAll, setMarkingAll] = useState(false);

  const fetchNotifications = async () => {
    try {
      setLoading(true);

      const response = await api.get(
        "/notifications/me"
      );

      setNotifications(
        response.data.notifications || []
      );

      setUnreadCount(
        response.data.unreadCount || 0
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to load notifications."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleNotificationClick = async (
    notification
  ) => {
    try {
      if (!notification.isRead) {
        await api.patch(
          `/notifications/${notification._id}/read`
        );

        setNotifications((current) =>
          current.map((item) =>
            item._id === notification._id
              ? { ...item, isRead: true }
              : item
          )
        );

        setUnreadCount((current) =>
          Math.max(0, current - 1)
        );
      }

      if (notification.link) {
        navigate(notification.link);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to update notification."
      );
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      setMarkingAll(true);

      await api.patch(
        "/notifications/read-all"
      );

      setNotifications((current) =>
        current.map((notification) => ({
          ...notification,
          isRead: true,
        }))
      );

      setUnreadCount(0);

      toast.success(
        "All notifications marked as read"
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to update notifications."
      );
    } finally {
      setMarkingAll(false);
    }
  };

  return (
    <div className="text-white">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-black">
            Notifications
          </h1>

          <p className="text-slate-400 mt-2">
            Stay updated with your CampusHub activity.
          </p>
        </div>

        <button
          type="button"
          onClick={handleMarkAllAsRead}
          disabled={
            unreadCount === 0 || markingAll
          }
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <CheckCheck size={19} />

          {markingAll
            ? "Updating..."
            : "Mark All as Read"}
        </button>
      </div>

      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
            <Bell size={24} />
          </div>

          <div>
            <p className="text-sm text-slate-400">
              Unread Notifications
            </p>

            <p className="text-3xl font-black">
              {unreadCount}
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-8 text-slate-400">
          Loading notifications...
        </div>
      ) : notifications.length === 0 ? (
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-10 text-center">
          <Bell
            size={42}
            className="mx-auto text-slate-600 mb-4"
          />

          <h2 className="text-xl font-bold">
            No notifications
          </h2>

          <p className="text-slate-400 mt-2">
            You're all caught up.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <button
              key={notification._id}
              type="button"
              onClick={() =>
                handleNotificationClick(
                  notification
                )
              }
              className={`w-full text-left border rounded-2xl p-5 transition ${
                notification.isRead
                  ? "bg-slate-900/40 border-slate-800"
                  : "bg-blue-500/5 border-blue-500/30 hover:border-blue-500/60"
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-11 h-11 shrink-0 rounded-xl flex items-center justify-center ${
                    notification.isRead
                      ? "bg-slate-800 text-slate-400"
                      : "bg-blue-500/10 text-blue-400"
                  }`}
                >
                  {notification.isRead ? (
                    <Check size={20} />
                  ) : (
                    <Bell size={20} />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 className="font-black text-lg">
                      {notification.title}
                    </h2>

                    {!notification.isRead && (
                      <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full">
                        New
                      </span>
                    )}
                  </div>

                  <p className="text-slate-400 mt-1">
                    {notification.message}
                  </p>

                  <p className="text-xs text-slate-500 mt-3">
                    {new Date(
                      notification.createdAt
                    ).toLocaleString()}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default NotificationsPage;