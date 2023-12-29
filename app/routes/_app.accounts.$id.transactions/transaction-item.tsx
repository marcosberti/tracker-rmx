import { format } from "date-fns";
import {
  ArrowDown,
  ArrowUp,
  MoreVerticalIcon,
  Pen,
  Trash2,
} from "lucide-react";

import { Icon, LucideIconType } from "~/components/components";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { TAILWIND_COLOR, formatAmount } from "~/utils";

interface TransactionType {
  id: string;
  amount: string;
  title: string;
  description: string | null;
  type: string;
  createdAt: string;
  currency: {
    code: string;
  };
  category: {
    name: string;
    icon: string;
    color: string;
  };
}

interface OptionProps {
  onEdit: () => void;
  onDelete: () => void;
}

function TransactionOptions({ onEdit, onDelete }: OptionProps) {
  return (
    <div className="absolute right-1 top-[50%] -translate-y-[50%] h-6 w-6">
      <DropdownMenu>
        <DropdownMenuTrigger className="h-6 w-6">
          <MoreVerticalIcon className="h-6 w-6" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={onEdit}>
            <span className="mr-2">
              <Pen className="h-4 w-4" />
            </span>
            <span>Edit</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onDelete}>
            <span className="text-red-700 mr-2">
              <Trash2 className="h-4 w-4" />
            </span>
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function TransactionItem({ transaction }: { transaction: TransactionType }) {
  return (
    <div className="relative">
      <div className="flex items-center justify-between w-full bg-gray-50 rounded-lg pl-4 pr-8 py-2">
        <div className="flex items-center gap-2 basis-[33%]">
          <span className={TAILWIND_COLOR[transaction.category.color]}>
            <Icon
              icon={transaction.category.icon as LucideIconType}
              className="w-8 h-8"
            />
          </span>
          <div>
            <p className="text-xs">{transaction.category.name}</p>
            <p className="font-semibold">{transaction.title}</p>
          </div>
        </div>
        <div className="basis-[33%] text-center">
          <p className="text-sm">
            {format(transaction.createdAt, "d MMM. yy")}
          </p>
        </div>
        <div className="basis-[33%] flex items-center gap-2 justify-end">
          <span
            className={
              TAILWIND_COLOR[transaction.type === "income" ? "green" : "red"]
            }
          >
            {transaction.type === "income" ? (
              <ArrowUp className="w-4 h-4" />
            ) : (
              <ArrowDown className="w-4 h-4" />
            )}
          </span>
          <p className="text-lg font-semibold">
            {formatAmount(
              Number(transaction.amount),
              transaction.currency.code,
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

const Transaction = {
  Item: TransactionItem,
  Options: TransactionOptions,
};

export default Transaction;
