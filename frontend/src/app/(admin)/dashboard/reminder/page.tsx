"use client";

import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { setCurrentPage, setReminders, setSearchQuery, setTotal, setTotalPages } from "@/store/slice/reminderSlice";
import { getReminder } from "@/lib/api";
import Pagination from "@/components/tables/Pagination";
import StudentCard from "@/components/common/StudentCard";
import Search from "@/components/form/input/Search";

export default function Reminder() {
  const dispatch = useDispatch();

  const { reminders, currentPage, total, totalPages } = useSelector((state: RootState) => state.reminder);

  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  
  const [loading, setLoading] = useState(true);

  // 3. Debounce effect to update searchQuery only after user stops typing for 500ms
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  // Debounce effect: update searchQuery 1 second after user stops typing
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchQuery(searchInput);
      setCurrentPage(1); // reset page when search changes
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchInput]);

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const token = sessionStorage.getItem("token");

        if (!token) return;

        const response = await getReminder({
          token,
          page: currentPage,
          limit: 5,
          search: searchQuery
        });

        console.log("REMINDERS:", response);

        dispatch(setReminders(response.data));
        dispatch(setTotal(response.total));
        dispatch(setTotalPages(response.totalPages));
        dispatch(setCurrentPage(response.page));

      } catch (error) {
        console.error("Reminder fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReminders();
  }, [currentPage, searchQuery]);

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
  };

  const handlePagination = (page: number) => {
    if (page < 1 || page > totalPages) return;
    dispatch(setCurrentPage(page));
  };

  if (loading) return <div>Loading reminders...</div>;

  return (
    <div>
      <div className="space-y-6">
        <StudentCard title="Reminder Lists">
        <Search
            value={searchInput}
            onChange={handleSearchChange}
            onSubmit={handleSearchSubmit}
          />
          
      <div className="flex-1">
      <h1 className="text-xl font-bold mb-4">Reminders</h1>

      {reminders.length === 0 ? (
        <p>No reminders found</p>
      ) : (
        <ul className="space-y-3">
          {reminders.map((reminder: any) => (
            <li
              key={reminder.id}
              className="p-4 border rounded-lg shadow-sm"
            >
              <h2 className="font-semibold">{reminder.title}</h2>
              <p>{reminder.description}</p>
              <p className="text-sm text-gray-500">
                {reminder.reminderDate}
              </p>
            </li>
          ))}
        </ul>
      )}
      </div>
      <div className="mt-6">
      
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePagination}></Pagination>
    </div>
    </StudentCard>
    </div>
    </div>
  );
}