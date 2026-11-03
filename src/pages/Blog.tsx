import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BrainCircuit,
  Calendar,
  Clock,
  Code,
  Construction,
  GripHorizontal,
  Layers,
  Star,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { useLanguage } from "../context/Language";
import AboutSidebar, { type SidebarItem } from "../components/AboutSidebar";
import { BLOG_CATEGORIES, BLOG_POSTS, type BlogCategory, type BlogPost } from "../entities/lib/blog";

/** Static class strings per category, so Tailwind keeps them in the build. */
const CATEGORY_STYLE: Record<BlogCategory, { icon: LucideIcon; cover: string; text: string; pill: string }> = {
  architecture: {
    icon: Layers,
    cover: "from-indigo-500/25 via-sky-500/10 to-transparent",
    text: "text-indigo-500",
    pill: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
  },
  ai: {
    icon: BrainCircuit,
    cover: "from-violet-500/25 via-fuchsia-500/10 to-transparent",
    text: "text-violet-500",
    pill: "bg-violet-500/10 text-violet-500 border-violet-500/20",
  },
  frontend: {
    icon: Code,
    cover: "from-sky-500/25 via-cyan-400/10 to-transparent",
    text: "text-sky-500",
    pill: "bg-sky-500/10 text-sky-500 border-sky-500/20",
  },
  practice: {
    icon: Users,
    cover: "from-emerald-500/25 via-teal-400/10 to-transparent",
    text: "text-emerald-500",
    pill: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  },
};

const postAnchor = (id: string) => `post-${id}`;

const Cover: React.FC<{ category: BlogCategory; label: string; large?: boolean }> = ({ category, label, large }) => {
  const style = CATEGORY_STYLE[category];
  const Icon = style.icon;
  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br ${style.cover} ${large ? "h-52 md:h-full min-h-[13rem]" : "h-36"}`}
    >
      {/* Dot grid */}
      <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(rgb(var(--color-foreground)/0.18)_1px,transparent_1px)] [background-size:16px_16px] [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      <Icon
        className={`absolute -right-4 -bottom-6 ${large ? "w-44 h-44" : "w-28 h-28"} ${style.text} opacity-20 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110`}
        strokeWidth={1.25}
        aria-hidden="true"
      />
      <span className={`absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold backdrop-blur-sm ${style.pill}`}>
        <Icon className="w-3.5 h-3.5" aria-hidden="true" />
        {label}
      </span>
    </div>
  );
};

type FormatDate = (iso: string) => string;

const PostMeta: React.FC<{ post: BlogPost; formatDate: FormatDate }> = ({ post, formatDate }) => {
  const { t } = useLanguage();
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground font-mono">
      <span className="inline-flex items-center gap-1.5">
        <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
        <time dateTime={post.date}>{formatDate(post.date)}</time>
      </span>
      <span className="inline-flex items-center gap-1.5">
        <Clock className="w-3.5 h-3.5" aria-hidden="true" />
        {t("blog.readTime").replace("{minutes}", String(post.readMinutes))}
      </span>
    </div>
  );
};

/**
 * Grid card. Every card in a row has the same height (grid stretch + clamped title/excerpt);
 * the full article opens in <PostModal /> so the grid never changes size.
 */
const PostCard: React.FC<{ post: BlogPost; featured?: boolean; formatDate: FormatDate; onOpen: () => void }> = ({
  post,
  featured,
  formatDate,
  onOpen,
}) => {
  const { t } = useLanguage();
  const base = `blog.posts.${post.id}`;

  return (
    <article
      id={postAnchor(post.id)}
      className={`group h-full scroll-mt-24 overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:shadow-lg hover:border-accent/50 hover:-translate-y-0.5 ${
        featured ? "md:grid md:grid-cols-[2fr_3fr]" : "flex flex-col"
      }`}
    >
      <Cover category={post.category} label={t(`blog.categories.${post.category}`)} large={featured} />

      <div className={`flex flex-col flex-1 ${featured ? "p-6 md:p-10" : "p-6"}`}>
        <PostMeta post={post} formatDate={formatDate} />

        <h3
          className={`mt-3 font-bold text-card-foreground leading-snug transition-colors group-hover:text-accent ${
            featured ? "text-2xl md:text-3xl" : "text-lg line-clamp-2 min-h-[2.75em]"
          }`}
        >
          {t(`${base}.title`)}
        </h3>
        <p className={`mt-3 text-muted-foreground leading-relaxed ${featured ? "md:text-lg" : "text-sm line-clamp-3"}`}>
          {t(`${base}.excerpt`)}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span key={tag} className="px-2.5 py-0.5 text-xs text-accent rounded-full border border-border">
              #{tag}
            </span>
          ))}
        </div>

        <button
          type="button"
          onClick={onOpen}
          aria-haspopup="dialog"
          className="mt-auto pt-6 self-start inline-flex items-center gap-2 min-h-[44px] text-sm font-semibold text-foreground hover:text-accent transition-all duration-300 hover:gap-3 cursor-pointer"
        >
          {t("blog.readMore")}
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </article>
  );
};

const PostModal: React.FC<{ post: BlogPost | null; formatDate: FormatDate; onClose: () => void }> = ({
  post,
  formatDate,
  onClose,
}) => {
  const { t } = useLanguage();

  useEffect(() => {
    if (!post) return;
    document.body.style.overflow = "hidden";
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = "unset";
      document.removeEventListener("keydown", handleEscape);
    };
  }, [post, onClose]);

  return (
    <AnimatePresence>
      {post && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.article
            role="dialog"
            aria-modal="true"
            aria-labelledby="blog-modal-title"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-card shadow-2xl"
          >
            <Cover category={post.category} label={t(`blog.categories.${post.category}`)} />
            <button
              type="button"
              onClick={onClose}
              aria-label={t("blog.readLess")}
              title={t("blog.readLess")}
              className="absolute top-3 right-3 grid place-items-center w-10 h-10 rounded-full bg-card/80 backdrop-blur-md border border-border text-foreground hover:text-accent transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>

            <div className="p-6 md:p-10">
              <PostMeta post={post} formatDate={formatDate} />
              <h2 id="blog-modal-title" className="mt-3 text-2xl md:text-3xl font-bold text-card-foreground leading-snug">
                {t(`blog.posts.${post.id}.title`)}
              </h2>
              <div className="mt-6 space-y-4 text-foreground/90 leading-relaxed">
                {t(`blog.posts.${post.id}.body`)
                  .split("\n")
                  .filter((p) => p.trim().length > 0)
                  .map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span key={tag} className="px-2.5 py-0.5 text-xs text-accent rounded-full border border-border">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.article>
        </div>
      )}
    </AnimatePresence>
  );
};

/**
 * Floating "under construction" window: always on screen, no close button,
 * it can only be dragged around (kept inside the viewport).
 */
const ConstructionNotice: React.FC = () => {
  const { t } = useLanguage();
  const boundsRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={boundsRef} className="fixed inset-x-0 top-20 bottom-0 z-[55] pointer-events-none">
      <motion.div
        role="status"
        drag
        dragConstraints={boundsRef}
        dragMomentum={false}
        dragElastic={0.05}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut", delay: 0.3 }}
        whileDrag={{ scale: 1.02 }}
        className="pointer-events-auto absolute bottom-6 left-4 sm:left-6 w-[calc(100%-2rem)] max-w-lg overflow-hidden rounded-3xl border-2 border-amber-500/50 bg-card/95 backdrop-blur-md shadow-2xl cursor-grab active:cursor-grabbing touch-none select-none"
      >
        <div className="flex items-center gap-3 px-6 py-3 border-b border-amber-500/30 bg-amber-500/15 [background-image:repeating-linear-gradient(-45deg,transparent_0_10px,rgb(245_158_11/0.12)_10px_20px)]">
          <GripHorizontal className="w-5 h-5 text-amber-500" aria-hidden="true" />
          <span className="font-mono text-sm font-semibold tracking-widest uppercase text-amber-500">
            {t("blog.construction.badge")}
          </span>
        </div>
        <div className="flex items-start gap-5 p-6 md:p-8">
          <div className="grid place-items-center w-16 h-16 shrink-0 rounded-2xl bg-amber-500/15 text-amber-500">
            <Construction className="w-9 h-9" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xl md:text-2xl font-bold text-foreground">{t("blog.construction.title")}</p>
            <p className="mt-2 text-base text-muted-foreground leading-relaxed">{t("blog.construction.text")}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const BlogPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { hash } = useLocation();

  // Links like /blog#post-<id> (from the home teaser): the SPA navigation doesn't scroll by itself
  useEffect(() => {
    if (!hash) return;
    const el = document.getElementById(decodeURIComponent(hash.slice(1)));
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [hash]);

  const formatDate = useMemo(() => {
    const fmt = new Intl.DateTimeFormat(language === "es" ? "es-AR" : "en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    });
    return (iso: string) => fmt.format(new Date(iso));
  }, [language]);

  const featured = BLOG_POSTS.find((p) => p.featured);
  const [openPost, setOpenPost] = useState<BlogPost | null>(null);
  const closePost = useCallback(() => setOpenPost(null), []);

  const groups = useMemo(
    () =>
      BLOG_CATEGORIES.map((category) => ({
        category,
        posts: BLOG_POSTS.filter((p) => p.category === category && p !== featured),
      })).filter((g) => g.posts.length > 0),
    [featured]
  );

  const [sidebarOpen, setSidebarOpen] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches
  );

  const sidebarItems = useMemo<SidebarItem[]>(
    () => [
      ...(featured
        ? [{
            id: "featured",
            label: t("blog.featured"),
            children: [{ id: postAnchor(featured.id), label: t(`blog.posts.${featured.id}.title`) }],
          }]
        : []),
      ...groups.map((g) => ({
        id: `category-${g.category}`,
        label: t(`blog.categories.${g.category}`),
        children: g.posts.map((p) => ({ id: postAnchor(p.id), label: t(`blog.posts.${p.id}.title`) })),
      })),
    ],
    [t, featured, groups]
  );

  return (
    <main className="min-h-screen bg-background text-foreground font-sans">
      <header className="relative overflow-hidden text-center pt-32 pb-14 px-6 bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-md">
        <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(currentColor_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
        <div className="relative">
          <p className="font-mono text-xs tracking-[0.3em] uppercase opacity-80">{t("blog.kicker")}</p>
          <h1 className="mt-3 text-4xl md:text-5xl font-bold">{t("blog.title")}</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg opacity-90">{t("blog.subtitle")}</p>
          <p className="mt-4 font-mono text-xs opacity-70">
            {t("blog.count").replace("{count}", String(BLOG_POSTS.length))}
          </p>
        </div>
      </header>

      <AboutSidebar items={sidebarItems} open={sidebarOpen} onToggle={() => setSidebarOpen((o) => !o)} />

      <div className={`transition-[padding] duration-300 ease-out ${sidebarOpen ? "lg:pr-64" : ""}`}>
        <div className="max-w-5xl mx-auto px-6 md:px-10 py-20 space-y-20">
          {featured && (
            <section id="featured" className="scroll-mt-20">
              <div className="flex items-center gap-3 mb-6">
                <Star className="w-7 h-7 text-accent" aria-hidden="true" />
                <h2 className="text-2xl font-semibold text-foreground">{t("blog.featured")}</h2>
              </div>
              <PostCard post={featured} featured formatDate={formatDate} onOpen={() => setOpenPost(featured)} />
            </section>
          )}

          {groups.map(({ category, posts }) => {
            const Icon = CATEGORY_STYLE[category].icon;
            return (
              <section key={category} id={`category-${category}`} className="scroll-mt-20">
                <div className="flex items-center gap-3 mb-6">
                  <Icon className={`w-7 h-7 ${CATEGORY_STYLE[category].text}`} aria-hidden="true" />
                  <h2 className="text-2xl font-semibold text-foreground">{t(`blog.categories.${category}`)}</h2>
                </div>
                <div className="grid sm:grid-cols-2 gap-6">
                  {posts.map((post) => (
                    <PostCard key={post.id} post={post} formatDate={formatDate} onOpen={() => setOpenPost(post)} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>

      <PostModal post={openPost} formatDate={formatDate} onClose={closePost} />
      <ConstructionNotice />
    </main>
  );
};

export default BlogPage;
