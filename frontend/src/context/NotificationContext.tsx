

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
    console.log("user in notification provider:", user);
    if (!user || !user?.id) return; // wait for user

    socket.connect();

    const handleNotification = (data: any, type: "REMINDER" | "REMINDER") => {

      const newNotification = {
        id: data.id,
        notificationMessage: data.notificationMessage || data.message,
        createdAt: data.createdAt,
      };

      setNotifications((prev) => [newNotification, ...prev]);
      setUnreadCount((c) => c + 1);
      console.log("Notification received:", data);
    };

    
    socket.on("reminder-notification", (data) =>
      handleNotification(data, "REMINDER"),
    );
    socket.on("new-reminder-notification", (data) =>
      handleNotification(data, "REMINDER"),
    );

    return () => {
      socket.disconnect();
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

