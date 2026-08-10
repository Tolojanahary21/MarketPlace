import { useState } from "react";
import { login } from "../services/auth.service";
import type { LoginUser } from "../interfaces/login.interface";
import { useAuth } from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  
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
      saveLogin(response.access_token, response.user);

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
  const message = err.response?.data?.message;

  if (
    err.response?.status === 401 &&
    typeof message === "string" &&
    message.toLowerCase().includes("email") &&
    message.toLowerCase().includes("vérifiée")
  ) {
    navigate("/verify-otp", {
      state: {
        email: formData.email,
      },
    });

    return;
  }

  setError(
    message || "Email ou mot de passe incorrect"
  );
} finally {
      setLoading(false);
    }
  };

  return (
    // Background
    <div
  className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-white bg-[repeating-linear-gradient(45deg,#1e293b08_0px,#1e293b08_1px,transparent_1px,transparent_20px)]"
  onMouseMove={(e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    e.currentTarget.style.setProperty('--mouse-x', x + '%');
    e.currentTarget.style.setProperty('--mouse-y', y + '%');
  }}
>
  <div 
    className="absolute inset-0 "
    style={{
      background: 'radial-gradient(circle 600px at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(30,41,59,0.15), transparent 80%)'
    }}
  >

    {/* navbar et titre  */}
    <nav className="w-full px-6 py-4 flex items-center justify-between relative z-10 bg-gray-100 backdrop-blur-md border-b border-gray-200">
          <div className="text-4xl font-bold ml-20 cursor-pointer">
            <Link to="/">
            <span className="text-[#1e293b]">Market</span><span className="text-[#42b883]">Place</span>
            </Link>
            </div>

          {/* <div className="hidden md:flex items-center gap-8 text-gray-600 font-medium">
            <a href="#" className="hover:text-[#42b883] transition-colors">Accueil</a>
            <a href="#" className="hover:text-[#42b883] transition-colors">Produits</a>
            <a href="#" className="hover:text-[#42b883] transition-colors">Catégories</a>
            <a href="#" className="hover:text-[#42b883] transition-colors">Contact</a>
          </div> */}
            <div className="mr-20">
              <Link to="/register" className="">
              <button className="px-5 py-3 font-bold bg-[#42b883]  text-white rounded-lg hover:bg-[#3aa876] transition-colors cursor-pointer">
                S'inscrire
              </button>
            </Link>
            </div>
            
          
    </nav>
  </div>
  {/* Image a gauche  */}
      <div className="relative">
          {/* Img */}
        <div className="-mt-20">
          <img src="../../public/onlineShopp.png" alt="Aperçu du site MarketPlace"
          className="w-full max-w-lg h-auto  object-contain"/>
        </div>
      </div>


{/* Conteneur principal de Login */}
      <div className="min-h-screen flex items-center justify-center px-60 relative z-10">
        {/* div du login */}
  <div className="w-full max-w-md relative z-10">
    <div className="bg-[#616368] backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden">
      
      <div className="w-full p-80  md:p-15">
        {/* Titre */}
        <div className="flex justify-center mb-6">
          {/* titre dans le div de connexion */}
          <span className="text-4xl font-extrabold tracking-tight">
            <span className="text-white/90">Market</span>
            <span className="text-[#42b883] drop-shadow-[0_0_12px_rgba(66,184,131,0.5)]">Place</span>
          </span>
        </div>

        {/* Titre */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white/95 tracking-tight">Connexion</h1>
          <div className="w-10 h-1 bg-[#42b883] rounded-full mx-auto mt-3"></div>
          <p className="text-sm text-white/50 mt-3">Accédez à votre espace</p>
        </div>
      
        {/* Message d'erreur */}
        {error && (
            <div className="mb-5 flex items-start gap-2.5 rounded-lg bg-red-500/10 backdrop-blur-sm border border-red-500/20 px-4 py-3 text-sm text-red-200 animate-fadeDown">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{error}</span>
            </div>
          )}
{/* Formulaire de login */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block font-bold text-white/70 mb-1.5 tracking-wide uppercase text-xs">
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
              className="w-full rounded-lg bg-white/5 border border-white/20 px-3.5 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#42b883]/50 focus:border-[#42b883]/50 transition backdrop-blur-sm"
            />
          </div>

          <div>
            <label htmlFor="password" className="block font-bold text-white/70 mb-1.5 tracking-wide uppercase text-xs">
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
                className="w-full rounded-lg bg-white/5 border border-white/20 px-3.5 py-2.5 pr-10 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#42b883]/50 focus:border-[#42b883]/50 transition backdrop-blur-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-white/50 hover:text-white/80 transition cursor-pointer"
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
            className="w-3/4 cursor-pointer mx-auto block rounded-lg bg-[#42b883] text-white text-sm font-medium py-2.5 px-6 hover:bg-[#3aa876] hover:shadow-[0_0_30px_rgba(66,184,131,0.3)] hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>

          <div className="mt-6 space-y-4 text-center">
            <div>
              <a href="#" className="text-sm text-white/50 hover:text-[#42b883] transition inline-flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Mot de passe oublié ?
              </a>
            </div>
            
            <div className="text-sm text-white">
              Pas encore de compte ?{" "}
              <Link to="/register" className="text-[#4295b8] hover:text-[#5fd3a0] transition font-medium inline-flex items-center gap-1 underline underline-offset-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Créer un compte
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>
    </div>
  );
}

export default Login;