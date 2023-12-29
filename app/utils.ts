import { Prisma } from "@prisma/client";
import { useMatches } from "@remix-run/react";
import { endOfMonth, format, startOfMonth } from "date-fns";
import { useMemo } from "react";
import colors from "tailwindcss/colors";

import type { Users } from "~/models/users.server";

const DEFAULT_REDIRECT = "/";

const ToFilter = [
  "black",
  "blueGray",
  "coolGray",
  "current",
  "inherit",
  "lightBlue",
  "transparent",
  "trueGray",
  "warmGray",
  "white",
];

export const COLORS = Object.keys(colors)
  .filter((color) => !ToFilter.includes(color))
  .sort((a, b) => (a > b ? 1 : -1));

type ColorsTypes = Record<string, string>;
export const TAILWIND_BG: ColorsTypes = {
  amber: "bg-amber-500",
  blue: "bg-blue-500",
  cyan: "bg-cyan-500",
  emerald: "bg-emerald-500",
  fuchsia: "bg-fuchsia-500",
  gray: "bg-gray-500",
  green: "bg-green-500",
  indigo: "bg-indigo-500",
  lightBlue: "bg-lightBlue-500",
  lime: "bg-lime-500",
  neutral: "bg-neutral-500",
  orange: "bg-orange-500",
  pink: "bg-pink-500",
  purple: "bg-purple-500",
  red: "bg-red-500",
  rose: "bg-rose-500",
  sky: "bg-sky-500",
  slate: "bg-slate-500",
  stone: "bg-stone-500",
  teal: "bg-teal-500",
  violet: "bg-violet-500",
  yellow: "bg-yellow-500",
  zinc: "bg-zinc-500",
};
export const TAILWIND_COLOR: ColorsTypes = {
  amber: "text-amber-700",
  blue: "text-blue-700",
  cyan: "text-cyan-700",
  emerald: "text-emerald-700",
  fuchsia: "text-fuchsia-700",
  gray: "text-gray-700",
  green: "text-green-700",
  indigo: "text-indigo-700",
  lightBlue: "text-lightBlue-700",
  lime: "text-lime-700",
  neutral: "text-neutral-700",
  orange: "text-orange-700",
  pink: "text-pink-700",
  purple: "text-purple-700",
  red: "text-red-700",
  rose: "text-rose-700",
  sky: "text-sky-700",
  slate: "text-slate-700",
  stone: "text-stone-700",
  teal: "text-teal-700",
  violet: "text-violet-700",
  yellow: "text-yellow-700",
  zinc: "text-zinc-700",
};

type UpperModels = Uppercase<Prisma.ModelName>;
type LowerModels = Lowercase<Prisma.ModelName>;

export const MODELS = Object.keys(Prisma.ModelName).reduce(
  (acc, model) => {
    acc[model.toUpperCase() as UpperModels] =
      model.toLocaleLowerCase() as LowerModels;

    return acc;
  },
  {} as Record<Uppercase<UpperModels>, Lowercase<LowerModels>>,
);

/**
 * This should be used any time the redirect path is user-provided
 * (Like the query string on our login/signup pages). This avoids
 * open-redirect vulnerabilities.
 * @param {string} to The redirect destination
 * @param {string} defaultRedirect The redirect to use if the to is unsafe.
 */
export function safeRedirect(
  to: FormDataEntryValue | string | null | undefined,
  defaultRedirect: string = DEFAULT_REDIRECT,
) {
  if (!to || typeof to !== "string") {
    return defaultRedirect;
  }

  if (!to.startsWith("/") || to.startsWith("//")) {
    return defaultRedirect;
  }

  return to;
}

/**
 * This base hook is used in other hooks to quickly search for specific data
 * across all loader data using useMatches.
 * @param {string} id The route id
 * @returns {JSON|undefined} The router data or undefined if not found
 */
export function useMatchesData(
  id: string,
): Record<string, unknown> | undefined {
  const matchingRoutes = useMatches();
  const route = useMemo(
    () => matchingRoutes.find((route) => route.id === id),
    [matchingRoutes, id],
  );
  return route?.data as Record<string, unknown>;
}

function isUser(user: unknown): user is Users {
  return (
    user != null &&
    typeof user === "object" &&
    "email" in user &&
    typeof user.email === "string"
  );
}

export function useOptionalUser(): Users | undefined {
  const data = useMatchesData("root");
  if (!data || !isUser(data.user)) {
    return undefined;
  }
  return data.user;
}

export function useUser(): Users {
  const maybeUser = useOptionalUser();
  if (!maybeUser) {
    throw new Error(
      "No user found in root loader, but user is required by useUser. If user is optional, try useOptionalUser instead.",
    );
  }
  return maybeUser;
}

export function validateEmail(email: unknown): email is string {
  return typeof email === "string" && email.length > 3 && email.includes("@");
}

export function formatAmount(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("es-AR", {
      currency,
      style: "currency",
      maximumFractionDigits: currency === "BTC" ? 20 : 2,
    }).format(amount);
  } catch (e) {
    return new Intl.NumberFormat("es-AR", {
      currency: "ARS",
      style: "currency",
      maximumFractionDigits: 2,
    }).format(amount);
  }
}

export function timer(time: number) {
  return new Promise((res) => {
    setTimeout(() => {
      res("");
    }, time);
  });
}

export function validateSimpleValue(value: string | number, prop: string) {
  return !value ? `${prop} is required` : null;
}

export function getMonthLimits(year: number, month: number) {
  const date = new Date(year, month, 1);
  const from = startOfMonth(date);
  const to = endOfMonth(date);

  return { from: from.toISOString(), to: to.toISOString() };
}

export function getParamsMonth(params: URLSearchParams) {
  const monthParam = params.get("month");

  if (!monthParam) {
    const date = new Date();
    const month = date.getMonth();
    const year = date.getFullYear();
    return { month, year };
  }

  const [year, month] = monthParam.split("-");

  return {
    year: Number(year),
    month: Number(month) - 1,
  };
}

export function getMonthName(year: number, month: number) {
  const date = new Date(year, month, 1);
  return format(date, "MMMM");
}
