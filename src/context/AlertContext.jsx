"use client";

import Alert from "@/components/shared/Alert";
import { createContext, useContext, useState } from "react";

const AlertContext = createContext(null);

export function AlertProvider({ children }) {
  const [alert, setAlert] = useState({
    type: "info",
    message: "",
  });

  const showAlert = (type, message, duration = 3000) => {
    setAlert({ type, message });

    setTimeout(() => {
      setAlert({ type: "", message: "" });
    }, duration);
  };

  const closeAlert = () => {
    setAlert({ type: "", message: "" });
  };

  return (
    <AlertContext.Provider value={{ showAlert, closeAlert }}>
      {children}

      <Alert
        type={alert.type}
        message={alert.message}
        autoClose
        onClose={closeAlert}
      />
    </AlertContext.Provider>
  );
}

export const useAlert = () => useContext(AlertContext);
