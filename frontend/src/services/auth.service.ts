import { registerSchema, type RegisterInput } from "@coworking/shared";

import { loginSchema, type LoginInput } from "@coworking/shared";

import type { LoginResponse, RegisteredUser } from "@/types/auth";

const API_URL = import.meta.env.VITE_API_URL;

export async function registerUser(
  payload: RegisterInput,
): Promise<RegisteredUser> {
  const validation = registerSchema.safeParse(payload);

  if (!validation.success) {
    throw new Error("INVALID_DATA");
  }
  const response = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(validation.data),
  });

  if (response.status === 409) {
    throw new Error("EMAIL_ALREADY_EXISTS");
  }

  if (response.status === 400) {
    throw new Error("INVALID_DATA");
  }

  if (!response.ok) {
    throw new Error("REGISTRATION_FAILED");
  }

  return response.json();
}
export async function loginUser(payload: LoginInput): Promise<LoginResponse> {
  const validation = loginSchema.safeParse(payload);

  if (!validation.success) {
    throw new Error("INVALID_DATA");
  }

  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(validation.data),
  });

  if (response.status === 401) {
    throw new Error("INVALID_CREDENTIALS");
  }

  if (response.status === 400) {
    throw new Error("INVALID_DATA");
  }

  if (!response.ok) {
    throw new Error("LOGIN_FAILED");
  }

  return response.json();
}
