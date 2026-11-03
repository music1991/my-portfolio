import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, BookOpen } from "lucide-react";
import { useLanguage } from "../context/Language";
import { BLOG_POSTS } from "../entities/lib/blog";

/** Home intro to the "Sobre Ingeniería" blog, shown right above the tech stack. */
export const BlogTeaser: React.FC = () => {
  const { t, localize } = useLanguage();
  const latest = BLOG_POSTS.slice(0, 3);

  return (
    <section className="max-w-6xl mx-auto mt-20 md:mt-32 px-4 md:px-6">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-8 md:p-12 shadow-sm">
        <div className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full bg-accent/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 -left-20 w-64 h-64 rounded-full bg-primary/10 blur-3xl" />

        <div className="relative grid md:grid-cols-[3fr_2fr] gap-10 items-center">
          <div>
            <p className="inline-flex items-center gap-2 font-mono text-xs tracking-widest uppercase text-accent">
              <BookOpen className="w-4 h-4" aria-hidden="true" />
              {t("blog.teaser.kicker")}
            </p>
            <h2 className="mt-3 text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {t("blog.teaser.title")}
            </h2>
            <p className="mt-4 text-foreground/80 leading-relaxed">{t("blog.teaser.text")}</p>
            <Link
              to={localize("/blog")}
              className="mt-6 inline-flex items-center gap-2 min-h-[44px] px-5 rounded-lg bg-accent text-accent-foreground font-semibold text-sm transition-all duration-300 hover:gap-3 hover:shadow-lg hover:shadow-accent/25"
            >
              {t("blog.teaser.more")}
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>

          <ul className="space-y-2">
            {latest.map((post) => (
              <li key={post.id}>
                <Link
                  to={`${localize("/blog")}#post-${post.id}`}
                  className="group flex items-start justify-between gap-3 rounded-xl border border-border bg-background/60 p-4 transition-colors hover:border-accent/60"
                >
                  <span>
                    <span className="block font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                      {t(`blog.categories.${post.category}`)}
                    </span>
                    <span className="mt-1 block text-sm font-semibold text-foreground group-hover:text-accent transition-colors">
                      {t(`blog.posts.${post.id}.title`)}
                    </span>
                  </span>
                  <ArrowUpRight
                    className="w-4 h-4 shrink-0 mt-1 text-muted-foreground group-hover:text-accent transition-colors"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};
