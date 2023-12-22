import { Prisma } from "@prisma/client";
import { json, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";

import { createScheduled } from "~/models/scheduled.server";
import { validateSimpleValue } from "~/utils";

interface ScheduleType {
  amount: Prisma.Decimal;
  title: string;
  description: string;
  from: Date;
  to: Date;
  accountId: string;
  currencyId: string;
  categoryId: string;
  active: boolean;
  userId: string;
}

export default async function create(userId: string, formData: FormData) {
  const amount = formData.get("amount");
  const title = formData.get("title");
  const description = formData.get("description");
  const from = formData.get("from");
  const to = formData.get("to");
  const account = formData.get("account");
  const currency = formData.get("currency");
  const category = formData.get("category");

  invariant(typeof amount === "string", "amount is required");
  invariant(typeof title === "string", "title is required");
  invariant(typeof from === "string", "from is required");
  invariant(typeof account === "string", "account is required");
  invariant(typeof currency === "string", "currency is required");
  invariant(typeof category === "string", "category is required");

  const errors = {
    amount: validateSimpleValue(amount, "amount"),
    title: validateSimpleValue(title, "title"),
    from: validateSimpleValue(from, "from"),
    account: validateSimpleValue(account, "account"),
    currency: validateSimpleValue(currency, "currency"),
    category: validateSimpleValue(category, "category"),
  };

  if (Object.values(errors).filter(Boolean).length) {
    return json({ errors });
  }

  const scheduled = {
    amount: Number(amount) as unknown as Prisma.Decimal,
    title,
    description,
    from: new Date(from),
    active: true,
    userId,
    accountId: account,
    currencyId: currency,
    categoryId: category,
  } as ScheduleType;

  if (to && typeof to === "string") {
    scheduled.to = new Date(to);
  }

  await createScheduled(scheduled);

  return redirect("..");
}
