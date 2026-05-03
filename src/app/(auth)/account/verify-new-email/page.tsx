import { VerifyNewEmailForm } from "../../../../components/features/auth/forms/VerifyNewEmailForm";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("auth.verify");
  return { title: t("pageTitle") };
}

export default async function VerifyNewEmailPage(props: {
  searchParams: Promise<{ token: string }>;
}) {
  const searchParams = await props.searchParams;

  if (!searchParams.token) {
    return redirect("/account/create");
  }

  return <VerifyNewEmailForm />;
}
