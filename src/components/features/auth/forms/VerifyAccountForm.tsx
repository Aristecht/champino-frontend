"use client";

import { useVerifyAccountMutation } from "@/generated/output";
import { useApolloClient } from "@apollo/client/react";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { AuthWrapper } from "../AuthWrapper";
import { Spinner } from "@/components/common/ui/Spinner";
import { authStore } from "@/store/auth/auth.store";

export function VerifyAccountForm() {
  const t = useTranslations("auth.verify");

  const client = useApolloClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token") ?? "";

  const [verify] = useVerifyAccountMutation({
    async onCompleted(data) {
      const currentUser = authStore.getState().user;

      if (currentUser) {
        authStore.getState().setUser({
          ...currentUser,
          email: data.verifyAccount.email,
          username: data.verifyAccount.username,
        });
      }

      await client.refetchQueries({
        include: ["FindAuthProfile", "FindProfile"],
      });

      toast.success(t("successToast"));
      router.push("/");
    },
    onError() {
      toast.error(t("errorToast"));
    },
  });

  useEffect(() => {
    if (!token) return;

    verify({
      variables: {
        data: { token },
      },
    });
  }, [token, verify]);

  return (
    <AuthWrapper heading={t("heading")}>
      <div className="flex flex-col items-center gap-6 py-2">
        <Spinner variant={"primary"} size={"2xl"} />
        <p className="text-muted-foreground mt-2">{t("waiting")}</p>
      </div>
    </AuthWrapper>
  );
}
