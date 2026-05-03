"use client";

import { cn } from "@/utils/tw-merge";
import { MoreHorizontal, UserCircle } from "lucide-react";
import { toast } from "sonner";
import {
  useFindAllUsersQuery,
  useAssignRoleMutation,
  Role,
} from "@/generated/output";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/common/ui/DropdownMenu";

const ROLE_CLASS: Record<string, string> = {
  ADMIN:
    "bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400",
  MANAGER: "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
  USER: "bg-muted text-muted-foreground",
};

const ROLE_LABEL: Record<string, string> = {
  ADMIN: "Администратор",
  MANAGER: "Менеджер",
  USER: "Пользователь",
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function AdminUsersPage() {
  const { data, loading, refetch } = useFindAllUsersQuery({
    fetchPolicy: "cache-and-network",
  });

  const [assignRole] = useAssignRoleMutation({
    onCompleted: () => {
      toast.success("Роль обновлена");
      refetch();
    },
    onError: () => toast.error("Не удалось изменить роль"),
  });

  const users = data?.findAllUser ?? [];

  return (
    <div className="space-y-5 p-6">
      <div>
        <h1 className="text-foreground text-xl font-semibold">Пользователи</h1>
        {!loading && (
          <p className="text-muted-foreground mt-0.5 text-sm">
            {users.length} пользователей
          </p>
        )}
      </div>

      <div className="bg-card border-border rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                {[
                  "Пользователь",
                  "Email",
                  "Роль",
                  "Статус",
                  "Регистрация",
                  "",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-muted-foreground px-4 py-2.5 text-left text-xs font-medium first:pl-5"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="border-b last:border-0">
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-4 py-3.5 first:pl-5">
                        <div
                          className="bg-muted h-4 animate-pulse rounded"
                          style={{ width: j === 0 ? "60%" : "45%" }}
                        />
                      </td>
                    ))}
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-muted-foreground px-5 py-12 text-center text-sm"
                  >
                    Пользователей не найдено
                  </td>
                </tr>
              ) : (
                users.map((u, i) => (
                  <tr
                    key={u.id}
                    className={cn(
                      "hover:bg-muted/30 transition-colors",
                      i < users.length - 1 && "border-b"
                    )}
                  >
                    <td className="py-3.5 pr-4 pl-5">
                      <div className="flex items-center gap-2.5">
                        {u.avatar ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={u.avatar}
                            alt={u.username}
                            className="h-8 w-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-full">
                            <UserCircle className="text-muted-foreground h-5 w-5" />
                          </div>
                        )}
                        <span className="text-foreground font-medium">
                          {u.username}
                        </span>
                      </div>
                    </td>
                    <td className="text-muted-foreground px-4 py-3.5 text-sm">
                      {u.email}
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium",
                          ROLE_CLASS[u.role] ?? "bg-muted text-muted-foreground"
                        )}
                      >
                        {ROLE_LABEL[u.role] ?? u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      {u.isDeactivated ? (
                        <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-medium text-red-700 dark:bg-red-950/40 dark:text-red-400">
                          Заблокирован
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                          Активен
                        </span>
                      )}
                    </td>
                    <td className="text-muted-foreground px-4 py-3.5 text-xs">
                      {fmtDate(u.createdAt)}
                    </td>
                    <td className="px-4 py-3.5 pr-5">
                      {u.role !== "ADMIN" && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="hover:bg-accent flex h-7 w-7 items-center justify-center rounded-md transition-colors">
                              <MoreHorizontal className="text-muted-foreground h-4 w-4" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44">
                            {u.role !== "MANAGER" && (
                              <DropdownMenuItem
                                onClick={() =>
                                  assignRole({
                                    variables: {
                                      userId: u.id,
                                      role: Role.Manager,
                                    },
                                  })
                                }
                              >
                                Назначить менеджером
                              </DropdownMenuItem>
                            )}
                            {u.role !== "USER" && (
                              <DropdownMenuItem
                                onClick={() =>
                                  assignRole({
                                    variables: {
                                      userId: u.id,
                                      role: Role.User,
                                    },
                                  })
                                }
                              >
                                Снять роль
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
