import type {
  CoworkingSpace,
  CoworkingSpaceResponse,
  CoworkingSpacesResponse,
} from "@/types/coworking-space";
import type { CreateCoworkingSpaceInput } from "@coworking/shared";
import { apiFetch } from "@/lib/api";

export async function getCoworkingSpaces(
  accessToken: string,
): Promise<CoworkingSpace[]> {
  const response = await apiFetch("/api/coworking-spaces", {
    accessToken,
  });

  if (response.status === 401) {
    throw new Error("UNAUTHORIZED");
  }

  if (!response.ok) {
    throw new Error("COWORKING_SPACES_FETCH_FAILED");
  }

  const data: CoworkingSpacesResponse = await response.json();

  return data.coworkingSpaces;
}

export async function getCoworkingSpaceById(
  id: number,
  accessToken: string,
): Promise<CoworkingSpace> {
  const response = await apiFetch(`/api/coworking-spaces/${id}`, {
    accessToken,
  });

  if (response.status === 401) {
    throw new Error("UNAUTHORIZED");
  }

  if (response.status === 404) {
    throw new Error("COWORKING_SPACE_NOT_FOUND");
  }

  if (!response.ok) {
    throw new Error("COWORKING_SPACE_FETCH_FAILED");
  }

  const data: CoworkingSpaceResponse = await response.json();

  return data.coworkingSpace;
}

export async function createCoworkingSpace(
  payload: CreateCoworkingSpaceInput,
  accessToken: string,
): Promise<CoworkingSpace> {
  const response = await apiFetch("/api/coworking-spaces", {
    method: "POST",
    accessToken,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (response.status === 401) {
    throw new Error("UNAUTHORIZED");
  }

  if (response.status === 400) {
    throw new Error("INVALID_DATA");
  }

  if (!response.ok) {
    throw new Error("COWORKING_SPACE_CREATE_FAILED");
  }

  const data: CoworkingSpaceResponse = await response.json();

  return data.coworkingSpace;
}
