import React from "react";
import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";

const GuestPrompt: React.FC = () => {
  return (
    <div className="rounded-2xl border border-dashed border-[#1e293b]/15 bg-white py-16 text-center">
      <ShoppingBag size={28} className="mx-auto mb-3 text-[#1e293b]/30" />
      <p className="text-[#1e293b]/60 mb-4">Connectez-vous pour parcourir le catalogue produits.</p>
      <Link to="/login">
        <button className="px-5 py-2.5 text-sm font-bold bg-[#42b883] text-white rounded-lg hover:bg-[#3aa876] transition-colors cursor-pointer">
          Se connecter
        </button>
      </Link>
    </div>
  );
};

export default GuestPrompt;