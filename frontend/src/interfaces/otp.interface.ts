// Structures liées à la vérification par OTP (email verification / reset password)

export interface VerifyEmailDto {
  email: string;
  otp: string;
}

export interface ResendOtpDto {
  email: string;
}

export interface OtpMessageResponse {
  message: string;
}