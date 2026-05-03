"use client";

import Link from "next/link";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useTranslations } from "next-intl";
import { ArrowLeft, Clock, AlertCircle } from "lucide-react";
import { storageUrl } from "@/utils/storage-url";
import { Skeleton } from "@/components/common/ui/Skeleton";
import { NewsCommentsSection } from "@/components/features/news/NewsCommentsSection";

const GET_POST = gql`
  query GetPostNewsPage($slug: String!) {
    getPost(slug: $slug) {
      id
      title
      excerpt
      body
      slug
      tags
      coverImage
      publishedAt
      createdAt
      comments {
        id
        body
        userId
        createdAt
      }
    }
  }
`;

type Post = {
  id: string;
  title: string;
  excerpt: string | null;
  body: string;
  slug: string;
  tags: string[];
  coverImage: string | null;
  publishedAt: string | null;
  createdAt: string;
  comments: {
    id: string;
    body: string;
    userId: string;
    createdAt: string;
  }[];
};

type GetPostResult = {
  getPost: Post;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

interface Props {
  postId: string;
  slug: string;
}

export function NewsPostPageClient({ postId, slug }: Props) {
  const t = useTranslations("news");
  const effectiveSlug = slug || postId;

  const { data, loading, error, refetch } = useQuery<GetPostResult>(GET_POST, {
    variables: { slug: effectiveSlug },
    fetchPolicy: "cache-and-network",
  });

  const post = data?.getPost;

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-10 sm:px-6">
      <Link
        href="/news"
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        {t("backToNews")}
      </Link>

      {loading && (
        <div className="space-y-4">
          <Skeleton className="h-10 w-2/3 rounded-xl" />
          <Skeleton className="h-72 w-full rounded-2xl" />
          <Skeleton className="h-32 w-full rounded-2xl" />
        </div>
      )}

      {!loading && error && (
        <div className="flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
          <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
          <p className="text-sm text-red-500">{t("loadError")}</p>
        </div>
      )}

      {!loading && !error && !post && (
        <p className="text-muted-foreground py-10 text-center text-sm">
          {t("notFound")}
        </p>
      )}

      {!loading && !error && post && (
        <div className="space-y-6">
          <article className="bg-card border-border/50 overflow-hidden rounded-2xl border">
            {post.coverImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={storageUrl(post.coverImage) ?? post.coverImage}
                alt={post.title}
                className="h-72 w-full object-cover"
              />
            )}

            <div className="space-y-5 p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-primary/10 text-primary rounded-lg px-2.5 py-1 text-[11px] font-semibold"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <h1 className="text-foreground text-2xl font-extrabold tracking-tight sm:text-3xl">
                {post.title}
              </h1>

              <p className="text-muted-foreground flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4" />
                {t("releaseDate")}:{" "}
                {formatDate(post.publishedAt ?? post.createdAt)}
              </p>

              {post.excerpt && (
                <p className="text-foreground/90 border-primary/20 bg-primary/5 rounded-xl border p-4 text-sm leading-relaxed">
                  {post.excerpt}
                </p>
              )}

              <div className="text-foreground text-sm leading-relaxed whitespace-pre-line sm:text-base">
                {post.body}
              </div>
            </div>
          </article>

          <NewsCommentsSection
            postId={post.id}
            comments={post.comments ?? []}
            onRefresh={async () => {
              await refetch({ slug: effectiveSlug });
            }}
          />
        </div>
      )}
    </div>
  );
}
