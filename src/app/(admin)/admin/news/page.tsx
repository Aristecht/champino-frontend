"use client";

import { useState } from "react";
import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { Skeleton } from "@/components/common/ui/Skeleton";
import { AdminNewsForm } from "@/components/features/admin/news/AdminNewsForm";

const ADMIN_GET_POSTS = gql`
  query AdminGetPostsPage($filter: FilterPostInput) {
    adminGetPosts(filter: $filter) {
      data {
        id
        title
        slug
        excerpt
        body
        coverImage
        tags
        isPublished
        publishedAt
        createdAt
      }
      total
    }
  }
`;
const DELETE_POST = gql`
  mutation AdminDeletePost($id: String!) {
    deletePost(id: $id)
  }
`;

export type PostFormValues = {
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  coverImage: string;
  tags: string;
  isPublished: boolean;
};

type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  body: string;
  coverImage: string | null;
  tags: string[];
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
};

type GetPostsResult = { adminGetPosts: { data: Post[]; total: number } };
const PAGE_SIZE = 15;

async function savePostWithImage(
  values: PostFormValues,
  coverFile: File | null,
  id?: string
) {
  const fd = new FormData();
  fd.append("title", values.title);
  fd.append("slug", values.slug);
  fd.append("body", values.body);
  if (values.excerpt) fd.append("excerpt", values.excerpt);
  if (values.tags) fd.append("tags", values.tags);
  fd.append("isPublished", String(values.isPublished));

  if (coverFile) fd.append("coverImage", coverFile);
  else if (values.coverImage) fd.append("coverImage", values.coverImage);

  const endpoint = id
    ? `${process.env.NEXT_PUBLIC_API_URL}/news/${id}`
    : `${process.env.NEXT_PUBLIC_API_URL}/news`;

  const res = await fetch(endpoint, {
    method: id ? "PATCH" : "POST",
    body: fd,
    credentials: "include",
  });

  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
}

function formatDate(v: string) {
  return new Intl.DateTimeFormat(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(v));
}

export default function AdminNewsPage() {
  const t = useTranslations("admin");
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Post | null>(null);
  const [page, setPage] = useState(1);
  const [saving, setSaving] = useState(false);

  const { data, loading, refetch } = useQuery<GetPostsResult>(ADMIN_GET_POSTS, {
    variables: { filter: { limit: PAGE_SIZE, page } },
    fetchPolicy: "cache-and-network",
  });

  const [deletePost] = useMutation(DELETE_POST, {
    onCompleted: () => {
      toast.success(t("postDeleted"));
      refetch();
    },
    onError: (e) => toast.error(e.message || t("postDeleteError")),
  });

  const posts = data?.adminGetPosts?.data ?? [];

  const total = data?.adminGetPosts?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  async function handleSubmit(
    values: PostFormValues,
    coverFile: File | null,
    id?: string
  ) {
    try {
      setSaving(true);
      await savePostWithImage(values, coverFile, id);
      toast.success(t("postSaved"));

      setFormOpen(false);
      setEditTarget(null);
      await refetch({ filter: { limit: PAGE_SIZE, page } });
    } catch (e) {
      const msg = e instanceof Error ? e.message : t("postSaveError");
      toast.error(msg || t("postSaveError"));
    } finally {
      setSaving(false);
    }
  }

  if (formOpen || editTarget) {
    return (
      <AdminNewsForm
        initial={
          editTarget
            ? {
                title: editTarget.title,
                slug: editTarget.slug,
                excerpt: editTarget.excerpt ?? "",
                body: editTarget.body,
                coverImage: editTarget.coverImage ?? "",
                tags: editTarget.tags.join(", "),
                isPublished: editTarget.isPublished,
              }
            : undefined
        }
        saving={saving}
        onSubmit={(v, f) => handleSubmit(v, f, editTarget?.id)}
        onCancel={() => {
          setFormOpen(false);
          setEditTarget(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-foreground text-xl font-bold">{t("news")}</h1>
        <button
          onClick={() => setFormOpen(true)}
          className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors"
        >
          <Plus className="h-4 w-4" />
          {t("addPost")}
        </button>
      </div>

      {loading && (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      )}

      {!loading && posts.length === 0 && (
        <p className="text-muted-foreground py-8 text-center text-sm">
          {t("noData")}
        </p>
      )}

      {!loading && posts.length > 0 && (
        <div className="space-y-2">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-card border-border/50 flex items-center gap-3 rounded-xl border px-4 py-3"
            >
              <div className="min-w-0 flex-1">
                <p className="text-foreground truncate text-sm font-semibold">
                  {post.title}
                </p>
                <p className="text-muted-foreground truncate text-xs">
                  {formatDate(post.createdAt)} · {post.tags.join(", ")}
                </p>
              </div>
              <span
                className={`rounded-lg px-2 py-0.5 text-[11px] font-medium ${post.isPublished ? "bg-emerald-500/10 text-emerald-600" : "bg-muted text-muted-foreground"}`}
              >
                {post.isPublished ? t("postPublished") : t("postDraft")}
              </span>
              <button
                onClick={() => setEditTarget(post)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                onClick={() => {
                  if (confirm(t("postDeleteConfirm")))
                    deletePost({ variables: { id: post.id } }).then(() => {
                      if (posts.length === 1 && page > 1) setPage((p) => p - 1);
                    });
                }}
                className="text-muted-foreground hover:text-destructive transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="bg-muted text-foreground hover:bg-muted/80 rounded-lg px-3 py-1.5 text-xs transition-colors disabled:opacity-50"
          >
            ←
          </button>
          <span className="text-muted-foreground text-xs">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="bg-muted text-foreground hover:bg-muted/80 rounded-lg px-3 py-1.5 text-xs transition-colors disabled:opacity-50"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}
