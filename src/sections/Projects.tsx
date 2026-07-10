import { useState } from "react";
import { useLanguage } from "../context/Language";
import type { PortfolioItem } from "../entities/lib/projects";
import ModalProject from "../components/ModalProject";

type Props = {
  items: PortfolioItem[];
  onSelect?: (item: PortfolioItem, index: number) => void;
  className?: string;
};

export default function PortfolioGrid({ items, onSelect, className = "" }: Props) {
  const { t } = useLanguage();
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleItemClick = (item: PortfolioItem, index: number) => {
    setSelectedItem(item);
    setIsModalOpen(true);
    onSelect?.(item, index);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  return (
    <div className="relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.1]"
        style={{
          backgroundImage:
            "linear-gradient(rgb(var(--color-accent) / 0.4) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--color-accent) / 0.4) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />
      <div className="relative mt-28 md:mt-30 max-w-6xl min-h-[520px] m-auto px-6">
        <p className="font-mono text-xs tracking-[0.16em] text-accent mb-3 uppercase">
          {t?.("projects.kicker")}
        </p>
        <h2 className="font-heading font-extrabold text-3xl md:text-4xl lg:text-[42px] leading-tight tracking-tight max-w-2xl mb-14">
          {t?.("projects.heading")}
        </h2>

        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-20 ${className}`}>
          {items.map((item, idx) => (
            <article
              key={`${item.id}-${idx}`}
              onClick={() => handleItemClick(item, idx)}
              onMouseMove={(e) => {
                const el = e.currentTarget;
                const r = el.getBoundingClientRect();
                const px = (e.clientX - r.left) / r.width;
                const py = (e.clientY - r.top) / r.height;
                const rx = (py - 0.5) * -6;
                const ry = (px - 0.5) * 6;
                el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0)";
              }}
              style={{ transformStyle: "preserve-3d", transition: "transform 150ms ease" }}
              className="group bg-card border border-border rounded-2xl overflow-hidden cursor-pointer hover:shadow-2xl"
            >
              <div className="relative w-full aspect-[4/3] overflow-hidden bg-black/5">
                {item.year && (
                  <span className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-md bg-black/80 text-white text-xs font-mono tracking-wide">
                    {item.year}
                  </span>
                )}
                <img
                  src={item.captures[1] || item.captures[0]}
                  alt={item.alt || t?.(item.titleKey) || ""}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="p-5">
                <h3 className="font-heading font-semibold text-base md:text-lg mb-1.5">
                  {t?.(item.titleKey)}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">
                  {t?.(item.shortDescription)}
                </p>
                <div className="flex flex-wrap gap-2">
                  {item.technologies.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 rounded-md border border-accent/40 text-accent text-xs font-mono"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <ModalProject
        item={selectedItem}
        isOpen={isModalOpen}
        onClose={closeModal}
        t={t}
      />
    </div>
  );
}
