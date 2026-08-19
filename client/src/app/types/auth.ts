/* ──────────────────────────────────────────────
 *  Auth DTOs  — mirror server/validations/auth.schemas.ts
 * ────────────────────────────────────────────── */

export interface LoginDto {
  email: string;
  password: string;
  fcmToken?: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  location?: {
    lat: number;
    lng: number;
    display_name?: string;
  };
}

export interface VerifyOtpDto {
  email: string;
  code: string;
  fcmToken?: string;
}

export interface RequestNewCodeDto {
  email: string;
}

export interface ResetPasswordDto {
  email: string;
  code: string;
  password: string;
}

/* ──────────────────────────────────────────────
 *  Auth Responses — mirror server/constants/shapes.ts
 * ────────────────────────────────────────────── */

export interface AuthAccountResponse {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  token: string;
  fcmToken: string | null;
  slug: string;
  role: number;
  createdAt: string;
  updatedAt: string;
  lastLogin: string | null;
}
