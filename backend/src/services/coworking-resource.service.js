import { prisma } from "../lib/prisma.js";
export async function getCoworkingResourcesBySpaceId(coworkingSpaceId) {
    return prisma.coworkingResource.findMany({
        where: {
            coworkingSpaceId,
        },
        orderBy: {
            createdAt: "asc",
        },
    });
}
export async function getCoworkingResourceById(id) {
    return prisma.coworkingResource.findUnique({
        where: {
            id,
        },
    });
}
export async function createCoworkingResource(data) {
    return prisma.coworkingResource.create({
        data,
    });
}
export async function coworkingSpaceExists(coworkingSpaceId) {
    const coworkingSpace = await prisma.coworkingSpace.findUnique({
        where: {
            id: coworkingSpaceId,
        },
        select: {
            id: true,
        },
    });
    return Boolean(coworkingSpace);
}
//# sourceMappingURL=coworking-resource.service.js.map