import { ErrorMessage, IconsCombobox } from "~/components/components";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { COLORS, TAILWIND_BG } from "~/utils";
import { ErrorTypes } from "../route";

interface Props {
  errors: ErrorTypes | undefined;
}

export default function CategoryForm({ errors }: Props) {
  return (
    <>
      <div className="flex gap-4 ba">
        <div className="basis-[50%]">
          <Label htmlFor="name">
            Name
            <ErrorMessage message={errors?.name} />
          </Label>
          <Input
            id="name"
            name="name"
            aria-invalid={Boolean(errors?.name) || undefined}
            aria-errormessage={errors?.name ? "name-error" : undefined}
          />
        </div>
        <div className="basis-[50%]">
          <Label htmlFor="icon">
            Icon
            <ErrorMessage message={errors?.icon} />
          </Label>
          <div>
            <IconsCombobox name="icon" />
          </div>
        </div>
      </div>
      <div>
        <Label htmlFor="color">
          Color
          <ErrorMessage message={errors?.color} />
        </Label>
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
    </>
  );
}
