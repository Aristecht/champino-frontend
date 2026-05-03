import type { Metadata } from "next";
import { SettingsPageClient } from "@/components/features/settings/SettingsPageClient";

export const metadata: Metadata = {
  title: "Настройки аккаунта",
  description:
    "Управляйте своим аккаунтом в ЧАМПИНО ZOO: личные данные, смена пароля и email, настройки уведомлений.",
  robots: { index: false, follow: false },
};

export default function SettingsPage() {
  return <SettingsPageClient />;
}
