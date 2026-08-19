import React from "react";
import { Link } from "react-router-dom";
import { LogOut } from "lucide-react";
import type { AuthUser } from "../../interfaces/login.interface";

interface NavbarProps {
  isAuthenticated: boolean;
  user?: AuthUser | null;
  query: string;
  onQueryChange: (value: string) => void;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isAuthenticated, user, query, onQueryChange, onLogout }) => {
  return (
    <nav className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-md border-b border-[#1e293b]/10">
      <div className="px-6 py-4 flex items-center gap-8">
        <div className="flex items-center ml-20 shrink-0">
          <Link to="/">
            <span className="text-4xl font-extrabold tracking-tight cursor-pointer">
              <span className="text-[#1e293b]">Market</span>
              <span className="text-[#42b883]">Place</span>
            </span>
          </Link>
        </div>

        <div className="hidden lg:flex items-center shrink-0">
          <button className="flex items-center gap-2 px-4 py-2 text-lg font-semibold text-[#1e293b] hover:text-[#42b883] transition-colors cursor-pointer">
            ☰
            <span>Catégories</span>
          </button>
        </div>

        <div className="hidden lg:flex flex-1 max-w-2xl">
          <div className="flex w-full h-11 border-2 border-[#42b883] rounded-lg overflow-hidden">
            <input
              type="text"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Rechercher un produit, une marque ou une catégorie..."
              className="flex-1 px-4 text-sm text-[#1e293b] outline-none"
            />
            <button className="px-6 bg-[#42b883] text-white font-semibold hover:bg-[#3aa876] transition-colors cursor-pointer">
              Rechercher
            </button>
          </div>
        </div>

        <div className="flex items-center gap-5 ml-auto">
          <Link
            to="/favorites"
            className="hidden xl:flex flex-col items-center text-[#1e293b] hover:text-[#42b883] transition-colors"
          >
            <span className="text-xl">♡</span>
            <span className="text-xs">Favoris</span>
          </Link>

          <Link
            to="/cart"
            className="hidden xl:flex flex-col items-center text-[#1e293b] hover:text-[#42b883] transition-colors"
          >
            <span className="text-xl">🛒</span>
            <span className="text-xs">Panier</span>
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <span className="hidden xl:inline text-sm font-medium text-[#1e293b]/70">
                Bonjour {user?.prenom ?? ""}
              </span>
              <button
                onClick={onLogout}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold bg-[#e6efeb] text-gray-700 rounded-lg hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
              >
                <LogOut size={14} /> Déconnexion
              </button>
            </div>
          ) : (
            <>
              <Link to="/login">
                <button className="px-4 py-2 text-sm font-bold bg-[#42b883] text-white rounded-lg hover:bg-[#3aa876] transition-colors cursor-pointer">
                  Connexion
                </button>
              </Link>
              <Link to="/register">
                <button className="px-4 py-2 text-sm font-bold bg-[#e6efeb] text-gray-700 rounded-lg hover:bg-[#42b883] hover:text-white transition-colors cursor-pointer">
                  Inscription
                </button>
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="hidden lg:flex items-center px-6 ml-20 border-t border-[#1e293b]/5">
        <div className="flex items-center gap-8 h-12 text-sm font-semibold text-[#1e293b]">
          <Link to="/products" className="hover:text-[#42b883] transition-colors">Produits</Link>
          <Link to="/vendors" className="hover:text-[#42b883] transition-colors">Vendeurs</Link>
          <Link to="/promotions" className="hover:text-[#42b883] transition-colors">Promotions</Link>
          <Link to="/new" className="hover:text-[#42b883] transition-colors">Nouveautés</Link>
          <Link to="/best-sellers" className="hover:text-[#42b883] transition-colors">Meilleures ventes</Link>
          <Link to="/stores" className="hover:text-[#42b883] transition-colors">Boutiques</Link>
          <Link to="/become-vendor" className="ml-4 text-[#42b883] hover:text-[#3aa876] transition-colors">Devenir vendeur</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;