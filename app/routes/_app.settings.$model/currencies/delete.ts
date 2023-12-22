import { json } from "@remix-run/node";
import invariant from "tiny-invariant";

import { deleteCurrencyById } from "~/models/currencies.server";

export default async function deleteCurrency(formData: FormData) {
  const currency = formData.get("currency");
  invariant(typeof currency === "string", "currency is required");
  await deleteCurrencyById(currency);
  return json({ message: "Deleted" });
}
