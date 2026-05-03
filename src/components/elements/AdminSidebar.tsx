"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Box,
  ChevronLeft,
  FolderOpen,
  LayoutDashboard,
  MapPin,
  Undo2,
  ShoppingBag,
  Users,
  Newspaper,
} from "lucide-react";
import { useTranslations } from "next-intl";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/common/ui/Sidebar";
import Image from "next/image";

export function AdminSidebar() {
  const pathname = usePathname();
  const t = useTranslations("admin");

  const sections = [
    {
      label: t("overview"),
      items: [{ label: t("dashboard"), href: "/admin", icon: LayoutDashboard }],
    },
    {
      label: t("catalogSection"),
      items: [
        { label: t("products"), href: "/admin/products", icon: Box },
        { label: t("categories"), href: "/admin/categories", icon: FolderOpen },
      ],
    },
    {
      label: t("commerceSection"),
      items: [
        { label: t("orders"), href: "/admin/orders", icon: ShoppingBag },
        { label: t("returns"), href: "/admin/returns", icon: Undo2 },
        { label: t("branches"), href: "/admin/branches", icon: MapPin },
        { label: t("news"), href: "/admin/news", icon: Newspaper },
      ],
    },
    {
      label: t("analyticsSection"),
      items: [
        { label: t("analytics"), href: "/admin/analytics", icon: BarChart3 },
        { label: t("users"), href: "/admin/users", icon: Users },
      ],
    },
  ];

  const isActive = (href: string) =>
    href === "/admin"
      ? pathname === "/admin"
      : pathname === href || pathname.startsWith(href + "/");

  return (
    <Sidebar>
      <SidebarHeader>
        <Link
          href="/admin"
          className="text-primary flex items-center gap-3 px-2 py-3 font-bold"
        >
          <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
            <Image
              src="/images/logotype.png"
              alt="logo"
              width={50}
              height={50}
              className="shrink-0"
            />{" "}
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-foreground text-sm font-extrabold tracking-wide">
              ЧАМПИНО ZOO
            </span>
            <span className="text-muted-foreground mt-0.5 text-xs font-normal">
              Admin Panel
            </span>
          </div>
        </Link>
        <SidebarMenu className="mt-1">
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/">
                <ChevronLeft className="h-4 w-4" />
                <span>{t("backToShop")}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {sections.map((section) => (
          <SidebarGroup key={section.label}>
            <SidebarGroupLabel>{section.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={isActive(item.href)}>
                        <Link href={item.href}>
                          <Icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter />
    </Sidebar>
  );
}
