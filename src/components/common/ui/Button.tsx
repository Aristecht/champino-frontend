// components/ui/button.tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";

import { cn } from "@/utils/tw-merge";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-soft hover:bg-primary/90 dark:shadow-medium",

        gradient:
          "gradient-orange text-white shadow-medium hover:opacity-90 hover:shadow-large dark:glow-orange",

        outline:
          "border border-border bg-background hover:bg-muted hover:text-foreground dark:border-border/50 dark:hover:bg-muted/50",

        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 dark:hover:bg-secondary/90",

        ghost: "hover:bg-muted hover:text-foreground dark:hover:bg-muted/50",

        destructive:
          "bg-destructive text-destructive-foreground shadow-soft hover:bg-destructive/90 dark:shadow-medium",

        link: "text-primary underline-offset-4 hover:underline",

        orange:
          "bg-primary text-primary-foreground shadow-medium hover:bg-accent hover:shadow-large dark:glow-orange",

        "outline-orange":
          "border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-primary-foreground dark:hover:glow-orange",
      },
      size: {
        default: "min-h-10 px-4 py-2",
        xs: "h-7 rounded-md px-2.5 text-xs",
        sm: "h-9 rounded-md px-3 text-sm",
        lg: "h-11 rounded-lg px-8 text-base",
        xl: "h-12 rounded-lg px-10 text-lg",
        icon: "h-10 w-10",
        "icon-xs": "h-7 w-7 rounded-md",
        "icon-sm": "h-9 w-9 rounded-md",
        "icon-lg": "h-11 w-11",
        "icon-xl": "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
