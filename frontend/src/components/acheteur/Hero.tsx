import React from "react";

interface HeroProps {
  isAuthenticated: boolean;
}

const Hero: React.FC<HeroProps> = ({ isAuthenticated }) => {
  return (
    <header className="relative overflow-hidden px-6 py-7">
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "radial-gradient(#1e293b 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />

      <div className="relative">
        <span className="inline-flex ml-20 items-center gap-1.5 rounded-full bg-[#bdc1c7] text-[#12151b] text-xs font-semibold px-3 py-1.5 mb-4">
          {isAuthenticated ? "Catalogue fournisseurs en direct" : "Connectez-vous pour accéder au catalogue complet"}
        </span>

        <div className="mx-auto text-center max-w-4xl mt-10">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight mb-4">
            Tout le meilleur de nos fournisseurs, <br />
            <span className="text-[#42b883]">réuni au même endroit</span>
          </h1>
          <p className="text-gray-600 text-xl mx-auto">
            Comparez les prix, les quantités minimales de commande et les délais de livraison
            de nos fournisseurs vérifiés.
          </p>
        </div>
      </div>
    </header>
  );
};

export default Hero;