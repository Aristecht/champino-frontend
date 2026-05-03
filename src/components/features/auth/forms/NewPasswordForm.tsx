"use client";

import { useNewPasswordMutation } from "@/generated/output";
import {
  newPasswordSchema,
  TypeNewPasswordSchema,
} from "@/schemas/auth/new-password.schema";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { AuthWrapper } from "../AuthWrapper";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/common/ui/Form";
import { Button } from "@/components/common/ui/Button";
import { Input } from "@/components/common/ui/Input";

export function NewPasswordForm() {
  const t = useTranslations("auth.newPassword");
  const tValidation = useTranslations("auth.newPassword.validation");

  const router = useRouter();
  const params = useParams<{ token: string }>();

  const form = useForm<TypeNewPasswordSchema>({
    resolver: zodResolver(newPasswordSchema(tValidation)),
    defaultValues: {
      password: "",
      passwordRepeat: "",
    },
  });

  const [newPassword, { loading: isLoadingNewPassword }] =
    useNewPasswordMutation({
      onCompleted() {
        toast.success(t("toastSuccess"));
        router.push("/account/login");
      },
      onError() {
        toast.error(t("toastError"));
      },
    });

  function onSubmit(data: TypeNewPasswordSchema) {
    newPassword({ variables: { data: { ...data, token: params.token } } });
  }
  return (
    <AuthWrapper
      heading={t("heading")}
      backButtonLabel={t("backButtonLabel")}
      backButtonHref="/account/create"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-y-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>{t("passwordLabel")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("passwordPlaceholder")}
                    error={!!fieldState.error}
                    type="password"
                    disabled={isLoadingNewPassword}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="passwordRepeat"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>{t("passwordRepeatLabel")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("passwordRepeat")}
                    error={!!fieldState.error}
                    type="password"
                    disabled={isLoadingNewPassword}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            variant={"default"}
            className="my-1"
            disabled={isLoadingNewPassword}
          >
            {t("submit")}
          </Button>
        </form>
      </Form>
    </AuthWrapper>
  );
}
