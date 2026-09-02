"use client";

import Link from "next/link";
import { useRef } from "react";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useTranslations } from "next-intl";
import { Newspaper, Clock, ArrowRight, AlertCircle } from "lucide-react";
import { cn } from "@/utils/tw-merge";
import { Skeleton } from "@/components/common/ui/Skeleton";
import { storageUrl } from "@/utils/storage-url";

const GET_HOME_POSTS = gql`
  query GetHomePosts($filter: FilterPostInput) {
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
  promo: "bg-rose-500/10 text-rose-500 dark:bg-rose-500/15",
  tips: "bg-amber-500/10 text-amber-500 dark:bg-amber-500/15",
  new: "bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/15",
};
const DEFAULT_TAG_COLOR = "bg-primary/10 text-primary dark:bg-primary/20";

function PostCard({ post }: { post: Post }) {
  const t = useTranslations("home.news");
  return (
    <Link
      href={`/news/${post.id}?slug=${encodeURIComponent(post.slug)}`}
      className="group block h-full w-[75vw] shrink-0 sm:w-auto sm:min-w-0"
    >
      <article
        className={cn(
          "bg-card border-border/50 flex h-full flex-col overflow-hidden rounded-2xl border transition-all duration-300",
          "group-hover:border-primary/30 group-hover:shadow-primary/5 group-hover:shadow-lg",
          "group-hover:-translate-y-0.5"
        )}
      >
        {/* Cover image */}
        <div className="relative h-44 shrink-0 overflow-hidden sm:h-48">
          {post.coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={storageUrl(post.coverImage) ?? post.coverImage}
              alt={post.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="bg-muted flex h-full w-full items-center justify-center">
              <Newspaper className="text-muted-foreground h-10 w-10 opacity-20" />
            </div>
          )}

          {/* Gradient overlay */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className={cn(
                    "rounded-lg px-2.5 py-0.5 text-[11px] font-semibold backdrop-blur-sm",
                    TAG_COLOR[tag] ?? DEFAULT_TAG_COLOR
                  )}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Date */}
          <div className="absolute right-3 bottom-3">
            <span className="flex items-center gap-1 rounded-lg bg-black/50 px-2 py-0.5 text-[11px] text-white/90 backdrop-blur-sm">
              <Clock className="h-3 w-3" />
              {formatDate(post.publishedAt ?? post.createdAt)}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-5">
          <h3 className="text-foreground group-hover:text-primary mb-2 truncate text-sm font-bold transition-colors duration-300">
            {post.title}
          </h3>

          {post.excerpt && (
            <p className="text-muted-foreground mb-4 flex-1 truncate text-xs leading-relaxed">
              {post.excerpt}
            </p>
          )}

          <div className="mt-auto flex items-center justify-between">
            <span className="text-primary group-hover:text-primary/80 inline-flex items-center gap-1 text-xs font-semibold transition-colors">
              {t("readMore")}
              <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

export function HomeNewsSection() {
  const t = useTranslations("home.news");

  const { data, loading, error } = useQuery<GetPostsResult>(GET_HOME_POSTS, {
    variables: { filter: { limit: 3, page: 1 } },
    fetchPolicy: "cache-and-network",
  });

  const posts = data?.getPosts?.data ?? [];

  // Take only 3 posts, duplicate for infinite scroll
  const displayPosts = posts.slice(0, 3);
  const carouselPosts = [...displayPosts, ...displayPosts, ...displayPosts];

  return (
    <section className="mx-auto my-4 max-w-6xl px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-foreground text-2xl font-bold sm:text-3xl">
              {t("title")}
            </h2>
          </div>
          <p className="text-muted-foreground mt-2 text-sm">{t("subtitle")}</p>
        </div>
        <Link
          href="/news"
          className="text-primary hover:text-primary/80 mt-2 hidden items-center gap-1.5 text-sm font-semibold transition-colors sm:mt-0 sm:flex"
        >
          {t("allNews")}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-72 rounded-2xl" />
          ))}
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
          <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
          <p className="text-sm text-red-500">{t("loadError")}</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && posts.length === 0 && (
        <div className="bg-card border-border rounded-2xl border p-8 text-center sm:p-12">
          <Newspaper className="text-muted-foreground mx-auto h-10 w-10 opacity-30" />
          <p className="text-muted-foreground mt-3 text-sm">{t("noNews")}</p>
        </div>
      )}

      {/* Posts */}
      {!loading && !error && posts.length > 0 && (
        <>
          {/* Desktop grid (hidden on mobile) */}
          <div className="hidden gap-5 sm:grid sm:grid-cols-2 lg:grid-cols-3">
            {displayPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          {/* Mobile carousel — pure CSS infinite scroll */}
          <div className="relative overflow-hidden sm:hidden">
            <div
              className="marquee-track flex gap-4"
              style={{
                width: "max-content",
                animation: "marquee 17s linear infinite",
              }}
            >
              {carouselPosts.map((post, index) => (
                <PostCard key={`${post.id}-${index}`} post={post} />
              ))}
            </div>

            {/* Mobile "All news" link */}
            <Link
              href="/news"
              className="text-primary hover:text-primary/80 mt-4 flex w-full items-center justify-center gap-1.5 text-sm font-semibold transition-colors"
            >
              {t("allNews")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </>
      )}
    </section>
  );
}
