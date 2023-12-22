import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Filter } from "lucide-react";
import invariant from "tiny-invariant";

import { Overview } from "~/components/components";
import { Button } from "~/components/ui/button";
import { getAccountBalance } from "~/models/accounts.server";

export async function loader({ params }: LoaderFunctionArgs) {
  const accountId = params.id;

  invariant(typeof accountId === "string", "accountId is required");
  // TODO: sacar fecha de filtro
  const date = new Date();
  const { balance, income, expense } = await getAccountBalance(
    accountId,
    date.getMonth(),
    date.getFullYear(),
  );

  return json({ balance, income, expense });
}
export default function AccountOverviewRoute() {
  const { balance, income, expense } = useLoaderData<typeof loader>();
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button variant="ghost">
          <Filter className="h-6 w-6" />
        </Button>
      </div>
      <Overview balance={balance} income={income} expense={expense} />
      <div className="flex justify-center">
        <p className="text-lg">No data for this month yet</p>
      </div>
    </div>
  );
}
