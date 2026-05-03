"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from "react";
import { cn } from "@/utils/tw-merge";

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = forwardRef<
  ElementRef<typeof TooltipPrimitive.Content>,
  ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 6, side = "top", ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      side={side}
      className={cn(
        "bg-primary text-primary-foreground z-50 overflow-hidden rounded-md px-3 py-1.5 text-xs shadow-md",
        "animate-in fade-in-0 slide-in-from-bottom-1",
        "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-bottom-1",
        "duration-150",
        className
      )}
      {...props}
    />
  </TooltipPrimitive.Portal>
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
