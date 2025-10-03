"use client";
import AdminDashboard from "@/component/adminDashboard";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminDashboard>{children}</AdminDashboard>;
}