export interface BookingResource {
  id: number;
  name: string;
  type: "DESK" | "MEETING_ROOM";
  capacity: number;
  coworkingSpaceId: number;
  coworkingSpace?: {
    id: number;
    name: string;
    address: string;
    city: string;
    country: string;
  };
}

export interface Booking {
  id: number;
  userId: number;
  resourceId: number;
  startsAt: string;
  endsAt: string;
  createdAt: string;
  updatedAt: string;
  resource: BookingResource;
}

export interface BookingsResponse {
  bookings: Booking[];
}

export interface BookingResponse {
  booking: Booking;
}
