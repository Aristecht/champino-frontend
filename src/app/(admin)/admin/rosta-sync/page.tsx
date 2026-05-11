"use client";

import { useEffect, useRef, useState } from "react";
import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import { Loader2, RefreshCw, CheckCircle2, AlertCircle, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/common/ui/Button";

const ADMIN_SYNC_ROSTA_PRODUCTS = gql`
  mutation AdminSyncRostaProducts {
    adminSyncRostaProducts
  }
`;

const ADMIN_CANCEL_ROSTA_SYNC = gql`
  mutation AdminCancelRostaSync {
    adminCancelRostaSync
  }
`;

const GET_ROSTA_SYNC_STATUS = gql`
  query GetRostaSyncStatus {
    getRostaSyncStatus {
      isRunning
      progress
      status
      error
      startedAt
    }
  }
`;

type SyncStatus = {
  isRunning: boolean;
  progress: number;
  status: string;
  error?: string;
  startedAt?: string;
};

export default function AdminRostaSyncPage() {
  // isStarting: true only between clicking the button and first server response confirming isRunning=true
  const [isStarting, setIsStarting] = useState(false);
  const wasRunning = useRef(false);

  // Always poll — state is fully owned by the server, survives page reloads
  const { data: statusQueryData, startPolling } = useQuery<{
    getRostaSyncStatus: SyncStatus;
  }>(GET_ROSTA_SYNC_STATUS, {
    fetchPolicy: "network-only",
    pollInterval: 3000,
  });

  const statusData = statusQueryData?.getRostaSyncStatus ?? null;
  const isRunning = statusData?.isRunning ?? false;

  // Speed up polling while sync is active
  useEffect(() => {
    if (isRunning || isStarting) {
      startPolling(500);
    } else {
      startPolling(3000);
    }
  }, [isRunning, isStarting, startPolling]);

  // Once server confirms running, clear the local "starting" flag
  useEffect(() => {
    if (isRunning && isStarting) {
      queueMicrotask(() => setIsStarting(false));
    }
  }, [isRunning, isStarting]);

  // Show toast when sync transitions from running → stopped
  useEffect(() => {
    if (statusData?.isRunning) {
      wasRunning.current = true;
      return;
    }
    if (!wasRunning.current) return;

    wasRunning.current = false;
    const s = statusData?.status ?? "";
    if (statusData?.error) {
      toast.error(statusData.error);
    } else if (s.includes("отменена") || s.includes("Отмена")) {
      toast.info("Синхронизация отменена");
    } else if (s.includes("Готово")) {
      toast.success("Синхронизация завершена!");
    }
  }, [statusData?.isRunning, statusData?.error, statusData?.status]);

  const [runSync, { loading }] = useMutation(ADMIN_SYNC_ROSTA_PRODUCTS, {
    onCompleted: () => {
      setIsStarting(true);
      toast.success("Синхронизация ROSTA запущена");
    },
    onError: (error) => {
      setIsStarting(false);
      toast.error(error.message || "Ошибка запуска синхронизации");
    },
  });

  const [cancelSync, { loading: cancelling }] = useMutation(
    ADMIN_CANCEL_ROSTA_SYNC,
    {
      onCompleted: () => {
        toast.info("Запрос на отмену отправлен");
      },
      onError: (error) => {
        toast.error(error.message || "Ошибка отмены");
      },
    },
  );

  const isBusy = loading || isStarting || isRunning;
  const isCompleted =
    statusData && !statusData.isRunning && statusData.progress === 100;
  const hasError = !!statusData?.error;
  const showStatus = isRunning || isCompleted || hasError || isStarting;

  return (
    <div className="space-y-5 p-4 sm:p-6">
      <div>
        <h1 className="text-foreground text-xl font-semibold">
          Синхронизация ROSTA
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Синхронизация запускается только вручную при нажатии на кнопку ниже.
        </p>
      </div>

      <div className="bg-card border-border max-w-2xl rounded-lg border p-5">
        <div className="space-y-6">
          <p className="text-muted-foreground text-sm leading-relaxed">
            После запуска система обновит категории и товары из ROSTA. Повторный
            запуск во время активной синхронизации будет автоматически пропущен.
          </p>

          {/* Status indicator and progress */}
          {showStatus && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isRunning || isStarting ? (
                    <Loader2 className="text-primary h-5 w-5 animate-spin" />
                  ) : hasError ? (
                    <AlertCircle className="text-destructive h-5 w-5" />
                  ) : isCompleted ? (
                    <CheckCircle2 className="text-green-500 h-5 w-5" />
                  ) : null}
                  <span className="text-foreground text-sm font-medium">
                    {isStarting && !isRunning
                      ? "Запуск синхронизации..."
                      : (statusData?.status ?? "")}
                  </span>
                </div>
                <span className="text-foreground font-semibold tabular-nums">
                  {statusData?.progress ?? 0}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
                <div
                  className={`h-full transition-all duration-300 ${
                    hasError
                      ? "bg-destructive"
                      : isCompleted
                        ? "bg-green-500"
                        : "bg-primary"
                  }`}
                  style={{ width: `${statusData?.progress ?? 0}%` }}
                />
              </div>

              {/* Error message */}
              {hasError && (
                <div className="bg-destructive/10 text-destructive rounded p-3 text-sm">
                  {statusData?.error}
                </div>
              )}
            </div>
          )}

          <div className="flex items-center gap-3">
            <Button
              type="button"
              onClick={() => runSync()}
              disabled={isBusy}
              className="min-w-52"
            >
              {isBusy ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {loading || isStarting ? "Запуск..." : "Синхронизация..."}
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  Запустить синхронизацию
                </>
              )}
            </Button>

            {isRunning && (
              <Button
                type="button"
                variant="outline"
                onClick={() => cancelSync()}
                disabled={cancelling}
              >
                {cancelling ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <X className="h-4 w-4" />
                )}
                Отменить
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
