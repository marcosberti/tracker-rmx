import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { Tabs } from "~/components/components";
import { getAccountById } from "~/models/accounts.server";

export async function loader({ params }: LoaderFunctionArgs) {
  const accountId = params.id;
  invariant(typeof accountId === "string", "accountId is required");

  const account = await getAccountById(accountId, { name: true });

  return json({ account });
}

const TABS = ["overview", "transactions"];

export default function AccountRoute() {
  const { account } = useLoaderData<typeof loader>();

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="h-10 flex items-end">
        <h2 className="text-2xl font-bold">{account!.name}</h2>
      </div>
      <div className="flex flex-col gap-4">
        <Tabs tabs={TABS} />
        <Outlet />
      </div>
    </div>
  );
}
