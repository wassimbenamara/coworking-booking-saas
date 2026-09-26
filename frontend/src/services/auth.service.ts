import type { RegisterPayload, RegisteredUser } from "../types/auth";

const API_URL = import.meta.env.VITE_API_URL;

export async function registerUser(
  payload: RegisterPayload
): Promise<RegisteredUser> {
  const response = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
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