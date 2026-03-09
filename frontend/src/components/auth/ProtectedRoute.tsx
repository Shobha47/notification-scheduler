// components/auth/ProtectedRoute.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

type ProtectedRouteProps = {
  children: React.ReactNode;
  allowedRoles?: string[]; // Optional (defaults to MASTER_ADMIN + CLIENT_ADMIN)
};

export default function ProtectedRoute({
  children,
}: ProtectedRouteProps) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    const token = sessionStorage.getItem("token");

    // 🚫 No token → redirect to login
    if (!token) {
      router.replace("/signin");
      return;
    }

    // ✅ Allow rendering
  setLoading(false);

  }, [user, router]);

  if (loading) return (
    <div className="flex h-screen items-center justify-center">
      Loading dashboard in Protechted route...
    </div>
  );; // can replace with a spinner if you like

  return <>{children}</>;
}
