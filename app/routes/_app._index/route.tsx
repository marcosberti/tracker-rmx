import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { Link, useFetcher, useLoaderData } from "@remix-run/react";
import { format } from "date-fns";
import { Building, MoveDown, MoveUp } from "lucide-react";

import { Icon, LucideIconType, Overview } from "~/components/components";
import {
  getAccountBalance,
  getAccountsByUserId,
} from "~/models/accounts.server";
import { requireUserId } from "~/session.server";
import { formatAmount } from "~/utils";
import { prefs } from "~/utils.server";

import MonthlyChart from "./monthly-chart";

export async function action({ request }: ActionFunctionArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await prefs.parse(cookieHeader)) || {};
  const formData = await request.formData();

  const selectedAccountId = formData.get("account");
  cookie.selectedAccountId = selectedAccountId;

  return json(selectedAccountId, {
    headers: {
      "Set-Cookie": await prefs.serialize(cookie),
    },
  });
}

interface DataType<AccountType> {
  accounts: AccountType;
  income: string;
  expense: string;
  balance: string;
  selectedAccountId?: string;
  accountCode?: string;
  transactions: [];
}

interface OptionsType {
  headers?: Record<string, string>;
}

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await requireUserId(request);
  const accounts = await getAccountsByUserId(userId);
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await prefs.parse(cookieHeader)) || {};

  let selectedAccountId: string;

  const data: DataType<typeof accounts> = {
    income: "0",
    expense: "0",
    balance: "0",
    accounts,
    transactions: [],
  };

  const options: OptionsType = {};
  if (accounts.length) {
    if (cookie.selectedAccountId) {
      selectedAccountId = (
        accounts.find((a) => a.id === cookie.selectedAccountId) ?? accounts[0]
      ).id;
    } else {
      cookie.selectedAccountId = selectedAccountId = accounts[0].id;
      options.headers = {
        "Set-Cookie": await prefs.serialize(cookie),
      };
    }

    const date = new Date();
    const { balance, income, expense } = await getAccountBalance(
      selectedAccountId,
      date.getMonth(),
      date.getFullYear(),
    );
    const account = accounts.find((a) => a.id === selectedAccountId);
    data.selectedAccountId = selectedAccountId;
    data.accountCode = account!.currency.code;
    data.income = income;
    data.expense = expense;
    data.balance = balance;
  }

  return json(data, options);
}

function Header() {
  const fetcher = useFetcher();
  const data = useLoaderData<typeof loader>();

  return (
    <div className="flex gap-2 items-end">
      <h1 className="text-4xl font-bold">Dashboard</h1>
      <fetcher.Form method="post" className="flex gap-1">
        {data.accounts.map((account) => (
          <button
            key={account.id}
            name="account"
            value={account.id}
            className={`p-1 border-[1px] text-xs rounded-lg ${
              data.selectedAccountId === account.id
                ? "border-green-700 bg-green-200 text-green-700"
                : null
            }`}
          >
            {account.name}
          </button>
        ))}
      </fetcher.Form>
    </div>
  );
}

function IndexOverview() {
  const data = useLoaderData<typeof loader>();

  return (
    <Overview
      balance={data.balance}
      income={data.income}
      expense={data.expense}
    />
  );
}

function RecentActivity() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="grow basis-[35%] border-2 border-gray-100 rounded-lg p-4 flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <p className="text-lg font-semibold">Recent activity</p>
        {data.selectedAccountId ? (
          <div className="group relative">
            <Link
              to={`/accounts/${data.selectedAccountId}/overview`}
              className="text-blue-400 text-sm"
            >
              see all
            </Link>
            <div className="absolute bottom-[1px] h-[2px] w-full bg-transparent  transition-all group-hover:bg-blue-400" />
          </div>
        ) : null}
      </div>
      <div>
        <ol className="flex flex-col gap-2">
          {data.transactions.map((transaction) => (
            <li key={transaction.id}>
              <div className="flex justify-between items-center gap-1 bg-gray-50 p-2 rounded-lg">
                <div className="flex items-center gap-2">
                  <Icon
                    icon={transaction.icon as LucideIconType}
                    className="w-6 h-6"
                  />
                  <div>
                    <p className="font-semibold">{transaction.title}</p>
                    <p className="text-xs">
                      {format(transaction.date, "d MMM. yyyy")}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1 items-center">
                  <MoveUp className="w-3 h-3 text-green-600" />
                  <p className="font-bold">
                    {formatAmount(transaction.amount, data.accountCode)}
                  </p>
                </div>
              </div>
            </li>
          ))}
          {!data.transactions.length ? (
            <li className="mt-12">
              <p className="text-xs font-semibold text-center">
                No transactios on this account yet
              </p>
            </li>
          ) : null}
        </ol>
      </div>
    </div>
  );
}

export default function AccountsRoute() {
  return (
    <div className="h-full flex flex-col gap-6">
      <Header />
      <div className="flex grow gap-6">
        <div className="flex flex-col gap-6 basis-[65%]">
          <IndexOverview />
          <MonthlyChart />
        </div>
        <RecentActivity />
      </div>
    </div>
  );
}
