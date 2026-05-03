import { CreateAccountForm } from "@/components/features/auth/forms/CreateAccountForm";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("auth.createAccount");
  return { title: t("pageTitle") };
}

export default function CreateAccountPage() {
  return <CreateAccountForm />;
}
