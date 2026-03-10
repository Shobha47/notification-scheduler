"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";

import { getUser } from "@/lib/api";
import MasterAdminLayout from "../UserDashboard";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const user = useSelector((state: RootState) => state.auth.user);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchUser() {
      try {
        // ⛔ Replace cookies() with sessionStorage
        const token = sessionStorage.getItem("token");

        if (!token) {
          router.replace("/signin");
          return;
        }

        // 👉 fetch user
        const data = await getUser(token);

        if (!data) throw new Error("User not found");

        console.log("het Uset ata in Admin Layout:", data);
        console.log("het Uset ata in Admin Layout:", data.user);
        dispatch(setUser(data.user));
      } catch (err) {
        router.replace("/signin");
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  if (loading) {
  return (
    <div className="flex h-screen items-center justify-center">
      Loading dashboard...
    </div>
  );
}

  return (
    <MasterAdminLayout user={user}>{children}</MasterAdminLayout>
  );
}


