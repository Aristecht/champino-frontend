// components/ui/input.tsx
import { cn } from "@/utils/tw-merge";
import { ComponentProps, forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";

const inputVariants = cva(
  "flex w-full rounded-lg border bg-transparent px-3 py-2 text-sm transition-all duration-200 outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border-border/50 bg-input focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 hover:border-border/80 dark:bg-input/50 dark:focus-visible:ring-primary/30 ",

        filled:
          "border-transparent bg-muted focus-visible:bg-input focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 dark:bg-muted/50",

        outline:
          "border-2 border-border bg-transparent focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20",
      },
      inputSize: {
        sm: "h-8 px-2.5 text-xs rounded-md",
        default: "h-10 px-3 text-sm",
        lg: "h-12 px-4 text-base",
      },
      error: {
        true: "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20 dark:border-destructive/70",
      },
    },
    defaultVariants: {
      variant: "default",
      inputSize: "default",
      error: false,
    },
  }
);

export interface InputProps
  extends
    Omit<ComponentProps<"input">, "size">,
    VariantProps<typeof inputVariants> {}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, inputSize, error, type, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        data-slot="input"
        aria-invalid={error ?? undefined}
        className={cn(
          inputVariants({
            variant,
            inputSize,
            error,
          }),
          // File input стили
          "file:text-foreground file:border-0 file:bg-transparent file:text-sm file:font-medium",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input, inputVariants };
