import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
interface ProtectedRouteProps {
  children: React.ReactNode;
  role: "ADMIN" | "VENDEUR" | "ACHETEUR";
}


function ProtectedRoute({
  children,
  role,
}: ProtectedRouteProps) {
const { user, token } = useAuth();

if (!token || !user) {
  return <Navigate to="/login" />;
}

  // Vérification du rôle
  if (user.role !== role) {
    return <Navigate to="/login" />;
  }


  // Autorise l'accès
  return children;
}


export default ProtectedRoute;