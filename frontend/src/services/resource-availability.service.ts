import type { CreateResourceAvailabilityInput } from "@coworking/shared";

import { apiFetch } from "@/lib/api";

import type {
  ResourceAvailabilitiesResponse,
  ResourceAvailabilityResponse,
} from "@/types/resource-availability";

export async function getResourceAvailabilities(
  resourceId: number,
  accessToken: string,
) {
  const response = await apiFetch(
    `/api/coworking-resources/${resourceId}/availabilities`,
    {
      accessToken,
    },
  );

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("UNAUTHORIZED");
    }

    if (response.status === 404) {
      throw new Error("RESOURCE_NOT_FOUND");
    }

    throw new Error("FAILED_TO_FETCH_RESOURCE_AVAILABILITIES");
  }

  return response.json() as Promise<ResourceAvailabilitiesResponse>;
}

export async function createResourceAvailability(
  payload: CreateResourceAvailabilityInput,
  accessToken: string,
) {
  const response = await apiFetch("/api/resource-availabilities", {
    method: "POST",
    accessToken,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    if (response.status === 400) {
      throw new Error("INVALID_DATA");
    }

    if (response.status === 401) {
      throw new Error("UNAUTHORIZED");
    }

    if (response.status === 404) {
      throw new Error("RESOURCE_NOT_FOUND");
    }

    if (response.status === 409) {
      throw new Error("AVAILABILITY_CONFLICT");
    }

    throw new Error("FAILED_TO_CREATE_RESOURCE_AVAILABILITY");
  }

  return response.json() as Promise<ResourceAvailabilityResponse>;
}
