"use client";
import React, { useEffect, useRef } from "react";
import Button from "../ui/button/Button";

interface ComponentCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  desc?: string;
  oncloseModal: () => void;
}

const ModalCard: React.FC<ComponentCardProps> = ({
  title,
  children,
  className = "",
  desc = "",
  oncloseModal,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Disable background scroll
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  // ✅ Close modal when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        oncloseModal();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [oncloseModal]);

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-gray-400/50 backdrop-blur-[32px]">
      {/* Modal card container */}
      <div
        ref={modalRef}
        className={`relative w-full max-w-3xl mx-auto rounded-2xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 ${className}`}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            {title}
          </h3>
          <button
            onClick={oncloseModal}
            className="text-gray-400 hover:text-gray-800 dark:hover:text-white text-xl font-bold"
          >
            &times;
          </button>
        </div>

        {/* Description */}
        {desc && (
          <div className="px-6 pt-2 text-sm text-gray-500 dark:text-gray-400">
            {desc}
          </div>
        )}

        {/* Body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">{children}</div>

        <div className="flex justify-between items-center px-6 py-4 border-t border-gray-100 dark:border-gray-700"></div>
      </div>
    </div>
  );
};

export default ModalCard;
