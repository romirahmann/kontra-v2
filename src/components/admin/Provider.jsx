"use client";

import { AlertProvider } from "@/context/AlertContext";
import { ConfirmProvider } from "@/context/ConfirmContext";
import { UserProvider } from "@/context/UserContext";

export default function Providers({ children }) {
  return (
    <ConfirmProvider>
      <AlertProvider>
        <UserProvider>{children}</UserProvider>
      </AlertProvider>
    </ConfirmProvider>
  );
}
