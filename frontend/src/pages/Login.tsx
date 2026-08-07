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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");

    try {
      const response = await login(formData);

      // Stockage du token
      saveLogin(
  response.accessToken,
  response.user
);


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
      setError(
        err.response?.data?.message ||
        "Email ou mot de passe incorrect"
      );
    }
  };


  return (
    <div>
      <h1>Connexion</h1>

      {error && <p>{error}</p>}


      <form onSubmit={handleSubmit}>

        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>


        <div>
          <label>Mot de passe</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>


        <button type="submit">
          Se connecter
        </button>

      </form>
    </div>
  );
}

export default Login;