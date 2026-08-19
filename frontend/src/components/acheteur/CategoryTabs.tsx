import React from "react";
import { SlidersHorizontal } from "lucide-react";

interface CategoryTabsProps {
  categories: string[];
  activeCategory: string;
  onChange: (category: string) => void;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({ categories, activeCategory, onChange }) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${
            activeCategory === cat
              ? "bg-[#1e293b] text-white"
              : "bg-white border border-[#1e293b]/10 text-[#1e293b]/60 hover:border-[#42b883]/40 hover:text-[#42b883]"
          }`}
        >
          {cat}
        </button>
      ))}
      <button className="shrink-0 ml-auto flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border border-[#1e293b]/10 bg-white text-[#1e293b]/60 hover:border-[#42b883]/40 hover:text-[#42b883] transition-colors cursor-pointer">
        <SlidersHorizontal size={14} /> Filtres
      </button>
    </div>
  );
};

export default CategoryTabs;