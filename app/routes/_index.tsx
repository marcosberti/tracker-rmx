import {
  redirect,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";

import { requireUserId } from "~/session.server";

export const meta: MetaFunction = () => [{ title: "Tracker" }];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireUserId(request);
  // const noteListItems = await getNoteListItems({ userId });
  return redirect("/app");
};
