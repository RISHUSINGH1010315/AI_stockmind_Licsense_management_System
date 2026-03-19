import { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";
import API from "../api/axios";
import socket from "../socket";

function NotificationBell() {
    const [notifications, setNotifications] = useState([]);
    const [open, setOpen] = useState(false);

    // ⭐ GET NOTIFICATIONS
    const fetchNotifications = async () => {
        try {
            const res = await API.get("/notifications");
            setNotifications(res.data);
        } catch (err) {
            console.log("Notification fetch error:", err.response?.data || err.message);
        }
    };

    useEffect(() => {
        fetchNotifications();

        const user = JSON.parse(localStorage.getItem("user"));

        if (user?.id) {
            socket.emit("join", user.id);
        }

        // ⭐ IMPORTANT: named handler function
        const handleNewNotification = (data) => {
            setNotifications(prev => [data, ...prev]);
        };

        socket.on("new_notification", handleNewNotification);

        // ⭐ Proper cleanup (same reference)
        return () => {
            socket.off("new_notification", handleNewNotification);
        };
    }, []);

    // ⭐ MARK AS READ FIXED
    const markAsRead = async (id) => {
        try {
            await API.put(`/notifications/read/${id}`);
            fetchNotifications();
        } catch (err) {
            console.log("Mark read error:", err.response?.data || err.message);
        }
    };

    const unreadCount = notifications.filter(n => !n.is_read).length;

    return (
        <div className="relative">

            {/* 🔔 Bell Button */}
            <button
                onClick={() => setOpen(!open)}
                className="relative w-11 h-11 flex items-center justify-center 
        bg-indigo-50 hover:bg-indigo-100 
        text-indigo-600 rounded-full shadow"
            >
                <FaBell />

                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white 
            text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        {unreadCount}
                    </span>
                )}
            </button>

            {/* 🔽 Dropdown */}
            {open && (
                <div className="absolute right-0 mt-4 w-96 bg-white rounded-2xl shadow-2xl border p-4 z-50">
                    <h3 className="text-lg font-semibold mb-4">Notifications</h3>

                    <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 && (
                            <p className="text-gray-500 text-sm">No notifications yet</p>
                        )}

                        {notifications.map((n) => (
                            <div
                                key={n.id}
                                onClick={() => markAsRead(n.id)}
                                className={`p-3 mb-3 rounded-xl cursor-pointer
                ${n.is_read
                                        ? "bg-gray-100"
                                        : "bg-indigo-50 border border-indigo-200"
                                    }`}
                            >
                                <p className="font-semibold text-sm">{n.title}</p>
                                <p className="text-xs text-gray-600 mt-1">{n.message}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default NotificationBell;