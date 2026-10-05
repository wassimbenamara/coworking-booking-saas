export interface CoworkingSpace {
  id: number;
  name: string;
  description: string | null;
  address: string;
  city: string;
  country: string;
  createdAt: string;
  updatedAt: string;
}

export interface CoworkingSpacesResponse {
  coworkingSpaces: CoworkingSpace[];
}

export interface CoworkingSpaceResponse {
  coworkingSpace: CoworkingSpace;
}
