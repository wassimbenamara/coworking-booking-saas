import type {
  CreateCoworkingResourceInput,
} from "@coworking/shared";

import { apiFetch } from "@/lib/api";

import type {
  CoworkingResource,
  CoworkingResourceResponse,
  CoworkingResourcesResponse,
} from "@/types/coworking-resource";

export async function getCoworkingResources(
  coworkingSpaceId: number,
  accessToken: string
): Promise<CoworkingResource[]> {
  const response = await apiFetch(
    `/api/coworking-spaces/${coworkingSpaceId}/resources`,
    {
      accessToken,
    }
  );

  if (response.status === 401) {
    throw new Error("UNAUTHORIZED");
  }

  if (!response.ok) {
    throw new Error("COWORKING_RESOURCES_FETCH_FAILED");
  }

  const data: CoworkingResourcesResponse =
    await response.json();

  return data.resources;
}

export async function getCoworkingResourceById(
  id: number,
  accessToken: string
): Promise<CoworkingResource> {
  const response = await apiFetch(
    `/api/coworking-resources/${id}`,
    {
      accessToken,
    }
  );

  if (response.status === 401) {
    throw new Error("UNAUTHORIZED");
  }

  if (response.status === 404) {
    throw new Error("COWORKING_RESOURCE_NOT_FOUND");
  }

  if (!response.ok) {
    throw new Error("COWORKING_RESOURCE_FETCH_FAILED");
  }

  const data: CoworkingResourceResponse =
    await response.json();

  return data.resource;
}

export async function createCoworkingResource(
  payload: CreateCoworkingResourceInput,
  accessToken: string
): Promise<CoworkingResource> {
  const response = await apiFetch(
    "/api/coworking-resources",
    {
      method: "POST",
      accessToken,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  if (response.status === 401) {
    throw new Error("UNAUTHORIZED");
  }

  if (response.status === 400) {
    throw new Error("INVALID_DATA");
  }

  if (response.status === 404) {
    throw new Error("COWORKING_SPACE_NOT_FOUND");
  }

  if (!response.ok) {
    throw new Error("COWORKING_RESOURCE_CREATE_FAILED");
  }

  const data: CoworkingResourceResponse =
    await response.json();

  return data.resource;
}