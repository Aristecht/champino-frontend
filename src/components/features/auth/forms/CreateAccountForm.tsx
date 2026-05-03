"use client";

import { useForm } from "react-hook-form";
import { AuthWrapper } from "../AuthWrapper";
import {
  createAccountSchema,
  TypeCreateAccountSchema,
} from "@/schemas/auth/create-account.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/common/ui/Form";
import { Input } from "@/components/common/ui/Input";
import { Button } from "@/components/common/ui/Button";
import { useCreateUserMutation } from "@/generated/output";
import { toast } from "sonner";
import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/common/ui/Alert";
import { MailCheck } from "lucide-react";

export function CreateAccountForm() {
  const t = useTranslations("auth.createAccount");
  const tValidation = useTranslations("auth.createAccount.validation");
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<TypeCreateAccountSchema>({
    resolver: zodResolver(createAccountSchema(tValidation)),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  // const { isValid } = form.formState;

  const [create, { loading: isLoadingCreate }] = useCreateUserMutation({
    onCompleted() {
      setIsSuccess(true);
    },
    onError() {
      toast.error(t("errorToast"));
    },
  });

  function onSubmit(data: TypeCreateAccountSchema) {
    create({ variables: { data } });
  }

  return (
    <AuthWrapper
      heading={t("heading")}
      backButtonLabel={t("backButtonLabel")}
      backButtonHref="/account/login"
    >
      {isSuccess ? (
        <Alert variant="success">
          <MailCheck className="size-5" />
          <AlertTitle>{t("successTitle")}</AlertTitle>
          <AlertDescription>{t("successDescription")}</AlertDescription>
        </Alert>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>{t("username")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("usernamePlaceholder")}
                      error={!!fieldState.error}
                      disabled={isLoadingCreate}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>{t("email")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("emailPlaceholder")}
                      error={!!fieldState.error}
                      disabled={isLoadingCreate}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>{t("password")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("passwordPlaceholder")}
                      type="password"
                      error={!!fieldState.error}
                      disabled={isLoadingCreate}
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
              disabled={isLoadingCreate}
            >
              {t("submit")}
            </Button>

            <div className="relative my-1 flex items-center">
              <div className="border-border flex-1 border-t" />
              <span className="text-muted-foreground mx-3 text-xs">
                {t("orContinueWith")}
              </span>
              <div className="border-border flex-1 border-t" />
            </div>

            <Button
              type="button"
              variant={"outline"}
              className="w-full"
              disabled={isLoadingCreate}
              onClick={() => {
                window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/oauth/google`;
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="size-4"
                aria-hidden="true"
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              {t("googleSignIn")}
            </Button>
          </form>
        </Form>
      )}
    </AuthWrapper>
  );
}
