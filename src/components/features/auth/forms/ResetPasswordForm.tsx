"use client";

import { Button } from "@/components/common/ui/Button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/common/ui/Form";
import { useResetPasswordMutation } from "@/generated/output";

import {
  resetPasswordSchema,
  TypeResetPasswordSchema,
} from "@/schemas/auth/reset-password.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { AuthWrapper } from "../AuthWrapper";
import { Input } from "@/components/common/ui/Input";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/common/ui/Alert";
import { MailCheck } from "lucide-react";

export function ResetPasswordForm() {
  const t = useTranslations("auth.resetPassword");
  const tValidation = useTranslations("auth.resetPassword.validation");

  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<TypeResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema(tValidation)),
    defaultValues: {
      email: "",
    },
  });

  const [resetPassword, { loading: isLoadingReset }] = useResetPasswordMutation(
    {
      onCompleted() {
        setIsSuccess(true);
      },
      onError() {
        toast.error(t("toastError"));
      },
    }
  );

  function onSubmit(data: TypeResetPasswordSchema) {
    resetPassword({ variables: { data } });
  }
  return (
    <AuthWrapper
      heading={t("heading")}
      backButtonLabel={t("backButtonLabel")}
      backButtonHref="/account/create"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-y-4">
          {isSuccess ? (
            <Alert variant="success">
              <MailCheck className="size-5" />
              <AlertTitle>{t("successTitle")}</AlertTitle>
              <AlertDescription>{t("successDescription")}</AlertDescription>
            </Alert>
          ) : (
            <>
              <FormField
                control={form.control}
                name="email"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>{t("emailLabel")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("emailPlaceholder")}
                        error={!!fieldState.error}
                        disabled={isLoadingReset}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>{t("emailDescription")}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                variant={"default"}
                className="my-1"
                disabled={isLoadingReset}
              >
                {t("submit")}
              </Button>
            </>
          )}
        </form>
      </Form>
    </AuthWrapper>
  );
}
