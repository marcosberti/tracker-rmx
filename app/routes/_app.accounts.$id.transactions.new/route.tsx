import { Prisma } from "@prisma/client";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import {
  Form,
  useActionData,
  useFetcher,
  useLoaderData,
  useNavigation,
  useSubmit,
} from "@remix-run/react";
import { Loader2, Trash2 } from "lucide-react";
import invariant from "tiny-invariant";

import { ErrorMessage } from "~/components/components";
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";
import { Textarea } from "~/components/ui/textarea";
import { getAccountCurrency } from "~/models/accounts.server";
import { getCategoriesByUserId } from "~/models/categories.server";
import {
  CreateTransactionType,
  createTransaction,
  createTransactionSubItems,
} from "~/models/transactions.server";
import { requireUserId } from "~/session.server";
import { formatAmount, validateSimpleValue } from "~/utils";
import { transactions } from "~/utils.server";

interface ErrorsAttrType {
  title?: null | string;
  date?: null | string;
  amount?: null | string;
  category?: null | string;
}

type ErrorsType = Record<string, ErrorsAttrType>;

interface SubItemsFormType {
  errors?: ErrorsAttrType;
  onClose: () => void;
}

interface SubItemType {
  id?: string;
  tempId?: string;
  title: string;
  description?: string;
  amount: number;
}

export async function action({ request, params }: ActionFunctionArgs) {
  const userId = await requireUserId(request);
  const accountId = params.id;
  invariant(typeof accountId === "string", "description is required");

  const account = await getAccountCurrency(userId, accountId);

  const formData = await request.formData();
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await transactions.parse(cookieHeader)) || {};

  const intent = formData.get("intent") as string;
  const errors: ErrorsType = {
    [intent]: {},
  };

  if (intent === "addSubItemOpen") {
    cookie.isAddingSubItem = true;

    return json(
      { errors },
      {
        headers: {
          "Set-Cookie": await transactions.serialize(cookie),
        },
      },
    );
  } else if (intent === "addSubItemClose") {
    cookie.isAddingSubItem = false;

    return json(
      { errors },
      {
        headers: {
          "Set-Cookie": await transactions.serialize(cookie),
        },
      },
    );
  } else if (intent === "leaving") {
    cookie.subItems = [];
    cookie.isAddingSubItem = false;
    return redirect("..", {
      headers: {
        "Set-Cookie": await transactions.serialize(cookie),
      },
    });
  } else if (intent.startsWith("deleteSubItem")) {
    const subItemId = intent.split("-")[1];
    const subItems: SubItemType[] = cookie.subItems;

    cookie.subItems = subItems.filter(
      (item) => (item.id ?? item.tempId) !== subItemId,
    );
    return json(
      { errors },
      {
        headers: {
          "Set-Cookie": await transactions.serialize(cookie),
        },
      },
    );
  } else {
    // transaction or sub-item
    const title = formData.get("title");
    const date = formData.get("date");
    const amount = Number(formData.get("amount")) as unknown as Prisma.Decimal;
    const category = formData.get("category");
    const description = formData.get("description");
    const isIncome = formData.get("isIncome") === "on";

    invariant(typeof intent === "string", "intent is required");
    invariant(typeof title === "string", "title is required");
    invariant(typeof amount === "number", "amount is required");
    invariant(typeof category === "string", "category is required");
    invariant(typeof description === "string", "description is required");

    errors[intent].title = validateSimpleValue(title, "title");
    errors[intent].amount = validateSimpleValue(amount, "amount");
    errors[intent].category = validateSimpleValue(category, "category");

    if (intent === "transaction") {
      invariant(typeof date === "string", "date is required");
      errors[intent].date = validateSimpleValue(date, "date");
    }

    if (Object.values(errors[intent]).filter(Boolean).length) {
      return json({ errors });
    }

    const transaction: CreateTransactionType = {
      title,
      createdAt: new Date(`${date}T00:00:00`),
      amount,
      categoryId: category,
      description,
      userId,
      accountId,
      type: isIncome ? "income" : "expense",
      currencyId: account!.currency!.id,
      installmentId: null,
      parentTransactionId: null,
      scheduledId: null,
    };

    if (intent === "transaction") {
      const [tx] = await createTransaction(transaction);

      if (cookie.subItems?.length) {
        const subItems = cookie.subItems.map((item: SubItemType) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { tempId: _, ...data } = item;

          return {
            ...data,
            createdAt: tx.createdAt,
            parentTransactionId: tx.id,
          };
        });

        await createTransactionSubItems(subItems);
      }

      cookie.subItems = [];

      return redirect("..", {
        headers: {
          "Set-Cookie": await transactions.serialize(cookie),
        },
      });
    } else {
      const subItems: SubItemType[] = cookie.subItems ?? [];
      cookie.isAddingSubItem = false;
      cookie.subItems = [
        ...subItems,
        { ...transaction, tempId: String(Date.now()) },
      ];
    }
  }

  return json(
    { errors },
    {
      headers: {
        "Set-Cookie": await transactions.serialize(cookie),
      },
    },
  );
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  const userId = await requireUserId(request);
  const accountId = params.id;
  const categories = await getCategoriesByUserId(userId);
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await transactions.parse(cookieHeader)) || {};
  const subItems: SubItemType[] = cookie.subItems ?? [];
  const isAddingSubItem = cookie.isAddingSubItem;

  invariant(typeof accountId === "string", "accountId is required");
  const account = await getAccountCurrency(userId, accountId);

  return json({ account, categories, subItems, isAddingSubItem });
}

function SubItems() {
  const { account } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const fetcher = useFetcher();
  const { subItems, isAddingSubItem } = useLoaderData<typeof loader>();

  const handleFormClose = () => {
    fetcher.submit({ intent: "addSubItemClose" }, { method: "post" });
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">Sub items</h3>

          <fetcher.Form method="post">
            <Button variant="outline" name="intent" value="addSubItemOpen">
              add
            </Button>
          </fetcher.Form>
        </div>
        <div className="flex flex-col gap-2">
          {!subItems.length ? (
            <div className="flex justify-center">
              <p className="text-sm">no subitems</p>
            </div>
          ) : null}
          {subItems.map((subItem) => (
            <div
              key={subItem.id ?? subItem.tempId}
              className="p-4 rounded-lg bg-gray-50"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm">{subItem.title}</p>
                  {subItem.description ? (
                    <p className="text-xs">{subItem.description}</p>
                  ) : null}
                </div>
                <div className="flex gap-2 items-center">
                  <p>{formatAmount(subItem.amount, account!.currency.code)}</p>
                  <fetcher.Form method="post">
                    <Button
                      name="intent"
                      value={`deleteSubItem-${subItem.id ?? subItem.tempId}`}
                      variant="ghost"
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </fetcher.Form>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {isAddingSubItem ? (
        <SubItemsForm
          errors={actionData?.errors?.subiItem}
          onClose={handleFormClose}
        />
      ) : null}
    </>
  );
}

function SubItemsForm({ errors, onClose }: SubItemsFormType) {
  return (
    <Sheet open onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="h-full overflow-y-scroll w-[40%] sm:max-w-2xl max-w-2xl"
      >
        <SheetHeader>
          <SheetTitle>New sub item</SheetTitle>
        </SheetHeader>
        <Form method="post" className="flex flex-col gap-4">
          <TransactionForm hideDate errors={errors} />
          <div>
            <Button name="intent" value="subiItem" type="submit">
              Save
            </Button>
          </div>
        </Form>
      </SheetContent>
    </Sheet>
  );
}

function TransactionForm({
  hideDate = false,
  errors,
}: {
  hideDate?: boolean;
  errors?: ErrorsAttrType;
}) {
  const { categories } = useLoaderData<typeof loader>();

  return (
    <>
      <div className="flex gap-2">
        <div className="basis-[50%]">
          <Label htmlFor="title">
            Title <ErrorMessage message={errors?.title} />
          </Label>
          <Input id="title" name="title" />
        </div>
        <div className="basis-[50%]">
          <Label htmlFor="date">
            Date <ErrorMessage message={errors?.date} />
          </Label>
          <Input id="date" name="date" type="date" disabled={hideDate} />
        </div>
      </div>
      <div className="flex gap-2">
        <div className="basis-[50%]">
          <Label>
            Amount <ErrorMessage message={errors?.amount} />
          </Label>
          <Input id="amount" name="amount" type="number" />
        </div>
        <div className="basis-[50%]">
          <Label>
            Category <ErrorMessage message={errors?.category} />
          </Label>

          <Select name="category">
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea className="resize-none" id="description" name="description" />
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="isIncome" name="isIncome" />
        <Label htmlFor="isIncome">is income?</Label>
      </div>
    </>
  );
}

export default function NewTransactionRoute() {
  const { isAddingSubItem } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const submit = useSubmit();
  const navigation = useNavigation();
  const isSubmiting = navigation.state === "submitting";
  const handleChange = () => {
    if (isSubmiting) return;
    submit({ intent: "leaving" }, { method: "post" });
  };

  return (
    <Sheet open onOpenChange={handleChange}>
      <SheetContent
        side="right"
        className={`h-full overflow-y-scroll w-[40%] sm:max-w-2xl max-w-2xl ${
          isAddingSubItem ? "-translate-x-28" : null
        }`}
      >
        <SheetHeader>
          <SheetTitle>New transaction</SheetTitle>
        </SheetHeader>
        <Form id="transaction" method="post" className="flex flex-col gap-4">
          <TransactionForm errors={actionData?.errors?.transaction} />
        </Form>
        <div className="mt-4">
          <SubItems />
        </div>
        <div className="mt-4">
          <Button
            form="transaction"
            type="submit"
            name="intent"
            value="transaction"
            disabled={isSubmiting}
          >
            Save
            {isSubmiting ? (
              <Loader2 className="ml-2 w-4 h-4 animate-spin" />
            ) : null}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
