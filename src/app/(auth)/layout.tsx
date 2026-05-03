import { Navbar } from "@/components/elements/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Navbar />
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  );
}
