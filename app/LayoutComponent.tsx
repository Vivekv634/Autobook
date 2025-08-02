"use client";
import { store } from "@/redux/store";
import { Provider } from "react-redux";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
// import * as serviceWorkerRegistration from "../lib/sw-register.js";

export default function LayoutComponent({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <ThemeProvider
        enableSystem={true}
        themes={["dark", "light"]}
        attribute="class"
      >
        {children}
      </ThemeProvider>
      <Toaster richColors={true} position="top-center" />
    </Provider>
  );
}

// serviceWorkerRegistration.register({
//   onSuccess: () => {
//     console.log("PWA installed successfully");
//   },
//   onUpdate: () => {
//     console.log("New version available");
//     // You can show a notification to user here
//   },
// });
