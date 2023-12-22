import type { Categories } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Categories } from "@prisma/client";

export async function getCategoriesByUserId(userId: string) {
  return prisma.categories.findMany({
    where: { userId },
    orderBy: [{ name: "asc" }],
  });
}

export async function getCategoryById(id: Categories["id"]) {
  return prisma.categories.findUnique({ where: { id } });
}

export async function deleteCategoryById(id: Categories["id"]) {
  return prisma.categories.delete({ where: { id } });
}

export async function createCategory(category: {
  userId: Categories["userId"];
  name: Categories["name"];
  icon: Categories["icon"];
  color: Categories["color"];
}) {
  return prisma.categories.create({
    data: category,
  });
}
