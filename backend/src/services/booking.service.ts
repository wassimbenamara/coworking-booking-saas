import type { CreateBookingInput } from "@coworking/shared";

import { prisma } from "../lib/prisma.js";

export async function getUserBookings(userId: number) {
  return prisma.booking.findMany({
    where: {
      userId,
    },
    include: {
      resource: {
        include: {
          coworkingSpace: true,
        },
      },
    },
    orderBy: {
      startsAt: "asc",
    },
  });
}

export async function coworkingResourceExists(resourceId: number) {
  const resource = await prisma.coworkingResource.findUnique({
    where: {
      id: resourceId,
    },
    select: {
      id: true,
    },
  });

  return Boolean(resource);
}

export async function isBookingInsideAvailability(
  resourceId: number,
  startsAt: string,
  endsAt: string,
) {
  const availability = await prisma.resourceAvailability.findFirst({
    where: {
      resourceId,
      startsAt: {
        lte: new Date(startsAt),
      },
      endsAt: {
        gte: new Date(endsAt),
      },
    },
    select: {
      id: true,
    },
  });

  return Boolean(availability);
}

export async function hasOverlappingBooking(
  resourceId: number,
  startsAt: string,
  endsAt: string,
) {
  const overlappingBooking = await prisma.booking.findFirst({
    where: {
      resourceId,
      startsAt: {
        lt: new Date(endsAt),
      },
      endsAt: {
        gt: new Date(startsAt),
      },
    },
    select: {
      id: true,
    },
  });

  return Boolean(overlappingBooking);
}

export async function createBooking(userId: number, data: CreateBookingInput) {
  return prisma.booking.create({
    data: {
      userId,
      resourceId: data.resourceId,
      startsAt: new Date(data.startsAt),
      endsAt: new Date(data.endsAt),
    },
  });
}
