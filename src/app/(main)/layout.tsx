import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/common/ui/Sidebar";
import { AppSidebar } from "@/components/elements/AppSidebar";
import { Footer } from "@/components/elements/Footer";
import { Navbar } from "@/components/elements/Navbar";

import { getTranslations } from "next-intl/server";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = await getTranslations("sidebar");
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Navbar mobileSlot={<SidebarTrigger tooltip={t("sidebar")} />} />
        <main className="flex-1">{children}</main>
        <Footer />
      </SidebarInset>
    </SidebarProvider>
  );
}
