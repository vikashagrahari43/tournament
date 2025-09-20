"use client";
import Dashboard from "@/component/Dashboard";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Dashboard>{children}</Dashboard>;
}