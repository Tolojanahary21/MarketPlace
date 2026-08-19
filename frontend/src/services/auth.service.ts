// Service responsable de la communication avec l'API d'authentification

import axios from "axios";
import type { RegisterUser, UserResponse } from "../interfaces/user.interface";
import type { LoginUser, LoginResponse } from "../interfaces/login.interface";

// URL de base de ton backend NestJS
const API_URL = "http://localhost:3000/users";
const AUTH_URL = "http://localhost:3000/auth";

// Inscription d'un utilisateur
export const register = async (
  user: RegisterUser
): Promise<UserResponse> => {
  const response = await axios.post<UserResponse>(
    `${API_URL}/register`,
    user
  );

  return response.data;
};

// Pour le login connexa
export const login = async (
  user: LoginUser
): Promise<LoginResponse> => {
  const response = await axios.post<LoginResponse>(
    `${AUTH_URL}/login`,
    user
  );

  return response.data;
};

// Vérification de l'adresse email avec le code OTP
export const verifyEmail = async (
  email: string,
  otp: string
): Promise<{ message: string }> => {
  const response = await axios.post<{ message: string }>(
    `${AUTH_URL}/verify-email`,
    { email, otp }
  );

  return response.data;
};

// Renvoi du code OTP
export const resendOtp = async (
  email: string
): Promise<{ message: string }> => {
  const response = await axios.post<{ message: string }>(
    `${AUTH_URL}/resend-otp`,
    { email }
  );

  return response.data;
};