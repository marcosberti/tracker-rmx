import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import {
  Icon,
  LucideIconType,
  MonthFilter,
  Overview,
} from "~/components/components";
import { getAccountBalance } from "~/models/accounts.server";
import {
  getSummarizedByCategories,
  getSummarizedByType,
} from "~/models/transactions.server";
import { requireUserId } from "~/session.server";
import {
  TAILWIND_BG,
  TAILWIND_COLOR,
  formatAmount,
  getMonthLimits,
  getMonthName,
  getParamsMonth,
} from "~/utils";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const userId = await requireUserId(request);
  const accountId = params.id;
  const searchParams = new URL(request.url).searchParams;

  invariant(typeof accountId === "string", "accountId is required");

  const { month, year } = getParamsMonth(searchParams);

  const { from, to } = getMonthLimits(year, month);
  const monthName = getMonthName(year, month);
  const accP = getAccountBalance(userId, accountId);
  const txP = getSummarizedByType(userId, accountId, from, to);
  const catP = getSummarizedByCategories(userId, accountId, from, to);

  const [account, transactions, _categories] = await Promise.all([
    accP,
    txP,
    catP,
  ]);

  const balance = formatAmount(
    Number(account!.balance),
    account!.currency.code,
  );
  const income = formatAmount(transactions.income, account!.currency.code);
  const expense = formatAmount(transactions.expense, account!.currency.code);

  const categories = _categories.map((c) => ({
    ...c,
    amount: formatAmount(c.amount, account!.currency.code),
  }));

  return json({ balance, income, expense, categories, monthName });
}

function Categories() {
  const { categories, monthName } = useLoaderData<typeof loader>();

  return !categories.length ? (
    <div className="flex justify-center">
      <p className="text-lg">No data in {monthName} yet</p>
    </div>
  ) : (
    <div className="flex gap-2 flex-wrap">
      {categories.map((c) => (
        <div
          key={c.id}
          className={`basis-[49%] rounded-lg p-4 flex justify-between items-center gap-6 bg-opacity-20 ${
            TAILWIND_BG[c.color]
          }`}
        >
          <div className="flex items-center gap-2">
            <span className={TAILWIND_COLOR[c!.color]}>
              <Icon icon={c.icon as LucideIconType} className="h-6 w-6" />
            </span>
            <span className="text-sm">{c.name}</span>
          </div>
          <div>
            <p className="text-lg font-semibold">{c.amount}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AccountOverviewRoute() {
  const { balance, income, expense } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <MonthFilter />
      </div>
      <Overview balance={balance} income={income} expense={expense} />
      <Categories />
    </div>
  );
}
