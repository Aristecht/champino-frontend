import { LoginAccountForm } from "@/components/features/auth/forms/LoginAccountForm";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("auth.loginAccount");
  return { title: t("pageTitle") };
}

export default function LoginAccountPage() {
  return <LoginAccountForm />;
}
