import type { CreateBookingInput } from "@coworking/shared";

import { apiFetch } from "../lib/api.js";

import type { BookingResponse, BookingsResponse } from "../types/booking.js";

export async function getMyBookings(accessToken: string) {
  const response = await apiFetch("/api/bookings/me", {
    accessToken,
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("UNAUTHORIZED");
    }

    throw new Error("FAILED_TO_FETCH_BOOKINGS");
  }

  return response.json() as Promise<BookingsResponse>;
}

export async function createBooking(
  payload: CreateBookingInput,
  accessToken: string,
) {
  const response = await apiFetch("/api/bookings", {
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
      throw new Error("BOOKING_CONFLICT");
    }

    throw new Error("FAILED_TO_CREATE_BOOKING");
  }

  return response.json() as Promise<BookingResponse>;
}
