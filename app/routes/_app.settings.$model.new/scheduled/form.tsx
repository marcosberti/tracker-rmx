import { ErrorMessage } from "~/components/components";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import { Accounts } from "~/models/accounts.server";
import { Categories } from "~/models/categories.server";
import { Currencies } from "~/models/currencies.server";

import { ErrorTypes } from "../route";

export interface DataPropInterface {
  categories: Categories[];
  accounts: Accounts[];
  currencies: Currencies[];
}

interface Props {
  data: DataPropInterface;
  errors: ErrorTypes | undefined;
}

export default function ScheduledForm({
  data: { accounts, categories, currencies },
  errors,
}: Props) {
  return (
    <>
      <div className="flex gap-4">
        <div className="basis-[50%]">
          <Label htmlFor="title">
            Title
            <ErrorMessage message={errors?.name} />
          </Label>
          <Input id="title" name="title" />
        </div>
        <div className="basis-[50%]">
          <Label htmlFor="category">
            Category
            <ErrorMessage message={errors?.category} />
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
      <div className="flex gap-4">
        <div className="basis-[50%]">
          <Label htmlFor="amount">
            Amount
            <ErrorMessage message={errors?.amount} />
          </Label>
          <Input id="amount" name="amount" type="number" />
        </div>
        <div className="basis-[50%]">
          <Label htmlFor="currency">
            Currency
            <ErrorMessage message={errors?.currency} />
          </Label>
          <Select name="currency">
            <SelectTrigger>
              <SelectValue placeholder="Select a currency" />
            </SelectTrigger>
            <SelectContent>
              {currencies.map((currency) => (
                <SelectItem key={currency.id} value={currency.id}>
                  {currency.name} ({currency.code.toUpperCase()})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex gap-4">
        <div className="basis-[50%]">
          <Label htmlFor="from">
            From <ErrorMessage message={errors?.from} />
          </Label>
          <Input id="from" name="from" type="date" />
        </div>
        <div className="basis-[50%]">
          <Label htmlFor="to">
            To <ErrorMessage message={errors?.to} />
          </Label>
          <Input id="to" name="to" type="date" />
        </div>
      </div>
      <div>
        <Label htmlFor="account">
          Account
          <ErrorMessage message={errors?.account} />
        </Label>
        <Select name="account">
          <SelectTrigger>
            <SelectValue placeholder="Select a account" />
          </SelectTrigger>
          <SelectContent>
            {accounts.map((account) => (
              <SelectItem key={account.id} value={account.id}>
                {account.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" className="resize-none" />
      </div>
    </>
  );
}
