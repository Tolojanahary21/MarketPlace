import React from "react";
import { ShoppingBag } from "lucide-react";
import type { Product } from "../../api/products";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  title: string;
  products: Product[];
  page: number;
  totalPages: number;
  loadingMore: boolean;
  onLoadMore: () => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  title,
  products,
  page,
  totalPages,
  loadingMore,
  onLoadMore,
}) => {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">
          {title}
          <span className="text-[#1e293b]/40 font-normal text-sm ml-2">({products.length})</span>
        </h2>
      </div>

      {products.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          {page < totalPages && (
            <div className="flex justify-center mt-8">
              <button
                onClick={onLoadMore}
                disabled={loadingMore}
                className="px-6 py-2.5 rounded-lg border border-[#1e293b]/15 bg-white text-sm font-semibold text-[#1e293b] hover:border-[#42b883]/40 hover:text-[#42b883] transition-colors cursor-pointer disabled:opacity-50"
              >
                {loadingMore ? "Chargement..." : "Voir plus de produits"}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="rounded-2xl border border-dashed border-[#1e293b]/15 py-16 text-center text-[#1e293b]/40">
          <ShoppingBag size={28} className="mx-auto mb-3 opacity-40" />
          Aucun produit ne correspond à votre recherche.
        </div>
      )}
    </section>
  );
};

export default ProductGrid;