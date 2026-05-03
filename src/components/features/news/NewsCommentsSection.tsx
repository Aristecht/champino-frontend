"use client";

import { useMemo, useState } from "react";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { MessageCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { authStore } from "@/store/auth/auth.store";

type Comment = {
  id: string;
  body: string;
  userId: string;
  createdAt: string;
};

const ADD_COMMENT = gql`
  mutation AddPostCommentNewsPage(
    $postId: String!
    $data: CreateCommentInput!
  ) {
    addPostComment(postId: $postId, data: $data) {
      id
    }
  }
`;

const DELETE_COMMENT = gql`
  mutation DeletePostCommentNewsPage($commentId: String!) {
    deletePostComment(commentId: $commentId)
  }
`;

const ADMIN_DELETE_COMMENT = gql`
  mutation AdminDeletePostCommentNewsPage($commentId: String!) {
    adminDeletePostComment(commentId: $commentId)
  }
`;

interface Props {
  postId: string;
  comments: Comment[];
  onRefresh: () => Promise<unknown>;
}

const CHUNK = 20;

export function NewsCommentsSection({ postId, comments, onRefresh }: Props) {
  const t = useTranslations("news");
  const isAuthenticated = authStore((s) => s.isAuthenticated);
  const user = authStore((s) => s.user);
  const [text, setText] = useState("");
  const [visible, setVisible] = useState(CHUNK);

  const [addComment, { loading: adding }] = useMutation(ADD_COMMENT);
  const [deleteComment, { loading: deletingMine }] =
    useMutation(DELETE_COMMENT);
  const [adminDeleteComment, { loading: deletingAdmin }] =
    useMutation(ADMIN_DELETE_COMMENT);

  const sorted = useMemo(
    () =>
      [...comments].sort(
        (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)
      ),
    [comments]
  );
  const visibleComments = sorted.slice(0, visible);
  const canLoadMore = visible < sorted.length;

  const role = user?.role?.toUpperCase();
  const canModerate = role === "ADMIN" || role === "MANAGER";

  async function handleAdd() {
    const body = text.trim();
    if (!body) return;

    try {
      await addComment({ variables: { postId, data: { body } } });
      setText("");
      await onRefresh();
      toast.success(t("commentAdded"));
    } catch {
      toast.error(t("commentAddError"));
    }
  }

  async function handleDelete(commentId: string, isMine: boolean) {
    try {
      if (!isMine && canModerate) {
        await adminDeleteComment({ variables: { commentId } });
      } else {
        await deleteComment({ variables: { commentId } });
      }
      await onRefresh();
      toast.success(t("commentDeleted"));
    } catch {
      toast.error(t("commentDeleteError"));
    }
  }

  return (
    <section className="bg-card border-border/50 space-y-5 rounded-2xl border p-6">
      <div className="flex items-center gap-2">
        <MessageCircle className="text-primary h-5 w-5" />
        <h2 className="text-foreground text-lg font-bold">
          {t("commentsTitle")}
        </h2>
      </div>

      {isAuthenticated ? (
        <div className="space-y-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            placeholder={t("commentPlaceholder")}
            className="border-border bg-background text-foreground focus:ring-primary/30 w-full resize-y rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2"
          />
          <button
            onClick={handleAdd}
            disabled={adding}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-60"
          >
            {adding ? t("sending") : t("sendComment")}
          </button>
        </div>
      ) : (
        <p className="text-muted-foreground text-sm">{t("loginToComment")}</p>
      )}

      {visibleComments.length === 0 ? (
        <p className="text-muted-foreground text-sm">{t("noComments")}</p>
      ) : (
        <div className="space-y-3">
          {visibleComments.map((c) => {
            const isMine = user?.id === c.userId;
            const canDelete = isMine || canModerate;

            return (
              <div
                key={c.id}
                className="bg-background border-border/50 rounded-xl border p-4"
              >
                <div className="mb-2 flex items-center justify-between gap-3">
                  <p className="text-muted-foreground text-xs">
                    {new Intl.DateTimeFormat(undefined, {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }).format(new Date(c.createdAt))}
                  </p>
                  {canDelete && (
                    <button
                      onClick={() => handleDelete(c.id, Boolean(isMine))}
                      disabled={deletingMine || deletingAdmin}
                      className="text-muted-foreground hover:text-destructive transition-colors disabled:opacity-60"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <p className="text-foreground text-sm leading-relaxed whitespace-pre-line">
                  {c.body}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {canLoadMore && (
        <button
          onClick={() => setVisible((v) => v + CHUNK)}
          className="bg-muted text-foreground hover:bg-muted/80 rounded-xl px-4 py-2 text-sm font-medium transition-colors"
        >
          {t("loadMoreComments")}
        </button>
      )}
    </section>
  );
}
