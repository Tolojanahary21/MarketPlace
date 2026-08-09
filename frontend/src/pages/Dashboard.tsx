import React, { useState, useMemo } from "react";
import {
  Search,
  Bell,
  ChevronDown,
  Heart,
  Star,
  MapPin,
  SlidersHorizontal,
  ShoppingBag,
  Store,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
// ----------------------------- Types ----------------------------------------

type Category = "Tous" | "Artisanat" | "Mode" | "Maison" | "Beauté" | "Technologie";

interface Product {
  id: string;
  nom: string;
  vendeur: string;
  prix: number;
  ancienPrix?: number;
  note: number;
  avis: number;
  ville: string;
  categorie: Exclude<Category, "Tous">;
  badge?: "Nouveau" | "Populaire" | "Promo";
  couleurVisuel: string;
}

interface Vendor {
  nom: string;
  ville: string;
  produits: number;
  note: number;
  initiale: string;
}

// ----------------------------- Mock data -------------------------------------

const products: Product[] = [
  { id: "p1", nom: "Panier tressé raphia", vendeur: "Atelier Nomade", prix: 24.9, note: 4.8, avis: 132, ville: "Antananarivo", categorie: "Artisanat", badge: "Populaire", couleurVisuel: "#42b883" },
  { id: "p2", nom: "Chemise lin délavé", vendeur: "Kolab Studio", prix: 39.0, ancienPrix: 52.0, note: 4.6, avis: 87, ville: "Fianarantsoa", categorie: "Mode", badge: "Promo", couleurVisuel: "#1e293b" },
  { id: "p3", nom: "Vase en bois d'ébène", vendeur: "Terre & Bois", prix: 68.5, note: 4.9, avis: 54, ville: "Antananarivo", categorie: "Maison", couleurVisuel: "#8a6420" },
  { id: "p4", nom: "Savon vanille-coco", vendeur: "Maison Verre", prix: 8.5, note: 4.7, avis: 201, ville: "Toamasina", categorie: "Beauté", badge: "Nouveau", couleurVisuel: "#5fd3a0" },
  { id: "p5", nom: "Casque audio bluetooth", vendeur: "Digital Hub", prix: 45.0, note: 4.3, avis: 39, ville: "Antananarivo", categorie: "Technologie", couleurVisuel: "#3aa876" },
  { id: "p6", nom: "Sac en cuir naturel", vendeur: "Atelier Nomade", prix: 89.0, note: 4.9, avis: 176, ville: "Antananarivo", categorie: "Mode", badge: "Populaire", couleurVisuel: "#1e293b" },
  { id: "p7", nom: "Tapis en fibres naturelles", vendeur: "Terre & Bois", prix: 112.0, ancienPrix: 140.0, note: 4.5, avis: 28, ville: "Fianarantsoa", categorie: "Maison", badge: "Promo", couleurVisuel: "#42b883" },
  { id: "p8", nom: "Huile essentielle ylang-ylang", vendeur: "Maison Verre", prix: 14.9, note: 4.8, avis: 95, ville: "Toamasina", categorie: "Beauté", couleurVisuel: "#8a6420" },
];

const vendors: Vendor[] = [
  { nom: "Atelier Nomade", ville: "Antananarivo", produits: 42, note: 4.9, initiale: "A" },
  { nom: "Kolab Studio", ville: "Fianarantsoa", produits: 27, note: 4.7, initiale: "K" },
  { nom: "Terre & Bois", ville: "Antananarivo", produits: 18, note: 4.8, initiale: "T" },
  { nom: "Maison Verre", ville: "Toamasina", produits: 33, note: 4.6, initiale: "M" },
];

const categories: Category[] = ["Tous", "Artisanat", "Mode", "Maison", "Beauté", "Technologie"];

// ----------------------------- Sub-components ---------------------------------

const StarRating: React.FC<{ note: number }> = ({ note }) => (
  <span className="inline-flex items-center gap-1 text-xs text-[#1e293b]/60">
    <Star size={12} className="fill-[#42b883] text-[#42b883]" />
    <span className="font-medium text-[#1e293b]">{note.toFixed(1)}</span>
  </span>
);

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const [liked, setLiked] = useState(false);

  return (
    <div className="group relative rounded-2xl border border-[#1e293b]/10 bg-white overflow-hidden hover:shadow-[0_8px_30px_rgba(30,41,59,0.08)] hover:-translate-y-1 transition-all duration-300">
      {/* Visuel produit */}
      <div
        className="relative h-40 flex items-center justify-center overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${product.couleurVisuel}22, ${product.couleurVisuel}08)` }}
      >
        <div
          className="w-16 h-16 rounded-xl opacity-80 group-hover:scale-110 transition-transform duration-300"
          style={{ background: product.couleurVisuel }}
        />

        {product.badge && (
          <span
            className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide uppercase ${
              product.badge === "Promo"
                ? "bg-red-500/10 text-red-600"
                : product.badge === "Nouveau"
                ? "bg-[#42b883]/15 text-[#3aa876]"
                : "bg-[#1e293b]/10 text-[#1e293b]"
            }`}
          >
            {product.badge}
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

      {/* Infos */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-sm font-semibold text-[#1e293b] leading-snug">{product.nom}</h3>
        </div>
        <p className="text-xs text-[#1e293b]/50 mb-2 flex items-center gap-1">
          <Store size={11} /> {product.vendeur}
        </p>

        <div className="flex items-center justify-between mb-3">
          <StarRating note={product.note} />
          <span className="text-[11px] text-[#1e293b]/40">({product.avis} avis)</span>
        </div>

        <div className="flex items-end justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-bold text-[#1e293b]">{product.prix.toFixed(2)} €</span>
            {product.ancienPrix && (
              <span className="text-xs text-[#1e293b]/35 line-through">{product.ancienPrix.toFixed(2)} €</span>
            )}
          </div>
          <button className="rounded-lg bg-[#1e293b] text-white text-xs font-medium px-3 py-2 hover:bg-[#42b883] transition-colors cursor-pointer">
            Ajouter
          </button>
        </div>
      </div>
    </div>
  );
};

// ----------------------------- Main component ---------------------------------

const MarketplaceCatalog: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<Category>("Tous");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchCategory = activeCategory === "Tous" || p.categorie === activeCategory;
      const matchQuery =
        query.trim() === "" ||
        p.nom.toLowerCase().includes(query.toLowerCase()) ||
        p.vendeur.toLowerCase().includes(query.toLowerCase());
      return matchCategory && matchQuery;
    });
  }, [activeCategory, query]);

  return (
    <div className="min-h-screen w-full bg-[#F7F8F5] text-[#1e293b]">

      {/* ---------------------------- Navbar ---------------------------- */}
      <nav className="sticky top-0 z-30 w-full px-6 py-4 flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-[#1e293b]/10">
      {/* Titre */}
        <div className="flex items-center ml-20 gap-10">
          <span className="text-4xl font-extrabold tracking-tight cursor-pointer">
            <span className="text-[#1e293b]">Market</span>
            <span className="text-[#42b883]">Place</span>
          </span>
        </div>

        {/* <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 rounded-full border border-[#1e293b]/10 bg-[#F7F8F5] px-4 py-2 text-sm text-[#1e293b]/40 w-64">
            <Search size={15} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un produit, un vendeur…"
              className="bg-transparent outline-none w-full text-[#1e293b] placeholder:text-[#1e293b]/40"
            />
          </div>
          <button className="relative rounded-full p-2 hover:bg-[#1e293b]/5 transition-colors cursor-pointer">
            <Bell size={18} />
            <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#42b883]" />
          </button>
          <div className="flex items-center gap-2 pl-2 border-l border-[#1e293b]/10 cursor-pointer">
            <div className="h-8 w-8 rounded-full bg-[#42b883]/15 flex items-center justify-center text-sm font-semibold text-[#3aa876]">
              A
            </div>
            <ChevronDown size={14} className="text-[#1e293b]/40" />
          </div>
        </div> */}
        <div className="hidden lg:flex items-center gap-6 text-xl font-medium text-[#1E293B]">
            <a href="#" className="hover:text-[#42b883] transition-colors">Produits</a>
            <a href="#" className="hover:text-[#42b883] transition-colors">Vendeurs</a>
            <a href="#" className="hover:text-[#42b883] transition-colors">///</a>
          </div>
        <div className="mr-2">
              <Link to="/login" className="">
              <button className="px-3 py-2 text-sm font-bold bg-[#42b883]  text-white rounded-lg hover:bg-[#3aa876] transition-colors cursor-pointer">
                Connexion
              </button>
            </Link>
            <Link to="/register" className="ml-2">
              <button className="px-3 py-2 text-sm font-bold bg-[#e6efeb]  text-gray-700 rounded-lg hover:bg-[#3aa876] transition-colors cursor-pointer">
                Inscription
              </button>
            </Link>
          </div>
      </nav>

      {/* ---------------------------- First content ---------------------------- */}
      <header className="relative overflow-hidden px-6 py-7">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(#1e293b 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />

    {/* openWorld */}
        <div className="relative ">
          <span className="inline-flex ml-20 items-center gap-1.5 rounded-full bg-[#0f1c31] text-[#b0bcb7] text-xs font-semibold px-3 py-1.5 mb-4">
            <Sparkles size={13} /> Ouvert à tous — aucune inscription requise pour parcourir
          </span>
      {/* Grand title */}

          <div className="mx-auto text-center max-w-4xl mt-10">
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight mb-4">
              Tout le meilleur de nos vendeurs, <br />
              <span className="text-[#42b883]">réuni au même endroit</span>
            </h1>
          {/* le little paragraphe */}
            <p className="text-gray-600 text-xl mx-auto">
              Parcourez librement le catalogue complet, comparez les prix et découvrez des vendeurs locaux — sans compte, sans friction et en toute securite 
            </p>
          </div>
  
        </div>
      </header>

      <main className="px-6 pb-16 max-w-7xl mx-auto space-y-10">
        {/* Catégories */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
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

        {/* Grille produits */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">
              {activeCategory === "Tous" ? "Tous les produits" : activeCategory}
              <span className="text-[#1e293b]/40 font-normal text-sm ml-2">({filtered.length})</span>
            </h2>
          </div>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[#1e293b]/15 py-16 text-center text-[#1e293b]/40">
              <ShoppingBag size={28} className="mx-auto mb-3 opacity-40" />
              Aucun produit ne correspond à votre recherche.
            </div>
          )}
        </section>

        {/* Vendeurs à la une */}
        <section>
          <h2 className="text-lg font-bold mb-4">Vendeurs à la une</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {vendors.map((v) => (
              <div
                key={v.nom}
                className="rounded-2xl border border-[#1e293b]/10 bg-white p-4 flex items-center gap-3 hover:border-[#42b883]/40 transition-colors cursor-pointer"
              >
                <div className="h-11 w-11 shrink-0 rounded-full bg-[#1e293b] text-white flex items-center justify-center font-semibold">
                  {v.initiale}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate">{v.nom}</p>
                  <p className="text-xs text-[#1e293b]/45 flex items-center gap-1">
                    <MapPin size={11} /> {v.ville} · {v.produits} produits
                  </p>
                </div>
                <span className="ml-auto shrink-0">
                  <StarRating note={v.note} />
                </span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default MarketplaceCatalog;