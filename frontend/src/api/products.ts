import { api } from "./axios";

// ----------------------------- Types (alignés sur backend/prisma/schema.prisma) ---

export type UOM =
  | "PIECE"
  | "KILOGRAMME"
  | "GRAMME"
  | "LITRE"
  | "METRE"
  | "BOITE"
  | "CARTON"
  | "AUTRE";

export type ProductStatut = "ACTIF" | "INACTIF" | "RUPTURE";

export type SupplierType = "FABRICANT" | "GROSSISTE" | "DISTRIBUTEUR" | "AUTRE";

export interface Supplier {
  id: number;
  displayName: string;
  entreprise?: string | null;
  type: SupplierType;
}

export interface Category {
  id: number;
  nom: string;
  verticalId: number;
}

export interface Image {
  id: number;
  url: string;
  altText?: string | null;
  isPrimary: boolean;
}

export interface Product {
  id: number;
  nom: string;
  description?: string | null;
  statut: ProductStatut;
  uom: UOM;
  moq: number | null;
  leadTime: number | null;
  basePrice: string; // Decimal Prisma -> string en JSON
  cost?: string | null;
  msrp?: string | null;
  supplier: Supplier;
  category: Category;
  images?: Image[]; // absent sur /products (findAll), présent sur /products/:id
  createdAt: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ProductsResponse {
  data: Product[];
  meta: PaginationMeta;
}

// ----------------------------- Appels API -----------------------------------------

export async function fetchProducts(page = 1, limit = 20): Promise<ProductsResponse> {
  const { data } = await api.get<ProductsResponse>("/products", {
    params: { page, limit },
  });
  return data;
}

export async function fetchProductById(id: number): Promise<Product> {
  const { data } = await api.get<Product>(`/products/${id}`);
  return data;
}

// ----------------------------- Helpers d'affichage --------------------------------

export function formatPrice(value: string | number): string {
  const num = typeof value === "string" ? parseFloat(value) : value;
  return num.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export const UOM_LABEL: Record<UOM, string> = {
  PIECE: "pièce",
  KILOGRAMME: "kg",
  GRAMME: "g",
  LITRE: "L",
  METRE: "m",
  BOITE: "boîte",
  CARTON: "carton",
  AUTRE: "unité",
};