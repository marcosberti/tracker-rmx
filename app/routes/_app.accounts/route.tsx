import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";

import { Icon, LucideIconType } from "~/components/components";
import { Button } from "~/components/ui/button";
import { getAccountsByUserId } from "~/models/accounts.server";
import { requireUserId } from "~/session.server";
import { formatAmount } from "~/utils";

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await requireUserId(request);

  const accounts = await getAccountsByUserId(userId);

  return json({ accounts });
}

export default function AccountsRoute() {
  const { accounts } = useLoaderData<typeof loader>();

  return (
    <div className="h-full flex gap-12">
      <div className="h-full flex flex-col gap-6 basis-[40%]">
        <div className="flex justify-between items-end h-10">
          <h1 className="text-4xl font-bold">Accounts</h1>
          <Button asChild>
            <Link to="/accounts/new">New</Link>
          </Button>
        </div>
        <div>
          <ul className="flex flex-col gap-4">
            {!accounts.length ? (
              <li className="w-full mt-8 text-center">
                <p>You have no accounts yet</p>
              </li>
            ) : null}
            {accounts.map((a) => (
              <li key={a.id} className="w-full bg-gray-50 rounded-lg">
                <Link to={`${a.id}/overview`}>
                  <div className="flex justify-between items-center p-4">
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-2 items-center">
                        <span className={`text-${a.color}-400`}>
                          <Icon
                            icon={a.icon as LucideIconType}
                            className="w-6 h-6"
                          />
                        </span>
                        <p className="text-lg font-semibold">{a.name}</p>
                        {a.main ? (
                          <span className="rounded-lg text-primary-foreground bg-primary px-[4px] text-xs h-[1.25rem] leading-4">
                            main
                          </span>
                        ) : null}
                      </div>
                      <p className="text-xs">Last transaction: 12 nov. 2023</p>
                    </div>
                    <p className="text-2xl font-semibold">
                      {formatAmount(Number(a.balance), a.currency.code)}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="basis-[60%]">
        <Outlet />
      </div>
    </div>
  );
}
