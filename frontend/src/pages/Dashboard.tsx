import React, { useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

import { AuthContext } from "../context/AuthContext";
import { useProducts } from "../hooks/useProducts";
import { getCategories, getVendors, filterProducts } from "../utils/catalog";

import Navbar from "../components/dashboard/Navbar";
import Hero from "../components/dashboard/Hero";
import CategoryTabs from "../components/dashboard/CategoryTabs";
import ProductGrid from "../components/dashboard/ProductGrid";
import VendorsSection from "../components/dashboard/VendorsSection";
import GuestPrompt from "../components/dashboard/GuestPrompt";

const Dashboard: React.FC = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const [activeCategory, setActiveCategory] = useState("Tous");
  const [query, setQuery] = useState("");

  const isAuthenticated = Boolean(auth?.token);
  const { products, loading, loadingMore, error, page, totalPages, loadMore } =
    useProducts(isAuthenticated);

  const categories = useMemo(() => getCategories(products), [products]);
  const vendors = useMemo(() => getVendors(products), [products]);
  const filtered = useMemo(
    () => filterProducts(products, activeCategory, query),
    [products, activeCategory, query]
  );

  const handleLogout = () => {
    auth?.logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen w-full bg-[#F7F8F5] text-[#1e293b]">
      <Navbar
        isAuthenticated={isAuthenticated}
        user={auth?.user}
        query={query}
        onQueryChange={setQuery}
        onLogout={handleLogout}
      />

      <Hero isAuthenticated={isAuthenticated} />

      <main className="px-6 pb-16 max-w-7xl mx-auto space-y-10">
        {!isAuthenticated && <GuestPrompt />}

        {isAuthenticated && (
          <>
            {error && (
              <div className="rounded-xl bg-red-500/10 text-red-600 text-sm px-4 py-3">
                {error}
              </div>
            )}

            {loading ? (
              <div className="flex items-center justify-center py-24 text-[#1e293b]/40 gap-2">
                <Loader2 size={20} className="animate-spin" />
                Chargement du catalogue...
              </div>
            ) : (
              <>
                <CategoryTabs
                  categories={categories}
                  activeCategory={activeCategory}
                  onChange={setActiveCategory}
                />

                <ProductGrid
                  title={activeCategory === "Tous" ? "Tous les produits" : activeCategory}
                  products={filtered}
                  page={page}
                  totalPages={totalPages}
                  loadingMore={loadingMore}
                  onLoadMore={loadMore}
                />

                <VendorsSection vendors={vendors} />
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;