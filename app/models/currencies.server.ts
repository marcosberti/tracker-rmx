import type { Currencies } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Currencies } from "@prisma/client";

export async function getCurrenciesByUserId(userId: string) {
  return prisma.currencies.findMany({
    where: { userId },
    orderBy: [{ code: "asc" }],
  });
}

export async function getCurrencyById(id: Currencies["id"]) {
  return prisma.currencies.findUnique({ where: { id } });
}

export async function deleteCurrencyById(id: Currencies["id"]) {
  return prisma.currencies.delete({ where: { id } });
}

export async function createCurrency({
  userId,
  name,
  code,
}: {
  userId: Currencies["userId"];
  name: Currencies["name"];
  code: Currencies["code"];
}) {
  return prisma.currencies.create({
    data: {
      userId,
      name,
      code,
    },
  });
}
