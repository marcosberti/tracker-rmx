import type { Accounts } from "@prisma/client";
import { endOfMonth, formatISO } from "date-fns";

import { prisma } from "~/db.server";
import { formatAmount } from "~/utils";

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
  };
  select?: Record<string, boolean>;
}
export async function getAccountById(id: Accounts["id"], fields = {}) {
  const options: OptionsType = {
    where: { id },
  };
  if (fields) {
    options.select = fields;
  }
  return prisma.accounts.findUnique(options);
}

export async function getAccountBalance(
  id: Accounts["id"],
  month: number,
  year: number,
) {
  // TODO: get transactions with datefilters
  // const date = new Date(year, month, 1);
  // const startOfMonthDate = formatISO(date);
  // const endOfMonthDate = formatISO(endOfMonth(date));

  const account = await prisma.accounts.findUnique({
    select: {
      balance: true,
      currency: {
        select: {
          code: true,
        },
      },
    },
    where: {
      id,
    },
  });

  return {
    balance: formatAmount(Number(account!.balance), account!.currency.code),
    income: formatAmount(0, account!.currency.code),
    expense: formatAmount(0, account!.currency.code),
  };
}

export async function deleteAccountById(id: Accounts["id"]) {
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
