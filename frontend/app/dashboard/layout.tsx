import { Sidebar } from "@/components/dashboard/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex relative">
      <div className="stripe-mesh" />
      <Sidebar />
      <main className="min-h-screen flex-1 overflow-y-auto p-8 relative z-10">{children}</main>
    </div>
  );
}
