import { ReactNode } from "react";
import AuthLayout from "./AuthLayout";

export default function Layout({ children }: { children: ReactNode }) {
  return <AuthLayout>{children}</AuthLayout>;
}
