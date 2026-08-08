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

      // Stockage du token
      saveLogin(response.accessToken, response.user);

      // Redirection selon le rôle
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.message || "Email ou mot de passe incorrect");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F3EF] px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#1F2937] text-white text-xl font-semibold mb-4">
            M
          </div>
          <h1 className="text-2xl font-semibold text-[#1F2937]">Connexion</h1>
          <p className="text-sm text-[#6B7280] mt-1">
            Accédez à votre espace marketplace
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] p-8">
          {error && (
            <div className="mb-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#374151] mb-1.5">
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
                className="w-full rounded-lg border border-[#D1D5DB] px-3.5 py-2.5 text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#1F2937] focus:border-transparent transition"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#374151] mb-1.5">
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
                  className="w-full rounded-lg border border-[#D1D5DB] px-3.5 py-2.5 pr-10 text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#1F2937] focus:border-transparent transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-xs text-[#6B7280] hover:text-[#1F2937]"
                  tabIndex={-1}
                >
                  {showPassword ? "Masquer" : "Afficher"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[#1F2937] text-white text-sm font-medium py-2.5 hover:bg-[#111827] transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;