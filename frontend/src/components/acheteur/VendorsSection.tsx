import React from "react";
import { MapPin } from "lucide-react";
import type { VendorSummary } from "../../utils/catalog";

interface VendorsSectionProps {
  vendors: VendorSummary[];
}

const VendorsSection: React.FC<VendorsSectionProps> = ({ vendors }) => {
  if (vendors.length === 0) return null;

  return (
    <section>
      <h2 className="text-lg font-bold mb-4">Fournisseurs à la une</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {vendors.map((v) => (
          <div
            key={v.nom}
            className="rounded-2xl border border-[#1e293b]/10 bg-white p-4 flex items-center gap-3 hover:border-[#42b883]/40 transition-colors cursor-pointer"
          >
            <div className="h-11 w-11 shrink-0 rounded-full bg-[#1e293b] text-white flex items-center justify-center font-semibold">
              {v.nom.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">{v.nom}</p>
              <p className="text-xs text-[#1e293b]/45 flex items-center gap-1">
                <MapPin size={11} /> {v.type.toLowerCase()} · {v.produits} produits
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default VendorsSection;