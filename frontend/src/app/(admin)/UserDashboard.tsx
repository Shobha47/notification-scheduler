"use client";

import { useSidebar } from "@/context/SidebarContext";
import { socket } from "@/app/utils/socket";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";
import { setUser } from "@/store/slice/authSlice";
import ProtectedRoute from "@/components/auth/ProtectedRoute";


export default function MasterAdminLayout({
  children,
  user
}: {
  children: React.ReactNode;
  user: any;
}) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar()

  useEffect(() => {
    if (!user || !user.id) return;

    // Connect and join user's room
    socket.connect();
    const roomId = user.id;
    console.log("Socket IO is now Connected!", roomId);
    socket.emit("join", roomId); // or user.clientAdminId

    // Listen for notifications
    socket.on("reminder-notification", (data) => {
      console.log("🔔 New Reminder notification:", data.notificationMessage);
      console.log("🔔 New Reminder DATA notification:", data);
      // Update UI, show toast, badge, etc.
    });

    // Cleanup on unmount
    return () => {
      socket.off("reminder-notification");
      socket.disconnect();
    };
  }, [user]);

  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
      ? "lg:ml-[290px]"
      : "lg:ml-[90px]";

      console.log("GET TO MASTERADMINS DASHBOARD:")

  return (
    <ProtectedRoute>
      <div className="min-h-screen 2xl:flex">
        {/* Sidebar and Backdrop */}

        <AppSidebar />
        <Backdrop />
        {/* Main Content Area */}
        <div
          className={`flex-1 transition-all duration-300 ease-in-out ${mainContentMargin}`}
        >
          {/* Header */}
          <AppHeader />
          {/* Page Content */}
      
            <div className="mx-auto max-w-(--breakpoint-2xl) p-4 md:p-6">
              {children}
            </div>
     
        </div>
      </div>
    </ProtectedRoute>
  );
}
