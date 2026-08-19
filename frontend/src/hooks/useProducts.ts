import { useEffect, useState } from "react";
import { fetchProducts, type Product } from "../api/products";

interface UseProductsResult {
  products: Product[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  loadMore: () => Promise<void>;
}

export function useProducts(isAuthenticated: boolean): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchProducts(1, 20)
      .then((res) => {
        if (cancelled) return;
        setProducts(res.data);
        setPage(res.meta.page);
        setTotalPages(res.meta.totalPages);
      })
      .catch((err) => {
        if (cancelled) return;
        if (err.response?.status === 401) {
          setError("Session expirée, merci de vous reconnecter.");
        } else {
          setError("Impossible de charger le catalogue pour le moment.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  const loadMore = async () => {
    if (page >= totalPages) return;
    setLoadingMore(true);
    try {
      const res = await fetchProducts(page + 1, 20);
      setProducts((prev) => [...prev, ...res.data]);
      setPage(res.meta.page);
      setTotalPages(res.meta.totalPages);
    } catch {
      setError("Impossible de charger la suite du catalogue.");
    } finally {
      setLoadingMore(false);
    }
  };

  return { products, loading, loadingMore, error, page, totalPages, loadMore };
}