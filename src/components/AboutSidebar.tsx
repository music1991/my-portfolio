import { useEffect, useState } from "react";
import { PanelLeft } from "lucide-react";
import { useLanguage } from "../context/Language";

export type SidebarItem = {
  id: string;
  label: string;
  children?: { id: string; label: string }[];
};

type Props = {
  items: SidebarItem[];
  open: boolean;
  onToggle: () => void;
};

const LG_QUERY = "(min-width: 1024px)";

/**
 * Right-side "on this page" navigation for the About page. Highlights the
 * section currently in view and scrolls smoothly to the selected one.
 */
export default function AboutSidebar({ items, open, onToggle }: Props) {
  const { t } = useLanguage();
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? "");

  // Depend on the ids (not the items array) so the observer is not recreated on every render
  const idsKey = items
    .flatMap((item) => [item.id, ...(item.children?.map((c) => c.id) ?? [])])
    .join(",");

  useEffect(() => {
    const elements = idsKey
      .split(",")
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-90px 0px -60% 0px" }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [idsKey]);

  const goTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    // On small screens the panel covers the content, so close it after navigating
    if (!window.matchMedia(LG_QUERY).matches && open) onToggle();
  };

  const isActiveSection = (item: SidebarItem) =>
    activeId === item.id || item.children?.some((c) => c.id === activeId);

  return (
    <>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls="about-sidebar"
        aria-label={open ? t("profile.nav.close") : t("profile.nav.open")}
        title={open ? t("profile.nav.close") : t("profile.nav.open")}
        className="fixed top-24 right-4 z-40 flex items-center justify-center w-11 h-11 rounded-lg border border-border bg-card/90 backdrop-blur-md text-foreground hover:text-accent hover:border-accent/60 transition-colors cursor-pointer shadow-sm"
      >
        <PanelLeft className="w-5 h-5" aria-hidden="true" />
      </button>

      <aside
        id="about-sidebar"
        aria-label={t("profile.nav.title")}
        aria-hidden={!open}
        className={`fixed top-24 right-4 z-30 w-60 max-h-[calc(100vh-7rem)] overflow-y-auto rounded-xl border border-border bg-card/95 backdrop-blur-md shadow-lg transition-all duration-300 ease-out ${
          open ? "opacity-100 translate-x-0" : "opacity-0 translate-x-[110%] pointer-events-none"
        }`}
      >
        <nav className="pt-16 pb-4 px-3">
          <p className="px-3 mb-3 font-mono text-xs tracking-widest uppercase text-muted-foreground">
            {t("profile.nav.title")}
          </p>
          <ul className="space-y-1">
            {items.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  tabIndex={open ? 0 : -1}
                  onClick={() => goTo(item.id)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm font-semibold border-l-2 transition-colors cursor-pointer ${
                    isActiveSection(item)
                      ? "border-accent text-accent bg-accent/10"
                      : "border-transparent text-foreground hover:text-accent hover:bg-foreground/5"
                  }`}
                >
                  {item.label}
                </button>
                {item.children && item.children.length > 0 && (
                  <ul className="mt-1 ml-4 border-l border-border">
                    {item.children.map((child) => (
                      <li key={child.id}>
                        <button
                          type="button"
                          tabIndex={open ? 0 : -1}
                          onClick={() => goTo(child.id)}
                          className={`w-full text-left pl-3 pr-2 py-1.5 text-[13px] leading-snug transition-colors cursor-pointer ${
                            activeId === child.id
                              ? "text-accent font-medium"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {child.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}
