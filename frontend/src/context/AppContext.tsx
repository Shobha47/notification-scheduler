// src/context/AppContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { setToken } from "@/store/slice/authSlice";


// Define the type of data you want to share
interface AppContextType {
  userData: any;
  setUserData: (data: any) => void;

  selectedItem: string | null;
  setSelectedItem: (item: string | null) => void;

  // Add more shared values here as needed
  notificationData: any;
  setNotificationData: (data: any) => void;

  // Add more shared values here as needed
  followUpData: any;
  setFollowUpData: (data: any) => void;

  // Add more shared values here as needed
  enquiryData: any;
  setEnquiryData: (data: any) => void;

  token: any;
  setToken: (data: any) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Provide the context to your app
export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [userData, setUserData] = useState<any>(null);
  const [notificationData, setNotificationData] = useState<any>(null);
  const [followUpData, setFollowUpData] = useState<any>(null);
  const [enquiryData, setEnquiryData] = useState<any>(null);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  //const [loading, setLoading] = useState(true);
  //const [token, setToken] = useState<string | null>(null);
  const router = useRouter();
  const token = useSelector((state: RootState) => state.auth.token);
  const user = useSelector((state: RootState) => state.auth.user);
  const reminder = useSelector((state: RootState) => state.reminder);
  const dispatch = useDispatch();

  // Local state for pagination and filters
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");


  return (
    <AppContext.Provider
      value={{
        userData,
        setUserData,
        selectedItem,
        setSelectedItem,
        notificationData,
        setNotificationData,
        token,
        setToken,
        followUpData,
        setFollowUpData,
        enquiryData,
        setEnquiryData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Hook to use the context
// export const useAppContext = () => {
//   const context = useContext(AppContext);
//   if (!context) {
//     throw new Error("useAppContext must be used within an AppProvider");
//   }
//   return context;
// };
