import type {
  CoworkingResourceType,
} from "@coworking/shared";

export interface CoworkingResource {
  id: number;
  name: string;
  type: CoworkingResourceType;
  capacity: number;
  coworkingSpaceId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CoworkingResourcesResponse {
  resources: CoworkingResource[];
}

export interface CoworkingResourceResponse {
  resource: CoworkingResource;
}