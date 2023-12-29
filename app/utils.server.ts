import { createCookie } from "@remix-run/node";

export const prefs = createCookie("prefs");
export const transactions = createCookie("transactions");
