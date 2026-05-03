"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Pencil, Star, Trash2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { cn } from "@/utils/tw-merge";
import { pluralize } from "@/utils/pluralize";

const REVIEWS_PAGE_SIZE = 15;

interface ReviewItem {
  id: string;
  userId: string;
  rating: number;
  title?: string | null;
  text?: string | null;
  isVerified: boolean;
  createdAt: string;
}

interface ProductReviewsSectionProps {
  reviews: ReviewItem[];
  avgRating: number;
  total: number;
  loading: boolean;
  canWriteReview: boolean;
  canModerateReviews: boolean;
  creatingReview: boolean;
  deletingReview: boolean;
  currentUserId?: string;
  usernameByUserId?: Record<string, string>;
  onCreateReview: (payload: {
    rating: number;
    title: string;
    text: string;
  }) => void;
  onDeleteReview: (reviewId: string) => void;
}

function StarRow({
  value,
  size = "sm",
}: {
  value: number;
  size?: "sm" | "md" | "lg";
}) {
  const sz = size === "lg" ? "h-6 w-6" : size === "md" ? "h-5 w-5" : "h-4 w-4";
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            sz,
            i < value
              ? "fill-amber-400 text-amber-400"
              : "fill-muted text-muted-foreground/20"
          )}
        />
      ))}
    </div>
  );
}

function AvatarCircle({ name }: { name: string }) {
  const colors = [
    "bg-violet-500",
    "bg-sky-500",
    "bg-emerald-500",
    "bg-rose-500",
    "bg-amber-500",
    "bg-indigo-500",
  ];
  const idx = name.charCodeAt(0) % colors.length;
  const initials = name.slice(0, 1).toUpperCase();
  return (
    <div
      className={cn(
        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white",
        colors[idx]
      )}
    >
      {initials}
    </div>
  );
}

export function ProductReviewsSection({
  reviews,
  avgRating,
  total,
  loading,
  canWriteReview,
  canModerateReviews,
  creatingReview,
  deletingReview,
  currentUserId,
  usernameByUserId,
  onCreateReview,
  onDeleteReview,
}: ProductReviewsSectionProps) {
  const locale = useLocale();
  const t = useTranslations("product.reviews");
  const reviewsKey = useMemo(
    () => reviews.map((review) => review.id).join("|"),
    [reviews]
  );
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [reviewWindow, setReviewWindow] = useState({
    key: "",
    count: REVIEWS_PAGE_SIZE,
  });
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const authorMap = useMemo(() => usernameByUserId ?? {}, [usernameByUserId]);
  const visibleCount =
    reviewWindow.key === reviewsKey ? reviewWindow.count : REVIEWS_PAGE_SIZE;
  const visibleReviews = reviews.slice(0, visibleCount);
  const hasMoreReviews = visibleCount < reviews.length;

  useEffect(() => {
    const node = loadMoreRef.current;
    if (!node || !hasMoreReviews || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setReviewWindow((prev) => {
            const currentCount =
              prev.key === reviewsKey ? prev.count : REVIEWS_PAGE_SIZE;
            return {
              key: reviewsKey,
              count: Math.min(currentCount + REVIEWS_PAGE_SIZE, reviews.length),
            };
          });
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMoreReviews, loading, reviews.length, reviewsKey]);

  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-center gap-3 rounded-2xl px-4 py-3 sm:px-5">
        <h2 className="text-foreground text-base font-semibold sm:text-lg">
          {t("title")}
        </h2>
        <div className="flex items-center gap-2">
          <div className="bg-muted/70 inline-flex items-center gap-1.5 rounded-full px-3 py-1">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="text-foreground text-sm font-semibold">
              {avgRating.toFixed(1)}
            </span>
          </div>
          <span className="text-muted-foreground text-sm">
            {total} {pluralize(total, t("one"), t("few"), t("many"))}
          </span>
        </div>
      </div>

      {canWriteReview && (
        <div className="bg-card border-border rounded-2xl border p-4 sm:p-5">
          {!formOpen ? (
            <button
              type="button"
              onClick={() => setFormOpen(true)}
              className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex w-full items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors sm:w-64"
            >
              <Pencil className="h-4 w-4" /> {t("write")}
            </button>
          ) : (
            <div className="space-y-4">
              <p className="text-foreground text-sm font-semibold">
                {t("yourRating")}
              </p>

              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => {
                  const score = i + 1;
                  const filled = score <= (hoverRating || rating);
                  return (
                    <button
                      key={score}
                      type="button"
                      onClick={() => setRating(score)}
                      onMouseEnter={() => setHoverRating(score)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="rounded p-0.5 transition-transform hover:scale-110"
                    >
                      <Star
                        className={cn(
                          "h-7 w-7 transition-colors",
                          filled
                            ? "fill-amber-400 text-amber-400"
                            : "fill-muted text-muted-foreground/30"
                        )}
                      />
                    </button>
                  );
                })}
                <span className="text-muted-foreground ml-2 text-sm">
                  {
                    [
                      "",
                      t("ratingBad"),
                      t("ratingNotBad"),
                      t("ratingNormal"),
                      t("ratingGood"),
                      t("ratingGreat"),
                    ][hoverRating || rating]
                  }
                </span>
              </div>

              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t("titlePlaceholder")}
                className="border-input bg-background text-foreground focus:ring-primary w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:ring-2"
              />
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={t("textPlaceholder")}
                rows={4}
                className="border-input bg-background text-foreground focus:ring-primary w-full resize-none rounded-xl border px-4 py-2.5 text-sm outline-none focus:ring-2"
              />

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    onCreateReview({ rating, title, text });
                    setTitle("");
                    setText("");
                    setRating(5);
                    setFormOpen(false);
                  }}
                  disabled={creatingReview}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-5 py-2.5 text-sm font-semibold disabled:opacity-50"
                >
                  {creatingReview ? t("sending") : t("publish")}
                </button>
                <button
                  type="button"
                  onClick={() => setFormOpen(false)}
                  className="border-border hover:bg-muted rounded-xl border px-4 py-2.5 text-sm font-medium"
                >
                  {t("cancel")}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── Review cards ─── */}
      <div className="space-y-3">
        {loading ? (
          Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="bg-muted h-28 animate-pulse rounded-2xl" />
          ))
        ) : reviews.length === 0 ? (
          <div className="bg-card border-border flex flex-col items-center gap-2 rounded-2xl border py-10">
            <Star className="text-muted-foreground/30 h-10 w-10" />
            <p className="text-muted-foreground text-sm">{t("empty")}</p>
          </div>
        ) : (
          visibleReviews.map((r) => {
            const author =
              r.userId === currentUserId
                ? t("you")
                : (authorMap[r.userId] ??
                  `${t("user")} ${r.userId.slice(0, 6)}`);

            return (
              <div
                key={r.id}
                className="bg-card border-border rounded-2xl border p-4 transition-shadow hover:shadow-sm sm:p-5"
              >
                <div className="flex items-start gap-3">
                  <AvatarCircle name={author} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-0.5">
                      <span className="text-foreground text-sm font-semibold">
                        {author}
                      </span>
                      <StarRow value={r.rating} size="sm" />
                    </div>
                    <span className="text-muted-foreground text-xs">
                      {new Date(r.createdAt).toLocaleDateString(locale, {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                    <div className="mt-1 flex items-center gap-2"></div>
                  </div>
                  {canModerateReviews && (
                    <button
                      type="button"
                      onClick={() => onDeleteReview(r.id)}
                      disabled={deletingReview}
                      className="text-muted-foreground/50 hover:text-destructive ml-1 shrink-0 transition-colors disabled:opacity-40"
                      aria-label={t("delete")}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {(r.title || r.text) && (
                  <div className="mt-2 space-y-1 pl-12">
                    {r.title && (
                      <p className="text-foreground text-sm font-semibold">
                        {r.title}
                      </p>
                    )}
                    {r.text && (
                      <p className="text-foreground text-sm leading-relaxed">
                        {r.text}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {hasMoreReviews && !loading && (
        <>
          <div ref={loadMoreRef} className="h-1" />
          <div className="space-y-3">
            {Array.from({
              length: Math.min(2, reviews.length - visibleReviews.length),
            }).map((_, index) => (
              <div
                key={index}
                className="bg-muted h-28 animate-pulse rounded-2xl"
              />
            ))}
          </div>
        </>
      )}

      {!canWriteReview && !canModerateReviews && (
        <p className="text-muted-foreground text-center text-sm">
          {t("onlyBuyers")}
        </p>
      )}
    </section>
  );
}
