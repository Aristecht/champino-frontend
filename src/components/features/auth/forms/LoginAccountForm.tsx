"use client";

import { useForm } from "react-hook-form";
import { AuthWrapper } from "../AuthWrapper";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/common/ui/Form";
import { Input } from "@/components/common/ui/Input";
import { Button } from "@/components/common/ui/Button";
import { useLoginUserMutation } from "@/generated/output";
import { toast } from "sonner";
import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  loginAccountSchema,
  TypeLoginAccountSchema,
} from "@/schemas/auth/login-account.schema";
import { useRouter } from "next/navigation";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/common/ui/InputOTP";
import Link from "next/link";
import { authStore } from "@/store/auth/auth.store";
import { cartStore } from "@/store/cart/cart.store";

export function LoginAccountForm() {
  const t = useTranslations("auth.loginAccount");
  const tValidation = useTranslations("auth.loginAccount.validation");

  const [isShowTwoFactor, setIsShowTwoFactor] = useState(false);

  const router = useRouter();

  const form = useForm<TypeLoginAccountSchema>({
    resolver: zodResolver(loginAccountSchema(tValidation)),
    defaultValues: {
      login: "",
      password: "",
      pin: "",
    },
  });

  const [login, { loading: isLoadingLogin }] = useLoginUserMutation({
    onCompleted(data) {
      const user = data.loginUser.user;
      const twoFactorPending = !!(
        user?.isTotpEnabled && data.loginUser.message
      );

      if (user && !twoFactorPending) {
        authStore.getState().setIsAuthenticated(true);
        authStore.getState().setUser({
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        });
        cartStore.getState().restoreForUser(user.id);
      }

      if (data.loginUser.user?.isTotpEnabled && data.loginUser.message) {
        setIsShowTwoFactor(true);
      } else if (data.loginUser.message) {
        router.push("/");
        router.refresh();
        toast.info(data.loginUser.message);
      } else {
        router.push("/");
        router.refresh();
        toast.success(t("successToast"));
      }
    },
    refetchQueries: ["FindProfile"],
    onError() {
      toast.error(t("errorToast"));
    },
  });

  function onSubmit(data: TypeLoginAccountSchema) {
    login({ variables: { data } });
  }

  return (
    <AuthWrapper
      heading={t("heading")}
      backButtonLabel={t("backButtonLabel")}
      backButtonHref="/account/create"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-y-4">
          {isShowTwoFactor ? (
            <FormField
              control={form.control}
              name="pin"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className="mx-auto mb-4">
                    {t("pinLabel")}
                  </FormLabel>
                  <FormControl>
                    <InputOTP
                      maxLength={6}
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      disabled={isLoadingLogin}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot
                          index={0}
                          aria-invalid={!!fieldState.error}
                        />
                        <InputOTPSlot
                          index={1}
                          aria-invalid={!!fieldState.error}
                        />
                        <InputOTPSlot
                          index={2}
                          aria-invalid={!!fieldState.error}
                        />
                        <InputOTPSlot
                          index={3}
                          aria-invalid={!!fieldState.error}
                        />
                        <InputOTPSlot
                          index={4}
                          aria-invalid={!!fieldState.error}
                        />
                        <InputOTPSlot
                          index={5}
                          aria-invalid={!!fieldState.error}
                        />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormDescription className="mx-auto mt-2">
                    {t("pinDescription")}
                  </FormDescription>
                </FormItem>
              )}
            />
          ) : (
            <>
              <FormField
                control={form.control}
                name="login"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>{t("loginLabel")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("loginPlaceholder")}
                        error={!!fieldState.error}
                        disabled={isLoadingLogin}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>{t("loginDescription")}</FormDescription>
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
                        disabled={isLoadingLogin}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="link"
                  className="text-muted-foreground h-auto p-0 text-sm font-light"
                >
                  <Link href={"recovery"}>{t("forgotPassword")}</Link>
                </Button>
              </div>
            </>
          )}

          <Button
            variant={"default"}
            className="my-1"
            disabled={isLoadingLogin}
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
            disabled={isLoadingLogin}
            onClick={() => {
              const backendUrl =
                process.env.NEXT_PUBLIC_API_URL || "https://champino.org/api";
              window.location.href = `${backendUrl}/oauth/google`;
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
    </AuthWrapper>
  );
}
