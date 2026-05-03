"use client";

import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import {
  Bell,
  BellOff,
  Package,
  Tag,
  Truck,
  Star,
  X,
  Sparkles,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Popover as PopoverPrimitive } from "radix-ui";
import { cn } from "@/utils/tw-merge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/common/ui/Sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { Separator } from "@/components/common/ui/Separator";
import { useTranslations } from "next-intl";
import { authStore } from "@/store/auth/auth.store";
import { toast } from "sonner";

interface Notification {
  id: string;
  type: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
}

type FindNotificationsByUserResult = {
  findNotificationsByUser: {
    data: Array<{
      id: string;
      message: string;
      type: string;
      isRead: boolean;
      createdAt: string;
    }>;
  };
};

type FindNotificationsByUserVariables = {
  data: {
    page: number;
    limit: number;
  };
};

const FIND_NOTIFICATIONS_BY_USER = gql`
  query FindNotificationsByUserPanel($data: PageLimitInput!) {
    findNotificationsByUser(data: $data) {
      data {
        id
        message
        type
        isRead
        createdAt
      }
    }
  }
`;

const MARK_NOTIFICATION_AS_READ = gql`
  mutation MarkNotificationAsReadPanel($ids: [String!]!) {
    markNotificationAsRead(ids: $ids)
  }
`;

const MARK_ALL_NOTIFICATION_AS_READ = gql`
  mutation MarkAllNotificationAsReadPanel {
    markAllNotificationAsRead
  }
`;

const TYPE_ICON: Record<string, React.ElementType> = {
  ORDER_PLACED: Package,
  ORDER_CONFIRMED: Package,
  ORDER_STATUS_CHANGED: Truck,
  ORDER_SHIPPED: Truck,
  ORDER_DELIVERED: Truck,
  ORDER_CANCELLED: Bell,
  ORDER_REFUNDED: Bell,
  ORDER_PAID: Tag,
  NEW_POST: Sparkles,
  POST_COMMENT: Star,
  ENABLE_TWO_FACTOR: Bell,
  DISABLE_TWO_FACTOR: Bell,
};

const TYPE_COLOR: Record<string, string> = {
  ORDER_PLACED: "bg-blue-500/15 text-blue-500 ring-1 ring-blue-500/20",
  ORDER_CONFIRMED: "bg-blue-500/15 text-blue-500 ring-1 ring-blue-500/20",
  ORDER_STATUS_CHANGED:
    "bg-emerald-500/15 text-emerald-500 ring-1 ring-emerald-500/20",
  ORDER_SHIPPED:
    "bg-emerald-500/15 text-emerald-500 ring-1 ring-emerald-500/20",
  ORDER_DELIVERED:
    "bg-emerald-500/15 text-emerald-500 ring-1 ring-emerald-500/20",
  ORDER_CANCELLED: "bg-muted text-muted-foreground ring-1 ring-border",
  ORDER_REFUNDED: "bg-muted text-muted-foreground ring-1 ring-border",
  ORDER_PAID: "bg-primary/15 text-primary ring-1 ring-primary/20",
  NEW_POST: "bg-primary/15 text-primary ring-1 ring-primary/20",
  POST_COMMENT: "bg-amber-500/15 text-amber-500 ring-1 ring-amber-500/20",
  ENABLE_TWO_FACTOR: "bg-muted text-muted-foreground ring-1 ring-border",
  DISABLE_TWO_FACTOR: "bg-muted text-muted-foreground ring-1 ring-border",
};

const TYPE_TITLE_RU: Record<string, string> = {
  ORDER_PLACED: "Заказ оформлен",
  ORDER_CONFIRMED: "Заказ подтверждён",
  ORDER_STATUS_CHANGED: "Статус заказа изменён",
  ORDER_SHIPPED: "Заказ отправлен",
  ORDER_DELIVERED: "Заказ доставлен",
  ORDER_CANCELLED: "Заказ отменён",
  ORDER_REFUNDED: "Возврат средств",
  ORDER_PAID: "Заказ оплачен",
  READY_FOR_PICKUP: "Заберите с филиала",
  ASSEMBLING: "На сборке",
  NEW_POST: "Новая статья",
  POST_COMMENT: "Комментарий к статье",
  ENABLE_TWO_FACTOR: "2FA включена",
  DISABLE_TWO_FACTOR: "2FA отключена",
};

const STATUS_RU: Record<string, string> = {
  CONFIRMED: "подтвержден",
  SHIPPED: "отправлен",
  DELIVERED: "доставлен",
  COMPLETED: "завершен",
  CANCELLED: "отменен",
  REFUNDED: "возвращен",
  PROCESSING: "в обработке",
  PENDING: "ожидает обработки",
  PAID: "оплачен",
};

function formatNotificationTitle(type: string) {
  return TYPE_TITLE_RU[type] ?? "Уведомление";
}

function localizeStatusText(message: string) {
  let result = message;

  Object.entries(STATUS_RU).forEach(([en, ru]) => {
    result = result.replaceAll(en, ru);
  });

  result = result
    .replace("Status", "Статус")
    .replace("status", "статус")
    .replace("changed", "изменён")
    .replace("to", "на");

  return result;
}

function formatNotificationTime(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function NotificationItem({
  n,
  onRead,
  markAsReadLabel,
}: {
  n: Notification;
  onRead: (id: string) => void;
  markAsReadLabel: string;
}) {
  const Icon = TYPE_ICON[n.type] ?? Bell;
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => {
        if (!n.read) onRead(n.id);
      }}
      onKeyDown={(event) => {
        if ((event.key === "Enter" || event.key === " ") && !n.read) {
          event.preventDefault();
          onRead(n.id);
        }
      }}
      className={cn(
        "group relative flex items-start gap-3 rounded-xl px-3 py-3 transition-all duration-150 outline-none",
        n.read ? "opacity-80 hover:opacity-100" : "bg-accent/70 hover:bg-accent"
      )}
    >
      {!n.read && (
        <span className="bg-primary absolute top-3.5 left-1 h-1.5 w-1.5 rounded-full" />
      )}
      <span
        className={cn(
          "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
          TYPE_COLOR[n.type]
        )}
      >
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-foreground text-sm leading-tight font-semibold">
          {n.title}
        </p>
        <p className="text-foreground/85 mt-0.5 line-clamp-2 text-xs leading-relaxed">
          {n.body}
        </p>
        <p className="text-foreground/50 mt-1.5 text-[11px]">{n.time}</p>
      </div>
      {!n.read && (
        <button
          onClick={(event) => {
            event.stopPropagation();
            onRead(n.id);
          }}
          className="text-muted-foreground hover:text-foreground hover:bg-background mt-0.5 hidden h-6 w-6 shrink-0 items-center justify-center rounded-lg transition-colors group-hover:flex"
          aria-label={markAsReadLabel}
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}

function NotificationsContent({
  items,
  onRead,
  onMarkAllRead,
  onClose,
}: {
  items: Notification[];
  onRead: (id: string) => void;
  onMarkAllRead: () => void;
  onClose?: () => void;
}) {
  const t = useTranslations("navbar");
  const unread = items.filter((n) => !n.read).length;

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className="bg-primary/20 text-primary flex h-7 w-7 items-center justify-center rounded-lg">
            <Bell className="h-3.5 w-3.5" />
          </div>
          <span className="text-foreground text-sm font-bold tracking-tight">
            {t("notifications")}
          </span>
          {unread > 0 && (
            <span className="bg-primary text-primary-foreground flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold shadow-sm">
              {unread > 99 ? "99+" : unread}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {unread > 0 && (
            <button
              onClick={onMarkAllRead}
              className="text-primary hover:bg-primary/10 rounded-lg px-2 py-1 text-xs font-medium transition-colors"
            >
              {t("markAllRead")}
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground hover:bg-accent flex h-7 w-7 items-center justify-center rounded-lg transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <Separator />

      {/* List or empty state */}
      <div className="max-h-screen overflow-y-auto overscroll-contain pb-14 sm:max-h-100">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 px-6 py-12 text-center">
            <div className="from-primary/10 to-primary/5 border-primary/15 relative flex h-16 w-16 items-center justify-center rounded-2xl border bg-linear-to-br shadow-sm">
              <BellOff className="text-primary/60 h-7 w-7" />
              <Sparkles className="text-primary absolute -top-1 -right-1 h-4 w-4 opacity-60" />
            </div>
            <div className="space-y-1">
              <p className="text-foreground text-sm font-semibold">
                {t("noNotifications")}
              </p>
              <p className="text-muted-foreground max-w-50 text-xs leading-relaxed">
                {t("noNotificationsDesc")}
              </p>
            </div>
          </div>
        ) : (
          <div className="p-2">
            {items.map((n) => (
              <NotificationItem
                key={n.id}
                n={n}
                onRead={onRead}
                markAsReadLabel={t("markAsRead")}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function NotificationsPanel() {
  const t = useTranslations("navbar");
  const isMobile = useIsMobile();
  const isAuthenticated = authStore((s) => s.isAuthenticated);
  const [open, setOpen] = useState(false);
  const autoMarkedForCurrentOpenRef = useRef(false);
  const { data, refetch } = useQuery<
    FindNotificationsByUserResult,
    FindNotificationsByUserVariables
  >(FIND_NOTIFICATIONS_BY_USER, {
    variables: { data: { page: 1, limit: 20 } },
    skip: !isAuthenticated,
    fetchPolicy: "cache-and-network",
    pollInterval: 15000,
  });

  // Refetch when panel opens or when user logs in
  useEffect(() => {
    if (open && isAuthenticated) refetch();
  }, [open, isAuthenticated, refetch]);
  const [markNotificationAsRead] = useMutation(MARK_NOTIFICATION_AS_READ);
  const [markAllNotificationAsRead] = useMutation(
    MARK_ALL_NOTIFICATION_AS_READ
  );

  const items = useMemo<Notification[]>(() => {
    if (!isAuthenticated) return [];

    return (data?.findNotificationsByUser?.data ?? []).map((item) => ({
      id: item.id,
      type: item.type,
      title: formatNotificationTitle(item.type),
      body: localizeStatusText(item.message),
      time: formatNotificationTime(item.createdAt),
      read: item.isRead,
    }));
  }, [data, isAuthenticated]);

  const unread = items.filter((n) => !n.read).length;

  useEffect(() => {
    if (!open) {
      autoMarkedForCurrentOpenRef.current = false;
      return;
    }

    if (
      !isAuthenticated ||
      unread === 0 ||
      autoMarkedForCurrentOpenRef.current
    ) {
      return;
    }

    autoMarkedForCurrentOpenRef.current = true;

    markAllNotificationAsRead()
      .then(() => refetch())
      .catch(() => {
        autoMarkedForCurrentOpenRef.current = false;
        toast.error(t("notificationsLoadError"));
      });
  }, [open, unread, isAuthenticated, markAllNotificationAsRead, refetch, t]);

  const markRead = async (id: string) => {
    try {
      await markNotificationAsRead({ variables: { ids: [id] } });
      refetch();
    } catch {
      toast.error(t("notificationsLoadError"));
    }
  };

  const markAllRead = async () => {
    try {
      await markAllNotificationAsRead();
      refetch();
    } catch {
      toast.error(t("notificationsLoadError"));
    }
  };

  const trigger = (
    <button
      aria-label={t("notifications")}
      onClick={() => isMobile && setOpen(true)}
      className="text-muted-foreground hover:text-foreground hover:bg-accent relative flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
    >
      <Bell className="h-4 w-4" />
      {unread > 0 && (
        <span className="bg-primary text-primary-foreground absolute -top-2 left-1/2 flex h-4 min-w-4 -translate-x-1/2 items-center justify-center rounded-full px-1 text-[9px] font-bold shadow-sm">
          {unread > 9 ? "9+" : unread}
        </span>
      )}
    </button>
  );

  if (isMobile) {
    return (
      <>
        {trigger}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent
            side="right"
            className="w-full max-w-sm p-0"
            showCloseButton={false}
          >
            <SheetHeader className="sr-only">
              <SheetTitle>{t("notifications")}</SheetTitle>
            </SheetHeader>
            <NotificationsContent
              items={items}
              onRead={markRead}
              onMarkAllRead={markAllRead}
              onClose={() => setOpen(false)}
            />
          </SheetContent>
        </Sheet>
      </>
    );
  }

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger asChild>{trigger}</PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align="end"
          sideOffset={8}
          className={cn(
            "bg-card border-primary/20 z-50 w-84 overflow-hidden rounded-2xl border shadow-2xl outline-none",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
            "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2"
          )}
        >
          <NotificationsContent
            items={items}
            onRead={markRead}
            onMarkAllRead={markAllRead}
          />
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
