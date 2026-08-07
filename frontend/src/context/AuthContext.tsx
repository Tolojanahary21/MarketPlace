import { createContext, useState, type ReactNode } from "react";
import type { AuthUser } from "../interfaces/login.interface";


// Type des données disponibles dans le contexte
interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
}


// Création du contexte
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | null>(null);


// Provider qui englobe l'application
interface AuthProviderProps {
  children: ReactNode;
}


export function AuthProvider({ children }: AuthProviderProps) {

  // Récupération des données existantes au chargement
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );


  const [user, setUser] = useState<AuthUser | null>(() => {

    const storedUser = localStorage.getItem("user");

    return storedUser
      ? JSON.parse(storedUser)
      : null;
  });


  // Connexion utilisateur
  const login = (
    newToken: string,
    newUser: AuthUser
  ) => {

    setToken(newToken);
    setUser(newUser);

    localStorage.setItem(
      "token",
      newToken
    );

    localStorage.setItem(
      "user",
      JSON.stringify(newUser)
    );
  };


  // Déconnexion utilisateur
  const logout = () => {

    setToken(null);
    setUser(null);

    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };


  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}