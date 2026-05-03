"use client";

import { authStore } from "@/store/auth/auth.store";
import { useRouter } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";
import { Spinner } from "@/components/common/ui/Spinner";
import { ShieldAlert } from "lucide-react";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const isAuthenticated = authStore((s) => s.isAuthenticated);
  const user = authStore((s) => s.user);
  const router = useRouter();

  // React 19 / compiler-safe mount detection — no setState in effect
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  useEffect(() => {
    if (!mounted) return;
    if (!isAuthenticated) {
      router.replace("/");
    }
  }, [mounted, isAuthenticated, router]);

  if (!mounted) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner size="xl" variant="primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner size="xl" variant="primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner size="xl" variant="primary" />
      </div>
    );
  }

  if (user.role !== "ADMIN" && user.role !== "MANAGER") {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <div className="bg-destructive/10 flex h-16 w-16 items-center justify-center rounded-2xl">
          <ShieldAlert className="text-destructive h-8 w-8" />
        </div>
        <p className="text-foreground text-lg font-semibold">Доступ запрещён</p>
        <p className="text-muted-foreground text-sm">
          У вас нет прав для просмотра этой страницы.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
