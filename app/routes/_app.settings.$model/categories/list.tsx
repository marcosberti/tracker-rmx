import { Trash2 } from "lucide-react";

import { Icon, LucideIconType } from "~/components/components";
import { Button } from "~/components/ui/button";
import { Categories } from "~/models/categories.server";
import { TAILWIND_BG, TAILWIND_COLOR } from "~/utils";

interface CompProps<Item> {
  items: Item[];
  isSubmitting: boolean;
}

export default function CategoryList(props: CompProps<Categories>) {
  const { items, isSubmitting } = props;

  return items.map((item) => (
    <div
      key={item.id}
      className={`flex gap-4 items-center ${
        TAILWIND_BG[item.color]
      } bg-opacity-20 rounded-lg p-4`}
    >
      <div className={`basis-[50%] ${TAILWIND_COLOR[item.color]} w-12`}>
        <Icon icon={item.icon as LucideIconType} />
        <p className="text-xs">{item.name}</p>
      </div>
      <div className="basis-[50%]">
        <Button
          type="submit"
          name="category"
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
