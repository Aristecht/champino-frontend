"use client";

import Link from "next/link";
import {
  ShoppingCart,
  Sun,
  Moon,
  LogIn,
  LogOut,
  Truck,
  Info,
  LayoutGrid,
  Newspaper,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { authStore } from "@/store/auth/auth.store";
import { cartStore } from "@/store/cart/cart.store";
import { useRouter } from "next/navigation";
import { useLogoutUserMutation } from "@/generated/output";
import { toast } from "sonner";
import { NotificationsPanel } from "@/components/features/notifications/NotificationsPanel";
import Image from "next/image";

function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { theme, setTheme } = useTheme();
  const t = useTranslations("navbar");
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  if (!mounted)
    return compact ? (
      <div className="h-9 w-full" />
    ) : (
      <div className="h-8 w-8" />
    );

  const isDark = theme === "dark";

  if (compact) {
    return (
      <button
        onClick={() => setTheme(isDark ? "light" : "dark")}
        aria-label={t("toggleTheme")}
        className="text-muted-foreground hover:text-foreground hover:bg-accent flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
      >
        {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        {t("toggleTheme")}
      </button>
    );
  }

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={t("toggleTheme")}
      className="text-muted-foreground hover:text-foreground hover:bg-accent flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}

interface NavbarProps {
  mobileSlot?: React.ReactNode;
}

export function Navbar({ mobileSlot }: NavbarProps = {}) {
  const tc = useTranslations("common");
  const t = useTranslations("navbar");
  const isAuthenticated = authStore((s) => s.isAuthenticated);
  const cartCount = cartStore((s) =>
    s.items.reduce((sum, item) => sum + item.quantity, 0)
  );
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

  const navLinks = [
    { label: tc("home"), href: "/", icon: Truck },
    { label: t("catalog"), href: "/catalog?root=1", icon: LayoutGrid },
    { label: t("news"), href: "/news", icon: Newspaper },
    { label: t("about"), href: "/about", icon: Info },
    { label: t("delivery"), href: "/delivery", icon: Truck },
  ];

  return (
    <header className="border-border bg-background/95 sticky top-0 z-50 border-b backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-primary flex shrink-0 items-center gap-2 font-bold sm:gap-3"
        >
          <Image
            src="/images/logotype.png"
            alt="logo"
            width={40}
            height={40}
            className="shrink-0"
          />
          <span className="text-sm font-extrabold tracking-wide">
            {tc("shopName")}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg px-3 py-2 text-sm font-medium transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1 md:gap-1.5">
          <Link
            href="/cart"
            aria-label={t("cart")}
            className="text-muted-foreground hover:text-foreground hover:bg-accent relative flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
          >
            <ShoppingCart className="h-4 w-4" />
            {cartCount > 0 && (
              <span className="bg-primary text-primary-foreground absolute -top-1 -right-2 min-w-4 rounded-full px-1 text-center text-[10px] leading-4 font-semibold">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>

          <NotificationsPanel />

          <div className="mr-0 hidden md:mr-2 md:flex">
            <ThemeToggle />
          </div>

          {isAuthenticated ? (
            <button
              onClick={() => logout()}
              className="text-muted-foreground hover:text-foreground hover:bg-accent hidden h-8 items-center gap-1.5 rounded-lg px-3 text-sm font-medium transition-colors md:flex"
            >
              <LogOut className="h-4 w-4" />
              {t("signOut")}
            </button>
          ) : (
            <Link
              href="/account/login"
              className="bg-primary text-primary-foreground hover:bg-primary/90 hidden h-8 items-center gap-1.5 rounded-lg px-3 text-sm font-medium transition-colors md:flex"
            >
              <LogIn className="h-4 w-4" />
              {t("signIn")}
            </Link>
          )}

          {/* Optional slot (e.g. SidebarTrigger in admin) */}
          {mobileSlot && <div className="md:hidden">{mobileSlot}</div>}
        </div>
      </div>
    </header>
  );
}
