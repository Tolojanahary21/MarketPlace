import { useState } from "react";
import { register } from "../services/auth.service";
import type { RegisterUser } from "../interfaces/user.interface";

function Register() {
  // État du formulaire
  const [formData, setFormData] = useState<RegisterUser>({
    nom: "",
    prenom: "",
    email: "",
    password: "",
    role: "ACHETEUR",
  });

  // Messages
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

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

    try {
      await register(formData);

      setSuccess("Inscription réussie !");

      // Réinitialisation du formulaire
      setFormData({
        nom: "",
        prenom: "",
        email: "",
        password: "",
        role: "ACHETEUR",
      });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Une erreur est survenue."
      );
    }
  };

  return (
    <div>
      <h1>Créer un compte</h1>

      {success && <p>{success}</p>}
      {error && <p>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Nom</label>
          <input
            type="text"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Prénom</label>
          <input
            type="text"
            name="prenom"
            value={formData.prenom}
            onChange={handleChange}
            required
          />
        </div>

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

        <div>
          <label>Rôle</label>

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="ACHETEUR">Acheteur</option>
            <option value="VENDEUR">Vendeur</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>

        <button type="submit">
          S'inscrire
        </button>
      </form>
    </div>
  );
}

export default Register;