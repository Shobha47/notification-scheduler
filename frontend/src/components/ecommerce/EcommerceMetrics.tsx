"use client";
import React from "react";
import Badge from "../ui/badge/Badge";
import { ArrowUpIcon, GroupIcon } from "@/icons";

interface EcommerceMetricsProps {
  summary: {
    totalReminders?: number;
    pendingReminders?: number;
    triggeredReminders?: number;
  };
  breakdown: any;
}

export const EcommerceMetrics = ({ summary, breakdown }: EcommerceMetricsProps) => {
  
  console.log("Get SUMMARY AND BREAKDOWN IN ECOMMARECE:", summary, breakdown);
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total Reminder
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {summary.totalReminders
              ? new Intl.NumberFormat('en-IN').format(summary.totalReminders)
              : 0} 
            </h4>
          </div>
          <Badge color="success">
            <ArrowUpIcon />
            11.01%
          </Badge>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Pending Reminder
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {summary.pendingReminders
              ? new Intl.NumberFormat('en-IN').format(summary.pendingReminders)
              : 0} 
            </h4>
          </div>
          <Badge color="success">
            <ArrowUpIcon />
            11.01%
          </Badge>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Triggred Reminder
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {summary.triggeredReminders
              ? new Intl.NumberFormat('en-IN').format(summary.triggeredReminders)
              : 0}
            </h4>
          </div>
          <Badge color="success">
            <ArrowUpIcon />
            11.01%
          </Badge>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}
  
      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}
    
      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}
     
      {/* <!-- Metric Item End --> */}
    </div>
  );
};
