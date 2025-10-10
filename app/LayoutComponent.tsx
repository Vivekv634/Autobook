"use client";
import { store } from "@/redux/store";
import { Provider } from "react-redux";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";

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
      <Toaster richColors={true} position="bottom-right" />
    </Provider>
  );
}
