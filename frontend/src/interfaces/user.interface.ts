// Structure des données envoyées lors de l'inscription

export interface RegisterUser {
  nom: string;
  prenom: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'VENDEUR' | 'ACHETEUR';
}

// Structure de la réponse renvoyée par le backend

export interface UserResponse {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: 'ADMIN' | 'VENDEUR' | 'ACHETEUR';
  statut: 'ACTIF' | 'INACTIF';
  createdAt: string;
  updatedAt: string;
}