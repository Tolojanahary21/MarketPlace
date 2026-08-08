import { useState } from "react";
import { login } from "../services/auth.service";
import type { LoginUser } from "../interfaces/login.interface";
import { useAuth } from "../hooks/useAuth";

function Login() {
  const [formData, setFormData] = useState<LoginUser>({
    email: "",
    password: "",
  });

  const { login: saveLogin } = useAuth();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await login(formData);
      saveLogin(response.accessToken, response.user);

      switch (response.user.role) {
        case "ADMIN":
          window.location.href = "/admin";
          break;
        case "VENDEUR":
          window.location.href = "/vendeur";
          break;
        case "ACHETEUR":
          window.location.href = "/acheteur";
          break;
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Email ou mot de passe incorrect");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-gray-900 bg-[radial-gradient(#ffffff33_1px,transparent_1px)] bg-size-[20px_20px] px-4 relative overflow-hidden"
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

      {/* Conteneur principal avec image à gauche et formulaire à droite */}
      <div className="w-full max-w-5xl relative z-10">
        <div className="bg-white/0 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden flex flex-col md:flex-row">
          
          

          {/* Partie droite - Formulaire */}
          <div className="w-full md:w-1/2 p-8">
            {/* Logo */}
            <div className="flex justify-center mb-">
              <span className="text-3xl font-bold text-white/50">Market<span className="text-blue-500">Place</span></span>
            </div>

            {/* Titre */}
            <div className="text-center mb-6">
              <h1 className="text-lg font-medium text-white/90">Connexion</h1>
              <p className="text-sm text-white/50 mt-1">Accédez à votre espace</p>
            </div>

            {/* Message d'erreur */}
            {error && (
              <div className="mb-5 rounded-lg bg-red-500/10 backdrop-blur-sm border border-red-500/20 px-4 py-3 text-sm text-red-100 animate-fadeDown">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-bold font-medium text-white/70 mb-1.5 tracking-wide uppercase text-xs">
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

              <div>
                <label htmlFor="password" className="block text-bold font-medium text-white/70 mb-1.5 tracking-wide uppercase text-xs">
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

              <button
                type="submit"
                disabled={loading}
                className="w-3/4 cursor-pointer mx-auto block rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium py-2.5 px-6 hover:bg-white/20 hover:border-white/40 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
              >
                {loading ? "Connexion..." : "Se connecter"}
              </button>

              <div className="mt-6 space-y-4 text-center">
                <div>
                  <a href="#" className="text-sm text-white/50 hover:text-white/80 transition inline-flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Mot de passe oublié ?
                  </a>
                </div>
                
                <div className="text-sm text-white/40">
                  Pas encore de compte ?{" "}
                  <a href="/register" className="text-blue-400 hover:text-gray-300 transition font-medium inline-flex items-center gap-1 underline underline-offset-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    Créer un compte
                  </a>
                </div>
              </div>
            </form>
          </div>
          {/* Partie gauche - Image/Illustration */}
          <div className="hidden md:flex md:w-1/2 bg-linear-to-br from-purple-900/40 via-indigo-900/30 to-blue-900/40 p-8 flex-col justify-center items-center text-center">
            <div className="max-w-sm">
              {/* Ton image/illustration */}
              <img 
                src="../../public/MarketPlace.jpg" 
                alt="Illustration" 
                className="w-full h-90 mb-10"
              />
              <h2 className="text-2xl font-bold text-white mb-3">
                Hi There, Welcome!
              </h2>
              <p className="text-white/60 text-sm">
                Login or create an account to access your account
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;