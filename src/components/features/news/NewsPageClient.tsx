"use client";

import Link from "next/link";
import { useState } from "react";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useTranslations } from "next-intl";
import { Newspaper, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/utils/tw-merge";
import { Skeleton } from "@/components/common/ui/Skeleton";
import { storageUrl } from "@/utils/storage-url";

const GET_POSTS = gql`
  query GetPostsNewsPage($filter: FilterPostInput) {
    getPosts(filter: $filter) {
      data {
        id
        title
        excerpt
        slug
        coverImage
        tags
        publishedAt
        createdAt
      }
      total
    }
  }
`;

type Post = {
  id: string;
  title: string;
  excerpt: string | null;
  slug: string;
  coverImage: string | null;
  tags: string[];
  publishedAt: string | null;
  createdAt: string;
};

type GetPostsResult = {
  getPosts: { data: Post[]; total: number };
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

const TAG_COLOR: Record<string, string> = {
  promo: "bg-rose-500/10 text-rose-500",
  tips: "bg-amber-500/10 text-amber-500",
  new: "bg-emerald-500/10 text-emerald-500",
};
const DEFAULT_TAG_COLOR = "bg-primary/10 text-primary";

export function NewsPageClient() {
  const t = useTranslations("news");
  const [activeTag, setActiveTag] = useState<string>("all");

  const { data, loading, error } = useQuery<GetPostsResult>(GET_POSTS, {
    variables: { filter: { limit: 30, page: 1 } },
    fetchPolicy: "cache-and-network",
  });

  const allPosts = data?.getPosts?.data ?? [];
  const allTags = Array.from(new Set(allPosts.flatMap((p) => p.tags)));
  const filtered =
    activeTag === "all"
      ? allPosts
      : allPosts.filter((p) => p.tags.includes(activeTag));

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-10 sm:px-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="bg-primary/10 text-primary flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl">
          <Newspaper className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-foreground text-2xl font-extrabold tracking-tight sm:text-3xl">
            {t("title")}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">{t("subtitle")}</p>
        </div>
      </div>

      {/* Tag filter */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTag("all")}
            className={cn(
              "rounded-xl px-4 py-1.5 text-sm font-medium transition-colors",
              activeTag === "all"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            )}
          >
            {t("tagAll")}
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={cn(
                "rounded-xl px-4 py-1.5 text-sm font-medium transition-colors",
                activeTag === tag
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* States */}
      {loading && (
        <div className="grid gap-5 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-44 rounded-2xl" />
          ))}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
          <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
          <p className="text-sm text-red-500">{t("loadError")}</p>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <p className="text-muted-foreground py-12 text-center text-sm">
          {t("noNews")}
        </p>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2">
          {filtered.map((post) => (
            <Link
              key={post.id}
              href={`/news/${post.id}?slug=${encodeURIComponent(post.slug)}`}
              className="group block"
            >
              <article className="bg-card border-border/50 overflow-hidden rounded-2xl border transition-shadow group-hover:shadow-md">
                {post.coverImage && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={storageUrl(post.coverImage) ?? post.coverImage}
                    alt={post.title}
                    className="h-44 w-full object-cover"
                  />
                )}

                <div className="flex h-full flex-col p-5">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className={cn(
                          "rounded-lg px-2.5 py-0.5 text-[11px] font-semibold",
                          TAG_COLOR[tag] ?? DEFAULT_TAG_COLOR
                        )}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h2 className="text-foreground mb-2 text-sm leading-snug font-bold">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-muted-foreground mb-4 line-clamp-3 flex-1 text-xs leading-relaxed">
                      {post.excerpt}
                    </p>
                  )}
                  <div className="mt-auto flex items-center justify-between gap-3">
                    <p className="text-muted-foreground/60 flex items-center gap-1 text-[11px]">
                      <Clock className="h-3 w-3" />
                      {formatDate(post.publishedAt ?? post.createdAt)}
                    </p>
                    <span className="text-primary group-hover:text-primary/80 text-xs font-semibold transition-colors">
                      {t("readMore")}
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
