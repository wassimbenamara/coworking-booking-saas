import { prisma } from "../lib/prisma.js";
import type { CreateCoworkingSpaceInput } from "@coworking/shared";

export async function getCoworkingSpaces() {
  return prisma.coworkingSpace.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getCoworkingSpaceById(id: number) {
  return prisma.coworkingSpace.findUnique({
    where: { id },
  });
}

export async function createCoworkingSpace(
  data: CreateCoworkingSpaceInput
) {
  return prisma.coworkingSpace.create({
 data: {
  ...data,
  description: data.description ?? null,
}
  });
}