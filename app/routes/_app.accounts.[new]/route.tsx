import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import { Form, Outlet, useActionData, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { ErrorMessage, IconsCombobox } from "~/components/components";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { createAccount } from "~/models/accounts.server";
import { getCurrenciesByUserId } from "~/models/currencies.server";
import { requireUserId } from "~/session.server";
import { COLORS, TAILWIND_BG } from "~/utils";

function validateName(name: string) {
  return name === "" ? "name is required" : null;
}

function validateIcon(icon: string) {
  return icon === "" ? "icon is required" : null;
}

function validateColor(color: string) {
  return color === "" ? "color is required" : null;
}

function validateCurrency(currencyId: string) {
  return currencyId === "" ? "currency is required" : null;
}

export async function action({ request }: ActionFunctionArgs) {
  const userId = await requireUserId(request);

  const formData = await request.formData();

  const name = formData.get("name");
  const icon = formData.get("icon");
  const main = formData.get("main") === "on";
  const color = formData.get("color");
  const currencyId = formData.get("currencyId");
  invariant(typeof name === "string", "name is required");
  invariant(typeof icon === "string", "icon is required");
  invariant(typeof color === "string", "color is required");
  invariant(typeof currencyId === "string", "currencyId is required");

  const errors = {
    name: validateName(name),
    icon: validateIcon(icon),
    color: validateColor(color),
    currencyId: validateCurrency(currencyId),
  };

  if (
    errors.name !== null ||
    errors.icon !== null ||
    errors.color !== null ||
    errors.currencyId !== null
  ) {
    return json({ errors });
  }

  const account = await createAccount({
    name,
    color,
    icon,
    main,
    userId,
    currencyId,
  });

  // create
  return redirect(`/accounts/${account.id}/overview`);
}

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await requireUserId(request);
  const currencies = await getCurrenciesByUserId(userId);
  return json({ currencies });
}

export default function Index() {
  const { currencies } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="h-10 flex items-end">
          <h2 className="text-2xl font-bold">Create a new account</h2>
        </div>
        <Form id="account-form" method="post" className="flex flex-col gap-4">
          <div className="flex gap-4">
            <div className="basis-[50%]">
              <Label htmlFor="name">
                Name
                <ErrorMessage message={actionData?.errors?.name} />
              </Label>
              <Input
                id="name"
                name="name"
                aria-invalid={Boolean(actionData?.errors?.name) || undefined}
                aria-errormessage={
                  actionData?.errors?.name ? "name-error" : undefined
                }
              />
            </div>
            <div className="basis-[50%]">
              <Label htmlFor="currencyId">
                Currency
                <ErrorMessage message={actionData?.errors?.currencyId} />
              </Label>
              <Select name="currencyId">
                <SelectTrigger className="">
                  <SelectValue placeholder="Select a currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.id} value={currency.id}>
                      {currency.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="basis-[50%] ">
              <Label htmlFor="icon">
                Icon
                <ErrorMessage message={actionData?.errors?.icon} />
              </Label>
              <div>
                <IconsCombobox name="icon" />
              </div>
            </div>
            <div className="basis-[50%]">
              <Label htmlFor="color">Color</Label>
              <Select name="color">
                <SelectTrigger className="">
                  <SelectValue placeholder="Select a color" />
                </SelectTrigger>
                <SelectContent>
                  {COLORS.map((color) => (
                    <SelectItem key={color} value={color}>
                      <span
                        className={`mr-2 inline-block h-2 w-2 rounded-full ${TAILWIND_BG[color]} `}
                      />
                      {color}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <Checkbox id="main" name="main" />
            <Label htmlFor="main">is this your main account?</Label>
          </div>
          <div>
            <Button form="account-form" type="submit">
              Save
            </Button>
          </div>
        </Form>
      </div>
      <Outlet />
    </>
  );
}
