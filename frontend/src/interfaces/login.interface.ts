export interface LoginUser {
    email: string;
    password: string;
}

//Info Users retournees venant de Nest

export interface AuthUser {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    role: 'ADMIN' | 'VENDEUR' | 'ACHETEUR';
}

export interface LoginResponse {
    access_token: string;
    refresh_token: string;
    user: AuthUser;
}