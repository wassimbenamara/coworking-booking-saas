import { prisma } from "../lib/prisma.js";
export async function getCoworkingSpaces() {
    return prisma.coworkingSpace.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });
}
export async function getCoworkingSpaceById(id) {
    return prisma.coworkingSpace.findUnique({
        where: { id },
    });
}
export async function createCoworkingSpace(data) {
    return prisma.coworkingSpace.create({
        data: {
            ...data,
            description: data.description ?? null,
        }
    });
}
//# sourceMappingURL=coworking-space.service.js.map