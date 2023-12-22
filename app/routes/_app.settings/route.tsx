import { Outlet } from "@remix-run/react";

import { Tabs } from "~/components/components";

const TABS = ["currencies", "categories", "scheduled", "installments"];

export default function AccountsRoute() {
  return (
    <div className="h-full flex flex-col gap-6">
      <div>
        <h1 className="text-4xl font-bold">Settings</h1>
      </div>
      <div className="flex flex-col gap-4">
        <Tabs tabs={TABS} />
        <Outlet />
      </div>
    </div>
  );
}
