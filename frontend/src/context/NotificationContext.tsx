

"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { socket } from "@/app/utils/socket";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

interface Notification {
  id: string;
  notificationMessage: string;
  createdAt: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAllRead: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {

    if (!user?.id) return;

    socket.connect();
    socket.emit("join", user.id);

    const handleNotification = (data: any) => {

      const newNotification = {
        id: data.id,
        notificationMessage: data.notificationMessage,
        createdAt: data.createdAt,
      };

      console.log("🔔 Notification received:", newNotification);

      setNotifications((prev) => [newNotification, ...prev]);
      setUnreadCount((c) => c + 1);
    };

    socket.on("reminder-notification", handleNotification);
    socket.on("new-reminder-notification", handleNotification);

    return () => {
      socket.off("reminder-notification", handleNotification);
      socket.off("new-reminder-notification", handleNotification);
    };

  }, [user]);

  const markAllRead = () => {
    setUnreadCount(0);
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, markAllRead }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

// export const useNotifications = () => useContext(NotificationContext);

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error(
      "useNotifications must be used inside NotificationProvider",
    );
  }
  return ctx;
};
