import { json } from "@remix-run/node";
import invariant from "tiny-invariant";

import { deleteScheduledById } from "~/models/scheduled.server";

export default async function deleteSchedule(formData: FormData) {
  const scheduled = formData.get("scheduled");
  invariant(typeof scheduled === "string", "scheduled is required");

  await deleteScheduledById(scheduled);
  return json({ message: "Deleted" });
}
