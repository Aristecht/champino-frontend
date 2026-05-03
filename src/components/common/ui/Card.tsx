// components/ui/card.tsx
import { cn } from "@/utils/tw-merge";
import { cva, type VariantProps } from "class-variance-authority";
import { ComponentProps } from "react";

const cardVariants = cva(
  "group/card flex flex-col overflow-hidden rounded-xl border transition-all duration-200",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground border-border shadow-soft",
        elevated:
          "bg-card text-card-foreground border-border shadow-medium hover:shadow-large hover:-translate-y-0.5",
        glass: "glass",
        outline:
          "bg-transparent border-2 border-border hover:border-primary/50",
        gradient:
          "bg-gradient-to-br from-card to-muted border-border/50 shadow-soft",
      },
      size: {
        default: "gap-4 py-4 text-sm",
        sm: "gap-3 py-3 text-xs",
        lg: "gap-6 py-6 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface CardProps
  extends ComponentProps<"div">, VariantProps<typeof cardVariants> {}

function Card({ className, variant, size, ...props }: CardProps) {
  return (
    <div
      data-slot="card"
      data-variant={variant}
      data-size={size}
      className={cn(
        cardVariants({ variant, size }),
        "has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0",
        "*:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl",
        className
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "grid auto-rows-min items-start rounded-t-xl px-2",
        "group-data-[size=lg]/card:px-4 group-data-[size=sm]/card:px-3",
        "has-data-[slot=card-action]:grid-cols-[1fr_auto]",
        "has-data-[slot=card-description]:grid-rows-[auto_auto]",
        "group/card-header @container/card-header",
        className
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: ComponentProps<"h3">) {
  return (
    <h3
      data-slot="card-title"
      className={cn(
        "text-base leading-tight font-semibold tracking-tight",
        "group-data-[size=sm]/card:text-sm",
        "group-data-[size=lg]/card:text-lg",
        className
      )}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: ComponentProps<"p">) {
  return (
    <p
      data-slot="card-description"
      className={cn(
        "text-muted-foreground text-sm leading-relaxed",
        "group-data-[size=sm]/card:text-xs",
        "group-data-[size=lg]/card:text-base",
        className
      )}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn(
        "px-4 group-data-[size=lg]/card:px-6 group-data-[size=sm]/card:px-3",
        className
      )}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "bg-muted/30 flex items-center gap-2 rounded-b-xl border-t p-3",
        "group-data-[size=lg]/card:p-6 group-data-[size=sm]/card:p-3",
        className
      )}
      {...props}
    />
  );
}

// Компонент для бейджа в карточке
function CardBadge({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "bg-primary/10 text-primary inline-flex items-center rounded-md px-2 py-1 text-xs font-medium",
        "dark:bg-primary/20",
        className
      )}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
  CardBadge,
};
