import type { Transactions } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Transactions } from "@prisma/client";

type TransactionType = "income" | "expense";

export type CreateTransactionType = Omit<
  Transactions & { type: TransactionType },
  "id"
>;

const TRANSACTION_FIELDS = {
  id: true,
  amount: true,
  title: true,
  description: true,
  type: true,
  createdAt: true,
  currency: {
    select: {
      code: true,
    },
  },
  category: {
    select: {
      name: true,
      icon: true,
      color: true,
    },
  },
};

export async function getTransactionByUserId(
  userId: Transactions["userId"],
  accountId: Transactions["accountId"],
  from: string,
  to: string,
) {
  return prisma.transactions.findMany({
    select: TRANSACTION_FIELDS,
    where: {
      userId,
      accountId,
      createdAt: {
        gte: from,
        lte: to,
      },
      parentTransactionId: null,
    },
  });
}

export async function getTransactionById(id: Transactions["id"]) {
  return prisma.transactions.findFirst({
    select: {
      ...TRANSACTION_FIELDS,
      childTransactions: { select: TRANSACTION_FIELDS },
    },
    where: {
      id,
    },
  });
}

export async function getSummarizedByType(
  userId: Transactions["userId"],
  accountId: Transactions["accountId"],
  from: string,
  to: string,
) {
  const data = await prisma.transactions.groupBy({
    by: ["type"],
    _sum: {
      amount: true,
    },
    where: {
      userId,
      accountId,
      createdAt: {
        gte: from,
        lte: to,
      },
    },
  });

  const income = data.find((d) => d.type === "income")?._sum.amount ?? 0;
  const expense = data.find((d) => d.type === "expense")?._sum.amount ?? 0;

  return {
    income: Number(income),
    expense: Number(expense),
  };
}

export async function getSummarizedByCategories(
  userId: Transactions["userId"],
  accountId: Transactions["accountId"],
  from: string,
  to: string,
) {
  const txP = prisma.transactions.groupBy({
    by: ["categoryId"],
    _sum: {
      amount: true,
    },
    where: {
      userId,
      accountId,
      createdAt: {
        gte: from,
        lte: to,
      },
    },
  });

  const catP = prisma.categories.findMany({
    select: { id: true, name: true, icon: true, color: true },
    where: { userId },
  });

  const [transactions, categories] = await Promise.all([txP, catP]);

  const data = transactions.map((tx) => {
    let category = categories.find((c) => c.id === tx.categoryId);
    if (!category) {
      category = {
        id: String(Date.now()),
        icon: "Warning",
        color: "red",
        name: "",
      };
    }

    return {
      ...category,
      amount: Number(tx._sum.amount),
    };
  });

  return data;
}

export async function createTransaction(transaction: CreateTransactionType) {
  const account = await prisma.accounts.findFirst({
    select: { balance: true },
    where: { id: transaction.accountId },
  });
  let amount = Number(transaction.amount);
  if (transaction.type === "expense") {
    amount *= -1;
  }
  const balance = Number(account!.balance) + amount;

  const accountQ = prisma.accounts.update({
    data: {
      balance,
    },
    where: {
      id: transaction.accountId,
    },
  });
  const transactionQ = prisma.transactions.create({
    data: transaction,
  });

  return prisma.$transaction([transactionQ, accountQ]);
}

export async function createTransactionSubItems(
  subItems: CreateTransactionType[],
) {
  const queries = subItems.map((item) => {
    return prisma.transactions.create({
      data: item,
    });
  });

  return prisma.$transaction(queries);
}

export async function deleteTransactionById(
  userId: Transactions["userId"],
  id: Transactions["id"],
) {
  const transaction = await prisma.transactions.findFirst({
    select: { amount: true, type: true, accountId: true },
    where: { id, userId },
  });

  if (!transaction) {
    return Promise.reject("transaction not found");
  }

  const account = await prisma.accounts.findFirst({
    select: { balance: true },
    where: { id: transaction!.accountId, userId },
  });

  if (!account) {
    return Promise.reject("account not found");
  }

  let amount = Number(transaction!.amount);
  if (transaction!.type === "income") {
    amount *= -1;
  }
  const balance = Number(account!.balance) + amount;

  const accountQ = prisma.accounts.update({
    data: {
      balance,
    },
    where: {
      id: transaction!.accountId,
    },
  });
  const transactionQ = prisma.transactions.delete({ where: { id } });

  return prisma.$transaction([accountQ, transactionQ]);
}
