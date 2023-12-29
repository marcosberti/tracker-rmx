import type { Accounts } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Accounts } from "@prisma/client";

export async function getAccountsByUserId(userId: string) {
  return prisma.accounts.findMany({
    select: {
      id: true,
      name: true,
      main: true,
      icon: true,
      color: true,
      balance: true,
      createdAt: true,

      currency: {
        select: {
          code: true,
        },
      },
    },
    where: {
      userId,
    },
    orderBy: [{ name: "asc" }],
  });
}

interface OptionsType {
  where: {
    id: string;
    userId: string;
  };
  select?: Record<string, boolean>;
}
export async function getAccountById(
  userId: Accounts["userId"],
  id: Accounts["id"],
  fields = {},
) {
  const options: OptionsType = {
    where: { id, userId },
  };
  if (fields) {
    options.select = fields;
  }
  return prisma.accounts.findFirst(options);
}

export async function getAccountBalance(
  userId: Accounts["userId"],
  id: Accounts["id"],
) {
  return prisma.accounts.findFirst({
    select: {
      id: true,
      name: true,
      userId: true,
      balance: true,
      currency: {
        select: {
          id: true,
          name: true,
          code: true,
        },
      },
    },
    where: { id, userId },
  });
}

export async function getAccountCurrency(
  userId: Accounts["userId"],
  id: Accounts["id"],
) {
  return prisma.accounts.findFirst({
    select: {
      currency: {
        select: {
          id: true,
          name: true,
          code: true,
        },
      },
    },
    where: { id, userId },
  });
}

export async function deleteAccountById(
  userId: Accounts["userId"],
  id: Accounts["id"],
) {
  const account = await prisma.accounts.findFirst({ where: { id, userId } });
  if (!account) {
    return Promise.reject("Account not found");
  }
  return prisma.accounts.delete({ where: { id } });
}

export async function createAccount({
  name,
  color,
  icon,
  main,
  userId,
  currencyId,
}: {
  name: Accounts["name"];
  color: Accounts["color"];
  icon: Accounts["icon"];
  main: Accounts["main"];
  userId: Accounts["userId"];
  currencyId: Accounts["currencyId"];
}) {
  return prisma.accounts.create({
    data: {
      name,
      color,
      icon,
      main,
      currencyId,
      userId,
      balance: 0,
    },
  });
}
