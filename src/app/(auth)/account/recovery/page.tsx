import { ResetPasswordForm } from "@/components/features/auth/forms/ResetPasswordForm";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("auth.resetPassword");
  return { title: t("pageTitle") };
}

export default function ResetAccountPage() {
  return <ResetPasswordForm />;
}
