import React, { useState } from "react";
import { Heart, Store, Package, Clock } from "lucide-react";
import { formatPrice, UOM_LABEL, type Product } from "../../api/products";

const PALETTE = ["#42b883", "#1e293b", "#8a6420", "#5fd3a0", "#3aa876"];
function visualColor(id: number) {
  return PALETTE[id % PALETTE.length];
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [liked, setLiked] = useState(false);
  const color = visualColor(product.id);
  const primaryImage = product.images?.find((img) => img.isPrimary) ?? product.images?.[0];

  return (
    <div className="group relative rounded-2xl border border-[#1e293b]/10 bg-white overflow-hidden hover:shadow-[0_8px_30px_rgba(30,41,59,0.08)] hover:-translate-y-1 transition-all duration-300">
      <div
        className="relative h-40 flex items-center justify-center overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${color}22, ${color}08)` }}
      >
        {primaryImage ? (
          <img
            src={primaryImage.url}
            alt={primaryImage.altText ?? product.nom}
            className="h-full w-full object-cover"
          />
        ) : (
          <div
            className="w-16 h-16 rounded-xl opacity-80 group-hover:scale-110 transition-transform duration-300"
            style={{ background: color }}
          />
        )}

        {product.statut === "RUPTURE" && (
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide uppercase bg-red-500/10 text-red-600">
            Rupture
          </span>
        )}

        <button
          onClick={() => setLiked((v) => !v)}
          className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors cursor-pointer"
          aria-label="Ajouter aux favoris"
        >
          <Heart size={15} className={liked ? "fill-red-500 text-red-500" : "text-[#1e293b]/40"} />
        </button>
      </div>

      <div className="p-4">
        <h3 className="text-sm font-semibold text-[#1e293b] leading-snug mb-1">{product.nom}</h3>

        <p className="text-xs text-[#1e293b]/50 mb-2 flex items-center gap-1">
          <Store size={11} /> {product.supplier.displayName}
        </p>

        <div className="flex items-center gap-3 mb-3 text-[11px] text-[#1e293b]/50">
          {product.moq != null && (
            <span className="inline-flex items-center gap-1">
              <Package size={11} /> MOQ {product.moq} {UOM_LABEL[product.uom]}
            </span>
          )}
          {product.leadTime != null && (
            <span className="inline-flex items-center gap-1">
              <Clock size={11} /> {product.leadTime}j
            </span>
          )}
        </div>

        <div className="flex items-end justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-[10px] text-[#1e293b]/40 uppercase mr-1">à partir de</span>
            <span className="text-base font-bold text-[#1e293b]">{formatPrice(product.basePrice)} €</span>
          </div>
          <button className="rounded-lg bg-[#1e293b] text-white text-xs font-medium px-3 py-2 hover:bg-[#42b883] transition-colors cursor-pointer">
            Demander un devis
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;