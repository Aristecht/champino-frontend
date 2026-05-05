"use client";

import Link from "next/link";
import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import { useResendVerificationEmailMutation } from "@/generated/output";
import { Bell, KeyRound, MailCheck, ShieldCheck, User2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/common/ui/Button";
import { Input } from "@/components/common/ui/Input";
import { Switcher } from "@/components/common/ui/Switcher";
import { TwoFactorSetup } from "@/components/features/auth/TwoFactorSetup";
import { authStore } from "@/store/auth/auth.store";
import {
  PushPermissionDeniedError,
  usePushNotifications,
} from "@/hooks/usePushNotifications";

type SettingsProfileResult = {
  findProfile: {
    id: string;
    username: string;
    isEmailVerified: boolean;
    isTotpEnabled: boolean;
    createdAt: string;
    notificationsSettings?: {
      siteNotifications: boolean;
      pushNotifications: boolean;
    } | null;
  };
};

const SETTINGS_PROFILE_QUERY = gql`
  query SettingsProfile {
    findProfile {
      id
      username
      email
      isEmailVerified
      isTotpEnabled
      createdAt
      notificationsSettings {
        siteNotifications
        pushNotifications
      }
    }
  }
`;

const CHANGE_PASSWORD_MUTATION = gql`
  mutation ChangePasswordSettings($data: ChangePasswordInput!) {
    changePassword(data: $data)
  }
`;

const CHANGE_NOTIFICATION_SETTINGS_MUTATION = gql`
  mutation ChangeNotificationSettingsSettings(
    $data: ChangeNotificationsSettingsInput!
  ) {
    changeNotificationSettings(data: $data) {
      notificationSettings {
        siteNotifications
        pushNotifications
      }
    }
  }
`;

function SettingsCard({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof User2;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-card border-border rounded-2xl border p-4 sm:p-5">
      <div className="mb-4 flex items-center gap-3">
        <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-xl">
          <Icon className="h-4 w-4" />
        </div>
        <h2 className="text-base font-semibold">{title}</h2>
      </div>
      {children}
    </section>
  );
}

export function SettingsPageClient() {
  const t = useTranslations("settings");
  const isAuthenticated = authStore((s) => s.isAuthenticated);
  const { data, loading, refetch } = useQuery<SettingsProfileResult>(
    SETTINGS_PROFILE_QUERY,
    {
      fetchPolicy: "cache-and-network",
      errorPolicy: "all",
    }
  );
  const [changePassword, { loading: isSavingPassword }] = useMutation(
    CHANGE_PASSWORD_MUTATION
  );
  const [resendVerification, { loading: isResendingVerification }] =
    useResendVerificationEmailMutation({
      onCompleted() {
        toast.success(t("verificationEmailSent"));
      },
      onError() {
        toast.error(t("verificationEmailError"));
      },
    });
  const [changeNotificationSettings, { loading: isSavingNotifications }] =
    useMutation(CHANGE_NOTIFICATION_SETTINGS_MUTATION);
  const { subscribe, unsubscribe, isSupported, currentPermission } =
    usePushNotifications();

  const profile = data?.findProfile;
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const siteNotifications =
    profile?.notificationsSettings?.siteNotifications ?? false;
  const pushNotifications =
    profile?.notificationsSettings?.pushNotifications ?? false;

  if (loading && !profile) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="bg-card border-border h-40 animate-pulse rounded-2xl border" />
      </div>
    );
  }

  if (!profile) {
    if (isAuthenticated) {
      return (
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="bg-card border-border rounded-2xl border p-6 text-center">
            <h1 className="mb-2 text-xl font-semibold">{t("title")}</h1>
            <p className="text-muted-foreground mb-4 text-sm">
              {t("loadingProfile")}
            </p>
            <Button size="sm" onClick={() => refetch()}>
              {t("tryAgain")}
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-card border-border rounded-2xl border p-6 text-center">
          <h1 className="mb-2 text-xl font-semibold">{t("loginRequired")}</h1>
          <Link
            href="/account/login"
            className="text-primary text-sm font-medium"
          >
            {t("openLogin")}
          </Link>
        </div>
      </div>
    );
  }

  const savePassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await changePassword({
        variables: { data: { oldPassword, newPassword } },
      });
      setOldPassword("");
      setNewPassword("");
      toast.success(t("passwordSaved"));
    } catch (error) {
      const message = error instanceof Error ? error.message.toLowerCase() : "";
      if (
        message.includes("old password") ||
        message.includes("incorrect") ||
        message.includes("invalid")
      ) {
        toast.error(t("passwordSaveError"));
      } else {
        toast.error(t("passwordWrong"));
      }
    }
  };

  const saveNotifications = async (nextSite: boolean, nextPush: boolean) => {
    try {
      await changeNotificationSettings({
        variables: {
          data: {
            siteNotifications: nextSite,
            pushNotifications: nextPush,
          },
        },
      });
      toast.success(t("notificationsSaved"));
      await refetch();
    } catch {
      toast.error(t("notificationsSaveError"));
    }
  };

  const toggleSiteNotifications = async () => {
    await saveNotifications(!siteNotifications, pushNotifications);
  };

  const togglePushNotifications = async () => {
    const nextValue = !pushNotifications;

    if (nextValue) {
      if (!isSupported) {
        toast.error(t("pushUnsupported"));
        return;
      }

      try {
        await subscribe();
      } catch (error) {
        if (error instanceof PushPermissionDeniedError) {
          toast.error(t("pushPermissionDenied"));
        } else if (
          error instanceof Error &&
          error.message.includes("VAPID key not configured")
        ) {
          toast.error("VAPID ключ не настроен в продакшене");
        } else {
          toast.error(t("pushError"));
        }
        return;
      }
    } else {
      await unsubscribe();
    }

    await saveNotifications(siteNotifications, nextValue);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold sm:text-3xl">{t("title")}</h1>
        <p className="text-muted-foreground mt-2 text-sm">{t("subtitle")}</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SettingsCard icon={User2} title={t("profileTitle")}>
          <div className="space-y-3">
            <div>
              <p className="text-muted-foreground mb-1 text-xs">
                {t("nameLabel")}
              </p>
              <Input value={profile.username} readOnly />
            </div>
            <div className="text-muted-foreground flex flex-wrap items-center justify-between gap-3 text-xs">
              <span>
                {profile.isEmailVerified
                  ? t("emailVerified")
                  : t("emailNotVerified")}
              </span>
              <span>
                {t("memberSince")}:{" "}
                {new Date(profile.createdAt).toLocaleDateString()}
              </span>
            </div>
            {!profile.isEmailVerified && (
              <Button
                size="sm"
                variant="outline"
                className="mt-1 w-full gap-2"
                disabled={isResendingVerification}
                onClick={() => resendVerification()}
              >
                <MailCheck className="h-4 w-4" />
                {t("verifyEmail")}
              </Button>
            )}
          </div>
        </SettingsCard>

        <SettingsCard icon={KeyRound} title={t("passwordTitle")}>
          <form onSubmit={savePassword} className="space-y-3">
            <Input
              type="password"
              placeholder={t("oldPassword")}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <Input
              type="password"
              placeholder={t("newPassword")}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <Button
              type="submit"
              size="sm"
              disabled={isSavingPassword || !newPassword}
            >
              {t("savePassword")}
            </Button>
          </form>
        </SettingsCard>

        <SettingsCard icon={Bell} title={t("notificationsTitle")}>
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3 rounded-xl border p-3">
              <div>
                <p className="text-sm font-medium">{t("siteNotifications")}</p>
                <p className="text-muted-foreground text-xs">
                  {t("siteNotificationsDesc")}
                </p>
              </div>
              <Switcher
                isActive={siteNotifications}
                setIsActive={toggleSiteNotifications as never}
              />
            </div>
            <div className="flex items-center justify-between gap-3 rounded-xl border p-3">
              <div>
                <p className="text-sm font-medium">{t("pushNotifications")}</p>
                <p className="text-muted-foreground text-xs">
                  {currentPermission === "denied"
                    ? t("pushPermissionDenied")
                    : t("pushNotificationsDesc")}
                </p>
              </div>
              <Switcher
                isActive={pushNotifications}
                setIsActive={togglePushNotifications as never}
              />
            </div>
            {isSavingNotifications && (
              <p className="text-muted-foreground text-xs">{t("saving")}</p>
            )}
          </div>
        </SettingsCard>

        <SettingsCard icon={ShieldCheck} title={t("twoFactorTitle")}>
          <TwoFactorSetup
            isTotpEnabled={profile.isTotpEnabled}
            onStatusChange={() => refetch()}
          />
        </SettingsCard>
      </div>
    </div>
  );
}
