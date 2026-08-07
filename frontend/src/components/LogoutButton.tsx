import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";


function LogoutButton() {

  const { logout } = useAuth();
  const navigate = useNavigate();


  const handleLogout = () => {

    // Supprime le token et l'utilisateur
    logout();

    // Retour vers la page login
    navigate("/login");
  };


  return (
    <button onClick={handleLogout}>
      Se déconnecter
    </button>
  );
}


export default LogoutButton;