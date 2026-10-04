import { prisma } from "../lib/prisma.js";
export async function getUserBookings(userId) {
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
export async function coworkingResourceExists(resourceId) {
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
export async function isBookingInsideAvailability(resourceId, startsAt, endsAt) {
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
export async function hasOverlappingBooking(resourceId, startsAt, endsAt) {
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
export async function createBooking(userId, data) {
    return prisma.booking.create({
        data: {
            userId,
            resourceId: data.resourceId,
            startsAt: new Date(data.startsAt),
            endsAt: new Date(data.endsAt),
        },
    });
}
//# sourceMappingURL=booking.service.js.map