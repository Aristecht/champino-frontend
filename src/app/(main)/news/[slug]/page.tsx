import { NewsPostPageClient } from "@/components/features/news/NewsPostPageClient";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ slug?: string }>;
}

export default async function NewsPostPage({ params, searchParams }: Props) {
  const { slug: postId } = await params;
  const { slug } = await searchParams;

  return <NewsPostPageClient postId={postId} slug={slug ?? ""} />;
}
