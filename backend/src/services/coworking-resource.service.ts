import type { CreateCoworkingResourceInput } from "@coworking/shared";

import { prisma } from "../lib/prisma.js";

export async function getCoworkingResourcesBySpaceId(coworkingSpaceId: number) {
  return prisma.coworkingResource.findMany({
    where: {
      coworkingSpaceId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
}

export async function getCoworkingResourceById(id: number) {
  return prisma.coworkingResource.findUnique({
    where: {
      id,
    },
  });
}

export async function createCoworkingResource(
  data: CreateCoworkingResourceInput,
) {
  return prisma.coworkingResource.create({
    data,
  });
}

export async function coworkingSpaceExists(coworkingSpaceId: number) {
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
