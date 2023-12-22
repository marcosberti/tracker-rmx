import type {
  Scheduled as PrismaSched,
  Currencies,
  Accounts,
} from "@prisma/client";

import { prisma } from "~/db.server";

type Scheduled = PrismaSched & {
  account?: Accounts;
  currency?: Currencies;
};

export type { Scheduled, PrismaSched };

export async function getScheduledByUserId(userId: string) {
  return prisma.scheduled.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      active: true,
      amount: true,
      from: true,
      to: true,
      account: {
        select: {
          name: true,
        },
      },
      currency: {
        select: {
          code: true,
        },
      },
    },
    where: {
      userId,
    },
  });
}

export async function getScheduledById(id: Scheduled["id"]) {
  return prisma.scheduled.findUnique({ where: { id } });
}

type CreateScheduledType = Pick<
  Scheduled,
  | "title"
  | "description"
  | "amount"
  | "from"
  | "to"
  | "accountId"
  | "categoryId"
  | "currencyId"
  | "userId"
>;

export async function createScheduled(scheduled: CreateScheduledType) {
  return prisma.scheduled.create({
    data: scheduled,
  });
}

export async function deleteScheduledById(id: Scheduled["id"]) {
  return prisma.scheduled.delete({ where: { id } });
}
