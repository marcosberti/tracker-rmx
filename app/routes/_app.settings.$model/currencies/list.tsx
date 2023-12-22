import { Trash2 } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Currencies } from "~/models/currencies.server";
import { formatAmount } from "~/utils";

interface CompProps<Item> {
  items: Item[];
  isSubmitting: boolean;
}

export default function CurrencyItem(props: CompProps<Currencies>) {
  const { items, isSubmitting } = props;

  return items.map((item) => (
    <div
      key={item.id}
      className="flex gap-4 items-center bg-gray-50 rounded-lg p-4 min-w-[20rem]"
    >
      <div>
        <p className="text-xs">{item.name}</p>
        <p className="text-lg font-semibold">{item.code}</p>
      </div>
      <div className="h-full flex items-end">
        <p className="text-2xl font-bold">
          {formatAmount(123456.78, item.code)}
        </p>
      </div>
      <div className="ml-auto">
        <Button
          type="submit"
          name="currency"
          value={item.id}
          variant="link"
          disabled={isSubmitting}
          className="text-red-600"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  ));
}
