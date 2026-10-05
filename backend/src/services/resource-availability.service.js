import { prisma } from "../lib/prisma.js";
export async function getResourceAvailabilities(resourceId) {
    return prisma.resourceAvailability.findMany({
        where: {
            resourceId,
        },
        orderBy: {
            startsAt: "asc",
        },
    });
}
export async function createResourceAvailability(data) {
    return prisma.resourceAvailability.create({
        data: {
            resourceId: data.resourceId,
            startsAt: new Date(data.startsAt),
            endsAt: new Date(data.endsAt),
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
export async function hasOverlappingAvailability(resourceId, startsAt, endsAt) {
    const overlappingAvailability = await prisma.resourceAvailability.findFirst({
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
    return Boolean(overlappingAvailability);
}
//# sourceMappingURL=resource-availability.service.js.map