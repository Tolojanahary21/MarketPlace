import type { Product } from "../api/products";

export interface VendorSummary {
  nom: string;
  type: string;
  produits: number;
}

// Catégories dérivées des produits chargés (GET /categories n'est pas
// accessible au rôle ACHETEUR côté backend, donc on ne l'appelle pas).
export function getCategories(products: Product[]): string[] {
  const unique = Array.from(new Set(products.map((p) => p.category.nom)));
  return ["Tous", ...unique];
}

// Fournisseurs mis en avant, dérivés des produits chargés.
export function getVendors(products: Product[]): VendorSummary[] {
  const map = new Map<number, VendorSummary>();

  products.forEach((p) => {
    const entry = map.get(p.supplier.id);
    if (entry) {
      entry.produits += 1;
    } else {
      map.set(p.supplier.id, {
        nom: p.supplier.displayName,
        type: p.supplier.type,
        produits: 1,
      });
    }
  });

  return Array.from(map.values())
    .sort((a, b) => b.produits - a.produits)
    .slice(0, 4);
}

export function filterProducts(
  products: Product[],
  activeCategory: string,
  query: string
): Product[] {
  return products.filter((p) => {
    const matchCategory = activeCategory === "Tous" || p.category.nom === activeCategory;
    const matchQuery =
      query.trim() === "" ||
      p.nom.toLowerCase().includes(query.toLowerCase()) ||
      p.supplier.displayName.toLowerCase().includes(query.toLowerCase());
    return matchCategory && matchQuery;
  });
}