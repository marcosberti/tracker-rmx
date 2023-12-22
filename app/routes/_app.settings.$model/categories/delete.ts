import { json } from "@remix-run/node";
import invariant from "tiny-invariant";
import { deleteCategoryById } from "~/models/categories.server";

export default async function deleteCategory(formData: FormData) {
  const category = formData.get("category");
  invariant(typeof category === "string", "category is required");
  await deleteCategoryById(category);

  return json({ message: "Deleted" });
}
