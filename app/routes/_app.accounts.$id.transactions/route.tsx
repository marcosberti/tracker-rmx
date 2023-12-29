import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useSubmit } from "@remix-run/react";
import invariant from "tiny-invariant";

import { MonthFilter } from "~/components/components";
import { Button } from "~/components/ui/button";
import {
  deleteTransactionById,
  getTransactionByUserId,
} from "~/models/transactions.server";
import { requireUserId } from "~/session.server";
import { getMonthLimits, getMonthName, getParamsMonth } from "~/utils";

import Transaction from "./transaction-item";

export async function action({ request }: ActionFunctionArgs) {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const transactionId = formData.get("id");
  invariant(typeof transactionId === "string", "transactionId is required");
  await deleteTransactionById(userId, transactionId);

  return json({ message: "Deleted" });
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  const userId = await requireUserId(request);
  const accountId = params.id;
  const searchParams = new URL(request.url).searchParams;

  invariant(typeof accountId === "string", "invalid url");

  const { month, year } = getParamsMonth(searchParams);
  const monthName = getMonthName(year, month);

  const { from, to } = getMonthLimits(year, month);
  const transactions = await getTransactionByUserId(
    userId,
    accountId,
    from,
    to,
  );

  return json({ transactions, monthName });
}

export default function AccountTransactionsRoute() {
  const { transactions, monthName } = useLoaderData<typeof loader>();
  const submit = useSubmit();

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex justify-end gap-2">
          <MonthFilter />
          <Button asChild>
            <Link to="new">New</Link>
          </Button>
        </div>
        <ol className="flex flex-col gap-2">
          {!transactions.length ? (
            <li className="flex justify-center">
              <p className="text-lg">No transactions in {monthName}</p>
            </li>
          ) : null}
          {transactions.map((tx) => (
            <li key={tx.id} className="relative">
              <Link to={`${tx.id}/details`}>
                <Transaction.Item transaction={tx} />
              </Link>
              <Transaction.Options
                onEdit={() => console.log(">>>edit", tx.id)}
                onDelete={() => submit({ id: tx.id }, { method: "post" })}
              />
            </li>
          ))}
        </ol>
      </div>
      <Outlet />
    </>
  );
}
