"use client";

import React, { useState } from "react";
import Button from "@/components/ui/button/Button";
import Alert from "@/components/ui/alert/Alert";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { useRouter } from "next/navigation";
import { useCreateReminder } from "@/hooks/useCreateReminder";

interface ReminderData {
  title: string;
  description: string;
  notificationType: string;
  reminderAt: string;
}

export default function ReminderForm() {
  const router = useRouter();

  const { mutate: createReminder } = useCreateReminder();

  const [reminder, setReminder] = useState<ReminderData>({
    title: "",
    description: "",
    notificationType: "",
    reminderAt: "",
  });

  const [errors, setErrors] = useState<Partial<ReminderData>>({});

  const [alert, setAlert] = useState({
    show: false,
    title: "",
    message: "",
    variant: "",
  });

  const notificationOptions = [
    { value: "EMAIL", label: "Email Notification" },
    { value: "IN_APP", label: "In-App Notification" },
  ];

  const handleChange = (field: keyof ReminderData, value: string) => {
    setReminder((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const validate = () => {
    const newErrors: Partial<ReminderData> = {};

    if (!reminder.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!reminder.notificationType) {
      newErrors.notificationType = "Notification type required";
    }

    if (!reminder.reminderAt) {
      newErrors.reminderAt = "Reminder date required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    createReminder(reminder, {
      onSuccess: () => {
        setAlert({
          show: true,
          title: "Reminder Created",
          message: "Reminder created successfully",
          variant: "success",
        });

        setTimeout(() => {
          router.back();
        }, 2000);
      },

      onError: () => {
        setAlert({
          show: true,
          title: "Error",
          message: "Failed to create reminder",
          variant: "error",
        });
      },
    });
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Create Reminder" />

      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="border-b pb-4 mb-6 text-lg font-semibold">
          Reminder Information
        </h2>

        {alert.show && (
          <Alert
            variant={alert.variant === "success" ? "success" : "error"}
            title={alert.title}
            message={alert.message}
          />
        )}

        <div className="space-y-6">
          {/* TITLE */}
          <div>
            <Label>Title *</Label>
            <Input
              type="text"
              placeholder="Call client"
              value={reminder.title}
              onChange={(e) => handleChange("title", e.target.value)}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title}</p>
            )}
          </div>

          {/* DESCRIPTION */}
          <div>
            <Label>Description</Label>
            <Input
              type="text"
              placeholder="Discuss course details"
              value={reminder.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>

          {/* NOTIFICATION TYPE */}
          <div>
            <Label>Notification Type *</Label>
            <Select
              options={notificationOptions}
              placeholder="Select notification type"
              value={reminder.notificationType}
              onChange={(value) => handleChange("notificationType", value)}
            />
            {errors.notificationType && (
              <p className="text-sm text-red-500">
                {errors.notificationType}
              </p>
            )}
          </div>

          {/* REMINDER DATE */}
          <div>
            <Label>Reminder Date *</Label>
            <Input
              type="datetime-local"
              value={reminder.reminderAt}
              onChange={(e) => handleChange("reminderAt", e.target.value)}
            />
            {errors.reminderAt && (
              <p className="text-sm text-red-500">{errors.reminderAt}</p>
            )}
          </div>

          {/* BUTTONS */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" size="sm" onClick={() => router.back()}>
              Cancel
            </Button>

            <Button size="sm" onClick={handleSubmit}>
              Create Reminder
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}