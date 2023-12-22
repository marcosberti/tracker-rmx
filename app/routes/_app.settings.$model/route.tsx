import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import {
  Form,
  Link,
  Outlet,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";

import { Button } from "~/components/ui/button";
import { Categories, getCategoriesByUserId } from "~/models/categories.server";
import { Currencies, getCurrenciesByUserId } from "~/models/currencies.server";
import { Scheduled, getScheduledByUserId } from "~/models/scheduled.server";
import { requireUserId } from "~/session.server";
import { MODELS } from "~/utils";

import { CategoryList, deleteCategory } from "./categories";
import { CurrencyList, deleteCurrency } from "./currencies";
import { ScheduledList, deleteSchedule } from "./scheduled";

export async function action({ request, params }: ActionFunctionArgs) {
  const model = params.model;
  const formData = await request.formData();

  if (model === MODELS.CURRENCIES) {
    return deleteCurrency(formData);
  } else if (model === MODELS.CATEGORIES) {
    return deleteCategory(formData);
  } else if (model === MODELS.SCHEDULED) {
    return deleteSchedule(formData);
  } else {
    throw new Error(`Invalid URL for ${model}`);
  }
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  const userId = await requireUserId(request);
  const model = params.model;

  if (model === MODELS.CURRENCIES) {
    const items = await getCurrenciesByUserId(userId);

    return json([model, items]);
  } else if (model === MODELS.CATEGORIES) {
    const items = await getCategoriesByUserId(userId);

    return json([model, items]);
  } else if (model === MODELS.SCHEDULED) {
    const items = await getScheduledByUserId(userId);

    return json([model, items]);
  } else {
    throw new Error(`Invalid URL for ${model}`);
  }
}

export default function SettingIndexRoute() {
  const [model, items] = useLoaderData<typeof loader>();
  const isEmpty = items.length === 0;
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  let ItemComp;
  if (model === MODELS.CURRENCIES) {
    ItemComp = (
      <CurrencyList
        items={items as unknown as Currencies[]}
        isSubmitting={isSubmitting}
      />
    );
  } else if (model === MODELS.CATEGORIES) {
    ItemComp = (
      <CategoryList
        items={items as unknown as Categories[]}
        isSubmitting={isSubmitting}
      />
    );
  } else if (model === MODELS.SCHEDULED) {
    ItemComp = (
      <ScheduledList
        items={items as unknown as Scheduled[]}
        isSubmitting={isSubmitting}
      />
    );
  } else {
    throw new Error(`Invalid URL for ${model}`);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-end">
        <Button asChild>
          <Link to="new">New</Link>
        </Button>
      </div>
      <div>
        {isEmpty ? (
          <p className="text-center mt-4 font-semibold">No {model} yet</p>
        ) : null}
        <Form method="post" className="flex gap-4 flex-wrap">
          {ItemComp}
        </Form>
      </div>

      <Outlet />
    </div>
  );
}
