import { json, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";

import { createCurrency } from "~/models/currencies.server";
import { validateSimpleValue } from "~/utils";

interface CurrencyType {
  userId: string;
  name: string;
  code: string;
}

export default async function create(userId: string, formData: FormData) {
  const name = formData.get("name");
  const code = formData.get("code");

  invariant(typeof name === "string", "name is required");
  invariant(typeof code === "string", "code is required");

  const errors = {
    name: validateSimpleValue(name, "name"),
    code: validateSimpleValue(code, "code"),
  };

  if (Object.values(errors).filter(Boolean).length) {
    return json({ errors });
  }

  const currency = {
    userId,
    name,
    code,
  } as CurrencyType;

  await createCurrency(currency);

  return redirect("..");
}
