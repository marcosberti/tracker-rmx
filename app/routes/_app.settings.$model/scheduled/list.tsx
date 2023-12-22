import { format } from "date-fns";
import { Trash2 } from "lucide-react";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Scheduled } from "~/models/scheduled.server";
import { formatAmount } from "~/utils";

interface CompProps<Item> {
  items: Item[];
  isSubmitting: boolean;
}

export default function ScheduledItem(props: CompProps<Scheduled>) {
  const { items, isSubmitting } = props;

  return items.map((item) => (
    <div
      key={item.id}
      className="flex gap-4 items-center bg-gray-50 rounded-lg p-4 min-w-[20rem]"
    >
      <div className="flex flex-col gap-1">
        <p className="text-lg font-semibold flex items-center">
          <span className="mr-2">{item.title}</span>
          <Badge variant={item.active ? "default" : "destructive"}>
            {item.active ? "active" : "inactive"}
          </Badge>
        </p>
        <p className="text-xs">{item.account!.name}</p>
        {item.description ? (
          <p className="text-sm">{item.description}</p>
        ) : null}
        <p className="text-sm">From: {format(item.from, "d MMM yy")}</p>
        {item.to ? (
          <p className="text-sm">To: {format(item.to, "d MMM yy")}</p>
        ) : null}
      </div>
      <div className="h-full flex items-center">
        <p className="text-2xl font-bold">
          {formatAmount(Number(item.amount), item.currency!.code)}
        </p>
      </div>
      <div className="ml-auto">
        <Button
          type="submit"
          name="scheduled"
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
