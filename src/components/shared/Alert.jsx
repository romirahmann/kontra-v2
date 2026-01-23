"use client";

import { useEffect } from "react";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaInfoCircle,
} from "react-icons/fa";

const icons = {
  success: <FaCheckCircle className="w-5 h-5" />,
  error: <FaTimesCircle className="w-5 h-5" />,
  warning: <FaExclamationTriangle className="w-5 h-5" />,
  info: <FaInfoCircle className="w-5 h-5" />,
};

const styles = {
  success: "bg-green-900/90 border-green-600 text-green-300",
  error: "bg-red-900/90 border-red-600 text-red-300",
  warning: "bg-yellow-900/90 border-yellow-600 text-yellow-300",
  info: "bg-blue-900/90 border-blue-600 text-blue-300",
};

export default function Alert({
  type = "info",
  message,
  onClose,
  autoClose = false,
  duration = 3000,
}) {
  useEffect(() => {
    if (!autoClose || !message) return;

    const timer = setTimeout(() => {
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [message, autoClose, duration]); // 🔥 FIX

  if (!message) return null;

  return (
    <div className="fixed top-5 left-1/2 z-[9999] -translate-x-1/2 w-full max-w-md px-4">
      <div
        className={`flex items-start gap-3 border rounded-xl p-4 text-sm shadow-lg ${styles[type]}`}
      >
        <div className="mt-0.5">{icons[type]}</div>

        <div className="flex-1">{message}</div>

        {onClose && (
          <button
            onClick={onClose}
            className="text-current opacity-70 hover:opacity-100"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
