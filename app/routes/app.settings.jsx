import { Outlet } from "@remix-run/react";

export default function AccountsRoute() {
  return (
    <div>
      settings {`->`} <Outlet />{" "}
    </div>
  );
}
