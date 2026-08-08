import { useState } from "react";
import { register } from "../services/auth.service";
import type { RegisterUser } from "../interfaces/user.interface";

function Register() {
  // État du formulaire
  const [formData, setFormData] = useState<RegisterUser>({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    password: "",
    role: "ACHETEUR",
  });

  // Messages
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Mise à jour des champs
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Envoi du formulaire
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSuccess("");
    setError("");
    setLoading(true);

    try {
      await register(formData);
      setSuccess("Inscription réussie !");

      // Réinitialisation du formulaire
      setFormData({
        nom: "",
        prenom: "",
        email: "",
        telephone: "",
        password: "",
        role: "ACHETEUR",
      });
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Une erreur est survenue."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-gray-900 bg-[radial-gradient(#ffffff33_1px,transparent_1px)] bg-[size:20px_20px] px-4 relative overflow-hidden"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        e.currentTarget.style.setProperty('--mouse-x', x + '%');
        e.currentTarget.style.setProperty('--mouse-y', y + '%');
      }}
    >
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle 600px at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(139,92,246,0.15), transparent 80%)'
        }}
      ></div>

      <div className="w-full max-w-5xl relative z-10">
        <div className="bg-white/0 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden flex flex-col md:flex-row">
          
          {/* Partie gauche - Image/Illustration */}
          <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-purple-900/40 via-indigo-900/30 to-blue-900/40 p-8 flex-col justify-center items-center text-center">
            <div className="max-w-sm">
              <img 
                src="../../public/MarketPlace.jpg" 
                alt="Illustration" 
                className="w-full h-90 mb-10"
              />
              <h2 className="text-2xl font-bold text-white mb-3">
                Hi There, Welcome!
              </h2>
              <p className="text-white/60 text-sm">
                Create an account to get started
              </p>
            </div>
          </div>

          {/* Partie droite - Formulaire */}
          <div className="w-full md:w-1/2 p-8">
            {/* Logo */}
            <div className="flex justify-center mb-4">
              <span className="text-xl font-bold text-white/90">FindX</span>
            </div>

            {/* Titre */}
            <div className="text-center mb-6">
              <h1 className="text-lg font-medium text-white/90">Créer un compte</h1>
              <p className="text-sm text-white/50 mt-1">Rejoignez notre marketplace</p>
            </div>

            {/* Message de succès */}
            {success && (
              <div className="mb-5 rounded-lg bg-green-500/10 backdrop-blur-sm border border-green-500/20 px-4 py-3 text-sm text-green-100 animate-fadeDown">
                {success}
              </div>
            )}

            {/* Message d'erreur */}
            {error && (
              <div className="mb-5 rounded-lg bg-red-500/10 backdrop-blur-sm border border-red-500/20 px-4 py-3 text-sm text-red-100 animate-fadeDown">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nom et Prénom sur la même ligne */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="nom" className="block text-xs font-medium text-white/60 mb-1.5 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-purple-400/60"></span>
                    Nom
                  </label>
                  <input
                    id="nom"
                    type="text"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    required
                    placeholder="Dupont"
                    className="w-full rounded-lg bg-white/5 border border-white/20 px-3.5 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 transition backdrop-blur-sm"
                  />
                </div>

                <div>
                  <label htmlFor="prenom" className="block text-xs font-medium text-white/60 mb-1.5 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-purple-400/60"></span>
                    Prénom
                  </label>
                  <input
                    id="prenom"
                    type="text"
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleChange}
                    required
                    placeholder="Jean"
                    className="w-full rounded-lg bg-white/5 border border-white/20 px-3.5 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 transition backdrop-blur-sm"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-xs font-medium text-white/60 mb-1.5 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-purple-400/60"></span>
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="vous@exemple.com"
                  className="w-full rounded-lg bg-white/5 border border-white/20 px-3.5 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 transition backdrop-blur-sm"
                />
              </div>

              {/* Téléphone */}
              <div>
                <label htmlFor="telephone" className="block text-xs font-medium text-white/60 mb-1.5 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-purple-400/60"></span>
                  Téléphone
                </label>
                <input
                  id="telephone"
                  type="tel"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                  required
                  placeholder="06 12 34 56 78"
                  className="w-full rounded-lg bg-white/5 border border-white/20 px-3.5 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 transition backdrop-blur-sm"
                />
              </div>

              {/* Mot de passe */}
              <div>
                <label htmlFor="password" className="block text-xs font-medium text-white/60 mb-1.5 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-purple-400/60"></span>
                  Mot de passe
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="••••••••"
                    className="w-full rounded-lg bg-white/5 border border-white/20 px-3.5 py-2.5 pr-10 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 transition backdrop-blur-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-white/50 hover:text-white/80 transition"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Rôle */}
              <div>
                <label htmlFor="role" className="block text-xs font-medium text-white/60 mb-1.5 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-purple-400/60"></span>
                  Rôle
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full rounded-lg bg-white/5 border border-white/20 px-3.5 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 transition backdrop-blur-sm appearance-none"
                >
                  <option value="ACHETEUR" className="bg-gray-900">Acheteur</option>
                  <option value="VENDEUR" className="bg-gray-900">Vendeur</option>
                  <option value="ADMIN" className="bg-gray-900">Admin</option>
                </select>
              </div>

              {/* Bouton d'inscription */}
              <button
                type="submit"
                disabled={loading}
                className="w-2/3 mx-auto block rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium py-2.5 px-6 hover:bg-white/20 hover:border-white/40 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
              >
                {loading ? "Inscription..." : "S'inscrire"}
              </button>

              {/* Lien vers connexion */}
              <div className="text-center mt-4">
                <p className="text-sm text-white/40">
                  Déjà un compte ?{" "}
                  <a href="/login" className="text-purple-400 hover:text-purple-300 transition font-medium inline-flex items-center gap-1 underline underline-offset-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Se connecter
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;