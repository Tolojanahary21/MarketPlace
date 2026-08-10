// Service responsable de la communication avec l'API d'authentification

import axios from "axios";
import type { RegisterUser, UserResponse } from "../interfaces/user.interface";
import type { LoginUser,LoginResponse } from "../interfaces/login.interface";
// URL de base de ton backend NestJS
const API_URL = "http://localhost:3000/users";
//OTP 
import type {
  VerifyEmailDto,
  ResendOtpDto,
  OtpMessageResponse,
} from "../interfaces/otp.interface";

const AUTH_URL = API_URL.replace("/users", "/auth");
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
//Pour le login connexa
export const login = async (
  user: LoginUser
): Promise<LoginResponse> => {
  const response = await axios.post<LoginResponse>(
    `${API_URL.replace("/users", "")}/auth/login`,
    user
  );

  return response.data;
};

//Verification par e-mail
// Vérification de l'email via OTP
export const verifyEmail = async (
  dto: VerifyEmailDto
): Promise<OtpMessageResponse> => {
  const response = await axios.post<OtpMessageResponse>(
    `${AUTH_URL}/verify-email`,
    dto
  );

  return response.data;
};

// Renvoi du code OTP (vérification email)
export const resendOtp = async (
  dto: ResendOtpDto
): Promise<OtpMessageResponse> => {
  const response = await axios.post<OtpMessageResponse>(
    `${AUTH_URL}/resend-otp`,
    dto
  );

  return response.data;
};