// components/ui/alert.tsx
import { cn } from "@/utils/tw-merge";
import { cva, type VariantProps } from "class-variance-authority";
import { ComponentProps } from "react";

const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm transition-all duration-200 [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-8",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground border-border shadow-soft",

        info: "bg-blue-50 text-blue-900 border-blue-200 dark:bg-blue-950/50 dark:text-blue-100 dark:border-blue-900/50 [&>svg]:text-blue-600 dark:[&>svg]:text-blue-400",

        success:
          "bg-green-50 text-green-900 border-green-200 dark:bg-green-950/50 dark:text-green-100 dark:border-green-900/50 [&>svg]:text-green-600 dark:[&>svg]:text-green-400",

        warning:
          "bg-orange-50 text-orange-900 border-orange-200 dark:bg-orange-950/50 dark:text-orange-100 dark:border-orange-900/50 [&>svg]:text-primary dark:[&>svg]:text-primary",

        destructive:
          "bg-red-50 text-red-900 border-red-200 dark:bg-red-950/50 dark:text-red-100 dark:border-red-900/50 [&>svg]:text-destructive dark:[&>svg]:text-destructive",

        orange:
          "bg-linear-to-r from-primary/10 to-accent/10 text-foreground border-primary/30 dark:from-primary/20 dark:to-accent/20 dark:border-primary/40 [&>svg]:text-primary",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface AlertProps
  extends ComponentProps<"div">, VariantProps<typeof alertVariants> {}

function Alert({ className, variant, ...props }: AlertProps) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  );
}

function AlertTitle({ className, ...props }: ComponentProps<"h5">) {
  return (
    <h5
      data-slot="alert-title"
      className={cn(
        "mb-1 leading-none font-semibold tracking-tight",
        className
      )}
      {...props}
    />
  );
}

function AlertDescription({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn("text-sm leading-relaxed [&_p]:leading-relaxed", className)}
      {...props}
    />
  );
}

function AlertAction({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-action"
      className={cn("absolute top-3 right-3", className)}
      {...props}
    />
  );
}

export { Alert, AlertTitle, AlertDescription, AlertAction, alertVariants };
