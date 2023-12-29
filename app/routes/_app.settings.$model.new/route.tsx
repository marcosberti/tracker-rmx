import { Prisma } from "@prisma/client";
import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
  useNavigation,
} from "@remix-run/react";
import { Loader2 } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";
import { getAccountsByUserId } from "~/models/accounts.server";
import { getCategoriesByUserId } from "~/models/categories.server";
import { getCurrenciesByUserId } from "~/models/currencies.server";
import { requireUserId } from "~/session.server";
import { MODELS } from "~/utils";

import { CategoryForm, createCategory } from "./category";
import { CurrencyForm, createCurrency } from "./currency";
import {
  ScheduledDataPropInterface,
  ScheduledForm,
  createScheduled,
} from "./scheduled";

type Models = Uncapitalize<
  Exclude<Prisma.ModelName, "Users" | "Passwords" | "Accounts" | "Transactions">
>;

type ModelType = Record<Models, string>;
const MODEL_NAME: ModelType = {
  currencies: "currency",
  categories: "category",
  installments: "installment",
  scheduled: "scheduled",
};

export interface ErrorTypes {
  name?: string | null;
  code?: string | null;
  icon?: string | null;
  color?: string | null;
  category?: string | null;
  amount?: string | null;
  account?: string | null;
  description?: string | null;
  currency?: string | null;
  from?: string | null;
  to?: string | null;
}

export async function action({ request, params }: ActionFunctionArgs) {
  const model = params.model as Models;

  const userId = await requireUserId(request);
  const formData = await request.formData();

  if (model === MODELS.CURRENCIES) {
    return createCurrency(userId, formData);
  } else if (model === MODELS.CATEGORIES) {
    return createCategory(userId, formData);
  } else if (model === MODELS.SCHEDULED) {
    return createScheduled(userId, formData);
  } else {
    throw new Error(`Invalid URL for ${model}`);
  }
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  const userId = await requireUserId(request);
  const model = params.model as Models;
  let data = {};

  if (model === MODELS.SCHEDULED) {
    const currenciesPromise = getCurrenciesByUserId(userId);
    const categoriesPromise = getCategoriesByUserId(userId);
    const accountsPromise = getAccountsByUserId(userId);

    const [currencies, categories, accounts] = await Promise.all([
      currenciesPromise,
      categoriesPromise,
      accountsPromise,
    ]);

    data = { currencies, categories, accounts };
  }

  return json({ model, data });
}

export default function SettingIndexRoute() {
  const { model, data } = useLoaderData<typeof loader>();
  const { errors } = useActionData<typeof action>() ?? {};
  const navigate = useNavigate();
  const navigation = useNavigation();
  const isSubmiting = navigation.state === "submitting";
  const handleChange = () => {
    if (isSubmiting) return;
    navigate("..");
  };

  let FormFields;

  if (model === MODELS.CURRENCIES) {
    FormFields = <CurrencyForm errors={errors} />;
  } else if (model === MODELS.CATEGORIES) {
    FormFields = <CategoryForm errors={errors} />;
  } else if (model === MODELS.SCHEDULED) {
    FormFields = (
      <ScheduledForm
        data={data as ScheduledDataPropInterface}
        errors={errors}
      />
    );
  } else {
    throw new Error(`Invalid URL for ${model}`);
  }

  return (
    <Sheet open onOpenChange={handleChange}>
      <SheetContent side="right" className="h-full overflow-y-scroll ">
        <SheetHeader>
          <SheetTitle>New {MODEL_NAME[model]}</SheetTitle>
        </SheetHeader>
        <Form method="post" className="flex flex-col gap-4">
          {FormFields}
          <div>
            <Button type="submit" disabled={isSubmiting}>
              Save
              {isSubmiting ? (
                <Loader2 className="ml-2 w-4 h-4 animate-spin" />
              ) : null}
            </Button>
          </div>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
