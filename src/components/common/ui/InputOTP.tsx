"use client";

import { OTPInput, OTPInputContext } from "input-otp";
import { Dot } from "lucide-react";
import { cn } from "@/utils/tw-merge";
import { ComponentProps, useContext } from "react";

function InputOTP({
  className,
  containerClassName,
  ...props
}: ComponentProps<typeof OTPInput> & {
  containerClassName?: string;
}) {
  return (
    <OTPInput
      data-slot="input-otp"
      containerClassName={cn(
        "flex items-center gap-2 has-disabled:opacity-50",
        containerClassName
      )}
      spellCheck={false}
      className={cn("disabled:cursor-not-allowed", className)}
      {...props}
    />
  );
}

function InputOTPGroup({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-group"
      className={cn("mx-auto flex items-center", className)}
      {...props}
    />
  );
}

function InputOTPSlot({
  index,
  className,
  ...props
}: ComponentProps<"div"> & {
  index: number;
}) {
  const inputOTPContext = useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } =
    inputOTPContext?.slots?.[index] ?? {};

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      aria-invalid={props["aria-invalid"]}
      className={cn(
        "border-border bg-input relative flex size-12 items-center justify-center border-y border-r text-sm font-medium transition-all",
        "first:rounded-l-lg first:border-l last:rounded-r-lg",
        "focus-within:z-10",
        // Active state
        "data-[active=true]:border-primary data-[active=true]:ring-primary/20 data-[active=true]:ring-2",
        // Dark mode
        "dark:bg-input/30",
        // Error state
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20 aria-invalid:ring-2",
        "data-[active=true]:aria-invalid:border-destructive data-[active=true]:aria-invalid:ring-destructive/20",
        className
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="animate-caret-blink bg-foreground h-4 w-px duration-1000" />
        </div>
      )}
    </div>
  );
}

function InputOTPSeparator({ ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-separator"
      className="flex items-center justify-center"
      role="separator"
      {...props}
    >
      <Dot className="text-muted-foreground size-4" />
    </div>
  );
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };
