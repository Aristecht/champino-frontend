"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingCart,
  Newspaper,
  Home,
  LayoutDashboard,
  Store,
  Van,
  Package,
  Settings,
  Sun,
  Moon,
  LogOut,
  LogIn,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { toast } from "sonner";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/common/ui/Sidebar";
// import NextImage from "next/image";
import Image from "next/image";
import { useLogoutUserMutation } from "@/generated/output";
import { authStore } from "@/store/auth/auth.store";
import { cartStore } from "@/store/cart/cart.store";
import { cn } from "@/utils/tw-merge";

function ThemeSegment() {
  const ts = useTranslations("sidebar");
  const tn = useTranslations("navbar");
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  if (!mounted) return <div className="h-9 w-full" />;

  return (
    <div
      aria-label={tn("toggleTheme")}
      className="bg-sidebar-accent/50 border-sidebar-border relative flex h-9 w-full items-center rounded-xl border p-0.5"
    >
      <span
        className={cn(
          "bg-background border-sidebar-border absolute top-0.5 bottom-0.5 w-[calc(50%-2px)] rounded-[10px] border shadow-xs transition-all duration-200 ease-in-out",
          theme === "dark" ? "left-[calc(50%+1px)]" : "left-0.5"
        )}
      />
      <button
        onClick={() => setTheme("light")}
        className={cn(
          "relative z-10 flex flex-1 items-center justify-center gap-1.5 rounded-[10px] py-1.5 text-xs font-medium transition-colors duration-150",
          theme !== "dark"
            ? "text-foreground"
            : "text-sidebar-foreground/55 hover:text-sidebar-foreground"
        )}
      >
        <Sun className="h-3.5 w-3.5 shrink-0" />
        {ts("lightTheme")}
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={cn(
          "relative z-10 flex flex-1 items-center justify-center gap-1.5 rounded-[10px] py-1.5 text-xs font-medium transition-colors duration-150",
          theme === "dark"
            ? "text-foreground"
            : "text-sidebar-foreground/55 hover:text-sidebar-foreground"
        )}
      >
        <Moon className="h-3.5 w-3.5 shrink-0" />
        {ts("darkTheme")}
      </button>
    </div>
  );
}

export function AppSidebar() {
  const t = useTranslations("common");
  const tn = useTranslations("navbar");
  const ts = useTranslations("sidebar");
  const user = authStore((s) => s.user);
  const router = useRouter();

  const [logout] = useLogoutUserMutation({
    onCompleted() {
      const userId = authStore.getState().user?.id;
      if (userId) {
        cartStore.getState().saveForUser(userId);
      }
      cartStore.getState().clearCart();
      authStore.getState().setIsAuthenticated(false);
      authStore.getState().setUser(null);
      router.push("/account/login");
    },
    onError() {
      toast.error("Не удалось выйти из аккаунта");
    },
  });

  const isAdminOrManager = user?.role === "ADMIN" || user?.role === "MANAGER";

  const navItems = [
    { label: t("home"), href: "/", icon: Home },
    { label: t("catalog"), href: "/catalog?root=1", icon: ShoppingCart },
    { label: t("news"), href: "/news", icon: Newspaper },
    { label: t("about"), href: "/about", icon: Store },
    { label: t("delivery-payment"), href: "/delivery", icon: Van },
  ];

  return (
    <Sidebar>
      <SidebarHeader>
        <Link
          href="/"
          className="text-primary flex items-center gap-3 px-2 py-3 font-bold"
        >
          <Image
            src="/images/logotype.png"
            alt="logo"
            width={40}
            height={40}
            className="shrink-0"
          />{" "}
          <span className="font-extrabold tracking-wide">{t("shopName")}</span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{ts("menu")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild>
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

        <SidebarGroup>
          <SidebarGroupLabel>{ts("account")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {user && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/orders">
                      <Package className="h-4 w-4" />
                      <span>{t("myOrders")}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/settings">
                    <Settings className="h-4 w-4" />
                    <span>{t("account")}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <div className="flex md:hidden">
                {user ? (
                  <SidebarMenuItem>
                    <SidebarMenuButton onClick={() => logout()}>
                      <LogOut className="h-4 w-4" />
                      <span>{tn("signOut")}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ) : (
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/account/login">
                        <LogIn className="h-4 w-4" />
                        <span>{tn("signIn")}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
              </div>
              <SidebarMenuItem className="md:hidden">
                <div className="px-2 py-1">
                  <ThemeSegment />
                </div>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {isAdminOrManager && (
        <SidebarGroup>
          <SidebarGroupLabel>{t("administration")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/admin">
                    <LayoutDashboard className="h-4 w-4" />
                    <span>{t("admin-panel")}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      )}

      <SidebarFooter>
        <p className="text-muted-foreground px-2 pb-2 text-xs">
          © {new Date().getFullYear()} {t("shopName")}
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}
