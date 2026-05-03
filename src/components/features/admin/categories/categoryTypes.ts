export const INPUT_CLS =
  "border-input bg-background text-foreground placeholder:text-muted-foreground w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20";

export const SELECT_CLS =
  "border-input bg-background text-foreground w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20";

export type CatForm = { name: string; slug: string; parentId: string };
export const EMPTY_FORM: CatForm = { name: "", slug: "", parentId: "" };

export type EditTarget = {
  id: string;
  name: string;
  slug?: string | null;
  parentId?: string | null;
  imageUrl?: string | null;
  isRoot: boolean;
};

export type RootCat = {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string | null;
  parentId?: string | null;
  createdAt: string;
  children?: SubCat[] | null;
};

export type SubCat = {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string | null;
  createdAt: string;
};

export function fmtDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
