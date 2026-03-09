// src/lib/api.ts
import axios from "axios";
import { apiClientNew } from "./apiClient";

interface GetReminderParams {
  token: string;
  page?: number;
  limit?: number;
  search?: string;
  sortField?: string;
  sortOrder?: "asc" | "desc";
  leadStatus?: "HOT" | "WARM" | "COLD" | null;
}

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5001/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const createUser = async (userData: {
  name: string;
  email: string;
  password: string;
}) => {
  const res = await apiClient.post("/create-user", userData);

  return res.data;
};


// Example POST request
export const userLogin = async (userData: {
  email: string;
  password: string;
}) => {
  if (!userData.email || !userData.password) {
    console.error("❌ Required fields missing!"); //console.error is to displayerror in turbo
    throw new Error("Email and password are required.");
  }

  try {
    const response = await apiClient.post("/auth/login", userData);
    return response.data;
  } catch (err: any) {
    // Optional: You can handle or rethrow the API error here
    console.error("❌ Login API failed:", err.response?.data || err.message);
    throw new Error(
      err.response?.data?.error ||
        err.response?.data ||
        err.response?.data?.message ||
        "Login failed.",
    );
  }
};


// 🔧 FIXED getUser API with token header
export const getUser = async (token: string) => {
  const response = await apiClient.get("/user", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};


export const getReminder = async ({
  token,
  page = 1,
  limit = 5,
  search = "",
  sortField,
  sortOrder,
  leadStatus,
}: GetReminderParams) => {
  const response = await apiClient.get("/reminder", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      page,
      limit,
      search,
      sortField,
      sortOrder,
      leadStatus,
    },
  });

  return response.data;
};

// 🔧 FIXED getUser API with token header
export const createReminderAPI = async (token: string, newReminderData: any) => {
  const response = await apiClient.post(`/create-reminder`, newReminderData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// 🔧 FIXED getUser API with token header
export const editEnquiryAPI = async (token: string, newReminderData: any) => {
  const response = await apiClient.put("/edit-reminder", newReminderData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};