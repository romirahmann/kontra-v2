"use client";

import ConfirmModal from "@/components/shared/ConfirmModal";
import { createContext, useContext, useState } from "react";

const ConfirmContext = createContext(null);

export function ConfirmProvider({ children }) {
  const [state, setState] = useState(null);

  const confirm = (options) =>
    new Promise((resolve) => {
      setState({
        ...options,
        onConfirm: () => {
          resolve(true);
          setState(null);
        },
        onClose: () => {
          resolve(false);
          setState(null);
        },
      });
    });

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <ConfirmModal open={!!state} {...state} />
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) {
    throw new Error("useConfirm must be used inside ConfirmProvider");
  }
  return ctx;
}
