import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/common/ui/Sidebar";
import { AdminSidebar } from "@/components/elements/AdminSidebar";
import { AdminGuard } from "@/components/common/AdminGuard";
import { Navbar } from "@/components/elements/Navbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <SidebarProvider>
        <AdminSidebar />
        <SidebarInset>
          <Navbar mobileSlot={<SidebarTrigger tooltip="Меню" />} />
          <main className="flex-1">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </AdminGuard>
  );
}
