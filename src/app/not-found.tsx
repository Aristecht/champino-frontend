import Link from "next/link";
import { Compass, Home } from "lucide-react";

export default function NotFoundPage() {
  return (
    <main className="relative min-h-[calc(100vh-8rem)] overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_25%,hsl(var(--primary)/0.18),transparent_35%),radial-gradient(circle_at_85%_10%,hsl(var(--accent)/0.15),transparent_32%),radial-gradient(circle_at_50%_95%,hsl(var(--primary)/0.12),transparent_40%)]" />

      <section className="relative container mx-auto flex min-h-[calc(100vh-8rem)] max-w-4xl flex-col items-center justify-center px-4 py-14 text-center sm:py-20">
        <span className="text-primary/70 border-primary/30 bg-primary/10 mb-5 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase">
          <Compass className="h-3.5 w-3.5" />
          Маршрут не найден
        </span>

        <h1 className="text-foreground text-6xl leading-none font-black tracking-tight sm:text-7xl">
          404
        </h1>
        <p className="text-foreground mt-4 text-2xl font-semibold sm:text-3xl">
          Страница потерялась
        </p>
        <p className="text-muted-foreground mt-3 max-w-xl text-sm leading-7 sm:text-base">
          Похоже, ссылка устарела или адрес введен с ошибкой. Вернитесь на
          главную и продолжите покупки.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-colors"
          >
            <Home className="h-4 w-4" />
            На главную
          </Link>
          <Link
            href="/catalog?root=1"
            className="border-border hover:bg-accent inline-flex items-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold transition-colors"
          >
            Перейти в каталог
          </Link>
        </div>
      </section>
    </main>
  );
}