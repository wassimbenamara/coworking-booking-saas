export interface ResourceAvailability {
  id: number;
  resourceId: number;
  startsAt: string;
  endsAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface ResourceAvailabilitiesResponse {
  availabilities: ResourceAvailability[];
}

export interface ResourceAvailability {
  id: number;
  resourceId: number;
  startsAt: string;
  endsAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface ResourceAvailabilitiesResponse {
  availabilities: ResourceAvailability[];
}

export interface ResourceAvailabilityResponse {
  availability: ResourceAvailability;
}