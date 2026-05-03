"use client";
import Image from "next/image";
import { toast } from "sonner";
import {
  useGenerateTotpSecretLazyQuery,
  useEnableTotpMutation,
  useDisableTotpMutation,
} from "@/generated/output";
import { Button } from "@/components/common/ui/Button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/common/ui/InputOTP";
import { useTranslations } from "next-intl";
import { useState } from "react";

interface TwoFactorSetupProps {
  isTotpEnabled: boolean;
  onStatusChange?: (enabled: boolean) => void;
}

export function TwoFactorSetup({
  isTotpEnabled,
  onStatusChange,
}: TwoFactorSetupProps) {
  const t = useTranslations("auth.twoFactor");

  const [step, setStep] = useState<"idle" | "scan" | "verify">("idle");
  const [pin, setPin] = useState("");

  const [generateSecret, { loading: isGenerating, data: totpData }] =
    useGenerateTotpSecretLazyQuery({ fetchPolicy: "no-cache" });

  const secret = totpData?.generateTotpSecret.secret ?? "";
  const qrcodeUrl = totpData?.generateTotpSecret.qrcodeUrl ?? "";

  const [enableTotp, { loading: isEnabling }] = useEnableTotpMutation({
    onCompleted() {
      toast.success(t("enableSuccess"));
      setStep("idle");
      setPin("");
      onStatusChange?.(true);
    },
    onError() {
      toast.error(t("enableError"));
      setPin("");
    },
  });

  const [disableTotp, { loading: isDisabling }] = useDisableTotpMutation({
    onCompleted() {
      toast.success(t("disableSuccess"));
      onStatusChange?.(false);
    },
    onError() {
      toast.error(t("disableError"));
    },
  });

  async function handleEnable() {
    const result = await generateSecret();
    if (result.data) {
      setStep("scan");
    } else {
      toast.error(t("generateError"));
    }
  }

  function handleConfirmCode() {
    if (pin.length !== 6) return;
    enableTotp({ variables: { data: { pin, secret } } });
  }

  function handleDisable() {
    disableTotp();
  }

  if (isTotpEnabled) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-muted-foreground text-sm">
          {t("enabledDescription")}
        </p>
        <Button
          variant="destructive"
          onClick={handleDisable}
          disabled={isDisabling}
        >
          {t("disableButton")}
        </Button>
      </div>
    );
  }

  if (step === "idle") {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-muted-foreground text-sm">{t("idleDescription")}</p>
        <Button onClick={handleEnable} disabled={isGenerating}>
          {t("enableButton")}
        </Button>
      </div>
    );
  }

  if (step === "scan") {
    return (
      <div className="flex flex-col items-center gap-4">
        <p className="text-muted-foreground text-center text-sm">
          {t("scanDescription")}
        </p>
        {qrcodeUrl && (
          <div className="rounded-xl border bg-white p-3">
            <Image
              src={qrcodeUrl}
              alt="QR code"
              width={192}
              height={192}
              unoptimized
            />
          </div>
        )}
        <div className="bg-muted w-full rounded-lg p-3 text-center">
          <p className="text-muted-foreground mb-1 text-xs">
            {t("manualCode")}
          </p>
          <code className="font-mono text-sm font-semibold tracking-widest break-all">
            {secret}
          </code>
        </div>
        <Button className="w-full" onClick={() => setStep("verify")}>
          {t("scannedButton")}
        </Button>
        <Button
          variant="ghost"
          className="w-full"
          onClick={() => setStep("idle")}
        >
          {t("cancelButton")}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-muted-foreground text-center text-sm">
        {t("verifyDescription")}
      </p>
      <InputOTP maxLength={6} value={pin} onChange={setPin}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
      <Button
        className="w-full"
        onClick={handleConfirmCode}
        disabled={pin.length !== 6 || isEnabling}
      >
        {t("confirmButton")}
      </Button>
      <Button
        variant="ghost"
        className="w-full"
        onClick={() => setStep("scan")}
      >
        {t("backButton")}
      </Button>
    </div>
  );
}
