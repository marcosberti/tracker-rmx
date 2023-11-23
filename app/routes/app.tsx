import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import { Link, NavLink, Outlet, useLocation } from "@remix-run/react";
import { BarChart2, Banknote, Settings } from "lucide-react";

import { requireUserId } from "~/session.server";

export const meta: MetaFunction = () => [{ title: "Tracker" }];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireUserId(request);
  return json({});
};

const ROUTES = [
  { path: "/app", icon: BarChart2, title: "Dashboard" },
  {
    path: "/app/accounts",
    icon: Banknote,
    title: "Accounts",
  },
  {
    path: "/app/settings",
    icon: Settings,
    title: "settings",
  },
];

function Navbar() {
  const location = useLocation();

  return (
    <nav className="border-r-2 border-gray-200 basis-[100px] min-h-screen flex flex-col items-center py-10 justify-between">
      <div>
        <Link to="/app">
          <div className="flex h-10 w-10 lg:h-16 lg:w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-green-300">
            <div className="select-none text-3xl lg:text-5xl font-bold text-gray-700">
              t
            </div>
          </div>
        </Link>
      </div>
      <div className="w-full">
        {ROUTES.map(({ path, title, icon: Icon }) => (
          <div
            key={path}
            className="group relative w-full text-gray-700 transition-all hover:bg-green-100"
          >
            <NavLink
              title={title}
              to={path}
              className="flex w-full justify-center py-3"
            >
              <Icon className="group-active:translate-y-[1px]" />
            </NavLink>

            {path === location.pathname ||
            (location.pathname.startsWith(path) && path !== "/app") ? (
              <div className="absolute -right-[2px] top-0 h-full w-[2px] transition-all group-hover:bg-green-700 lg:bg-green-700" />
            ) : null}
          </div>
        ))}
      </div>
      <div>user</div>
    </nav>
  );
}

export default function AppRoute() {
  return (
    <main className="relative min-h-screen bg-white flex text-gray-600">
      <Navbar />
      <div className="py-10 px-8 w-full">
        <Outlet />
      </div>
    </main>
  );
}
