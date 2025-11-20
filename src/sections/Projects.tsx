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
    <div className="mt-28 md:mt-30 relative max-w-[1200px] min-h-[520px] m-auto">
      <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        {t?.("projects.text")}
      </h2>

      <div className={`grid grid-cols-1 sm:grid-cols-2 gap-20 p-6 pb-20 items-center mt-10 m-auto ${className}`}>
        {items.map((item, idx) => {
          const row = Math.floor(idx / 2);
          const isEvenRow = row % 2 === 0;
          const isLeftColumn = idx % 2 === 0;
          const isLarge = (isEvenRow && isLeftColumn) || (!isEvenRow && !isLeftColumn);
          const scale = isLarge ? "scale-105" : "scale-95";

          return (
            <article
              key={`${item.id}-${idx}`}
              onClick={() => handleItemClick(item, idx)}
              className={`relative group rounded-2xl overflow-hidden transition-all duration-300 transform ${scale} hover:scale-110 hover:-translate-y-2 hover:shadow-2xl cursor-pointer`}
            >
              <div
                className={`relative w-full overflow-hidden ${
                  isLarge ? "aspect-[1.2/1] md:aspect-[5/4]" : "aspect-[0.9/1] md:aspect-[4/5]"
                }`}
              >
                <img
                  src={item.captures[1] || item.captures[0]}
                  alt={item.alt || t?.(item.titleKey) || ""}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                <h3 className="pointer-events-none absolute bottom-3 left-4 text-white text-base md:text-lg font-semibold drop-shadow opacity-0 translate-y-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0 whitespace-pre-line">
                  {t?.(item.titleKey)}
                </h3>
              </div>
            </article>
          );
        })}
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