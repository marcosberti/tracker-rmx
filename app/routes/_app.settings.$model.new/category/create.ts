import { json, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";

import { createCategory } from "~/models/categories.server";
import { validateSimpleValue } from "~/utils";

interface CategoryType {
  userId: string;
  name: string;
  icon: string;
  color: string;
}

export default async function create(userId: string, formData: FormData) {
  const name = formData.get("name");
  const icon = formData.get("icon");
  const color = formData.get("color");

  invariant(typeof name === "string", "name is required");
  invariant(typeof icon === "string", "icon is required");
  invariant(typeof color === "string", "color is required");

  const errors = {
    name: validateSimpleValue(name, "name"),
    icon: validateSimpleValue(icon, "icon"),
    color: validateSimpleValue(color, "color"),
  };

  if (Object.values(errors).filter(Boolean).length) {
    return json({ errors });
  }

  const category = { userId, name, icon, color } as CategoryType;

  await createCategory(category);

  return redirect("..");
}
