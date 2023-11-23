import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { Link, useFetcher, useLoaderData } from "@remix-run/react";
import { Building, MoveDown, MoveUp } from "lucide-react";

import MonthlyChart from "~/components/monthly-chart";
import { formatAmount } from "~/utils";
import { prefs } from "~/utils.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await prefs.parse(cookieHeader)) || {};

  const accounts = [
    { id: "bbva", name: "bbva", currency: { code: "ARS" } },
    { id: "payo", name: "payo", currency: { code: "ARS" } },
    { id: "muun", name: "muun", currency: { code: "ARS" } },
    { id: "balanz", name: "balanz", currency: { code: "ARS" } },
  ];
  let selectedAccount = accounts[0];

  if (cookie.selectedAccountId) {
    selectedAccount =
      accounts.find((a) => a.id === cookie.selectedAccountId) ?? accounts[0];
  }

  const data = {
    income: formatAmount(12000, selectedAccount.currency.code),
    expense: formatAmount(5000, selectedAccount.currency.code),
    balance: formatAmount(7000, selectedAccount.currency.code),
    accounts: [
      { id: "bbva", name: "bbva" },
      { id: "payo", name: "payo" },
      { id: "muun", name: "muun" },
      { id: "balanz", name: "balanz" },
    ],
    selectedAccount,
  };

  return json(data);
}

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
              data.selectedAccount?.id === account.id
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

function Overview() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="w-full basis-auto border-2 border-gray-100 rounded-lg p-4 flex justify-between items-center">
      <div className="text-center">
        <p className="text-xs font-semibold text-gray-400">income</p>
        <p className="text-2xl font-bold">{data.income ?? "-"}</p>
      </div>
      <div className="text-center">
        <p className="text-xs font-semibold text-gray-400">expense</p>
        <p className="text-2xl font-bold">{data.expense ?? "-"}</p>
      </div>
      <div className="text-center">
        <p className="text-xs font-semibold text-gray-400">balance</p>
        <p className="text-2xl font-bold">{data.balance ?? "-"}</p>
      </div>
    </div>
  );
}

function RecentActivity() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="grow basis-[35%] border-2 border-gray-100 rounded-lg p-4 flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <p className="text-lg font-semibold">Recent activity</p>
        <div className="group relative">
          <Link
            to={`/app/accounts/${data.selectedAccount.id}`}
            className="text-blue-400 text-sm"
          >
            see all
          </Link>
          <div className="absolute bottom-[1px] h-[2px] w-full bg-transparent  transition-all group-hover:bg-blue-400" />
        </div>
      </div>
      <div>
        <ol className="flex flex-col gap-2">
          <li>
            <div className="flex justify-between items-center gap-1 bg-gray-50 p-2 rounded-lg">
              <div className="flex items-center gap-2">
                <Building className="w-6 h-6" />
                <div>
                  <p className="font-semibold">title</p>
                  <p className="text-xs">12 nov. 2023</p>
                </div>
              </div>
              <div className="flex gap-1 items-center">
                <MoveUp className="w-3 h-3 text-green-600" />
                <p className="font-bold">$ 12,999.50</p>
              </div>
            </div>
          </li>
          <li>
            <div className="flex justify-between items-center gap-1 bg-gray-50 p-2 rounded-lg">
              <div className="flex items-center gap-2">
                <Building className="w-6 h-6" />
                <div>
                  <p className="font-semibold">title</p>
                  <p className="text-xs">12 nov. 2023</p>
                </div>
              </div>
              <div className="flex gap-1 items-center">
                <MoveDown className="w-3 h-3 text-red-600" />
                <p className="font-bold">$ 12,999.50</p>
              </div>
            </div>
          </li>
          <li className="mt-12">
            <p className="text-xs font-semibold text-center">
              No transactios on this account yet
            </p>
          </li>
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
          <Overview />
          <MonthlyChart />
        </div>
        <RecentActivity />
      </div>
    </div>
  );
}
