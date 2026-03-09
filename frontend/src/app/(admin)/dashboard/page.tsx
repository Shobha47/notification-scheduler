"use client";
import React, { useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";

import { exportAnalyticsToExcel } from "@/app/utils/exportToExcel";

// ⭐ Dynamic Imports

import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import MonthlyTarget from "@/components/ecommerce/MonthlyTarget";
import StatisticsChart from "@/components/ecommerce/StatisticsChart";
import DemographicCard from "@/components/ecommerce/DemographicCard";
import EnquiryTarget from "@/components/ecommerce/EnquiryPieChart";
import RecentOrders from "@/components/ecommerce/RecentOrders";
import { getReminder } from "@/lib/api";
import { setError, setReminders, setTotal } from "@/store/slice/reminderSlice";
import { useFetchReminder } from "@/hooks/useQueryFetchEnquiry";
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
//const EcommerceMetrics = dynamic(() => import("@/components/ecommerce/EcommerceMetrics"));

export default function Ecommerce() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const user = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: RootState) => state.auth.token);
  const reminder = useSelector((state: RootState) => state.reminder.reminders);

  console.log("GET USER DTA IN ECOMMERCE:", user);

  // Redirect if no token
  useEffect(() => {
    if (!token) {
      router.push("/signin");
    }
  }, [token, router]);

  const { data, isLoading } = useFetchReminder({
    token,
    page: 1,
    limit: 10,
  });
  
  if (isLoading) return <div>Loading...</div>;
  
  const reminders = data?.data || [];
  
  const totalReminders = reminders.length;
  
  const pendingReminders = reminders.filter(
    (r: any) => r.status === "pending"
  ).length;
  
  const triggeredReminders = reminders.filter(
    (r: any) => r.status === "triggered"
  ).length;

  if (isLoading) return <div>Loading...</div>;

  const summary = data?.summary || {
    totalReminders: 0,
    pendingReminders: 0,
    triggeredReminders: 0,
  };

  console.log("GETDATA IN ECCOMERS:", data);

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-12">
      <EcommerceMetrics
        summary={summary}
        breakdown={{
          pending: summary.pendingReminders,
          triggered: summary.triggeredReminders,
        }}
      />
      </div>
    </div>
  );
}
