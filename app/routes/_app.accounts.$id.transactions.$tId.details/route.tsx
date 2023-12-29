import { LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { format } from "date-fns";
import invariant from "tiny-invariant";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";
import { getTransactionById } from "~/models/transactions.server";
import { requireUserId } from "~/session.server";
import { formatAmount } from "~/utils";

import Transaction from "../_app.accounts.$id.transactions/transaction-item";

export async function loader({ request, params }: LoaderFunctionArgs) {
  await requireUserId(request);
  const transactionId = params.tId;

  invariant(typeof transactionId === "string", "wrong url parameter");

  const transaction = await getTransactionById(transactionId);

  if (transaction === null) {
    return redirect("..");
  }

  return json({ transaction });
}

export default function TransactionDetails() {
  const { transaction } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const handleChange = () => {
    navigate("..");
  };

  return (
    <Sheet open onOpenChange={handleChange}>
      <SheetContent
        side="right"
        className="h-full overflow-y-scroll w-[40%] sm:max-w-2xl max-w-2xl"
      >
        <SheetHeader>
          <SheetTitle>Transaction details</SheetTitle>
        </SheetHeader>

        <div className="mt-8 flex flex-col gap-2 px-4">
          <div className="flex justify-between items-center">
            <p className="text-sm font-light ">title:</p>
            <p>{transaction.title}</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-sm font-light ">date:</p>
            <p>{format(transaction.createdAt, "d MMM. yyyy")}</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-sm font-light ">amount:</p>
            <p>
              {formatAmount(
                Number(transaction.amount),
                transaction.currency.code,
              )}
            </p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-sm font-light ">category:</p>
            <p>{transaction.category.name}</p>
          </div>
          {transaction.description ? (
            <div className="flex flex-col justify-between items-start mt-4">
              <p className="text-sm font-light">description</p>
              <p>{transaction.description}</p>
            </div>
          ) : null}

          {transaction.childTransactions.length ? (
            <div className="mt-6">
              <h3 className="font-semibold mb-4">sub items</h3>

              <ol className="flex flex-col gap-2">
                {transaction.childTransactions.map((tx) => (
                  <li key={tx.id}>
                    <Transaction.Item transaction={tx} />
                  </li>
                ))}
              </ol>
            </div>
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  );
}
