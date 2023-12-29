import {
  Form,
  Link,
  useLocation,
  useSearchParams,
  useSubmit,
} from "@remix-run/react";
import { icons as LucideIcons, ChevronsUpDown } from "lucide-react";
import React from "react";

import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { getParamsMonth } from "~/utils";

import { Input } from "./ui/input";
import { Label } from "./ui/label";

export type LucideIconType = keyof typeof LucideIcons;

interface IconTypes {
  icon: LucideIconType;
  className?: string;
}

export function Icon({ icon, className }: IconTypes) {
  // eslint-disable-next-line import/namespace
  const IconComp = (LucideIcons[icon] ??
    LucideIcons.AlertTriangle) as React.ElementType;

  return <IconComp className={className} />;
}

interface IconsComboboxInterface {
  name: string;
}

export function IconsCombobox({ name }: IconsComboboxInterface) {
  const [open, setOpen] = React.useState(false);
  const [term, setTerm] = React.useState("");
  const [icon, setIcon] = React.useState("");

  let icons = Object.keys(LucideIcons) as (keyof typeof LucideIcons)[];

  if (term) {
    icons = icons.filter((icon) => icon.toLocaleLowerCase().includes(term));
  } else {
    icons = icons.slice(0, 50);
  }

  const handleOpenChange = (state: boolean) => {
    setTerm("");
    setOpen(state);
  };

  return (
    <>
      <input name={name} value={icon} type="hidden" />
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="justify-between w-full"
          >
            {icon ? icons.find((i) => i === icon) : "Select an icon..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className=" p-0">
          <Command>
            <CommandInput
              placeholder="Search an icon..."
              onValueChange={(value) => setTerm(value)}
            />
            <CommandEmpty>No icons found.</CommandEmpty>
            <CommandGroup className="h-[250px] overflow-y-scroll">
              {icons.map((icon) => (
                <CommandItem
                  key={icon}
                  value={icon}
                  className="text-gray-600 flex gap-2"
                  onSelect={() => {
                    setTerm("");
                    setIcon(icon);
                    setOpen(false);
                  }}
                >
                  <Icon icon={icon} className="h-4 w-4" />
                  {icon}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
}

export function ErrorMessage({
  message,
}: {
  message: string | null | undefined;
}) {
  return message ? (
    <em id="name-error" className="pl-1 text-xs text-red-400">
      {message}
    </em>
  ) : null;
}

export function Tabs({ tabs }: { tabs: string[] }) {
  const location = useLocation();

  return (
    <div className="flex gap-2">
      {tabs.map((tab) => (
        <div key={tab} className="relative pb-1">
          <Link to={tab} className="text-sm font-light">
            {tab}
          </Link>
          <div
            className={`absolute h-[2px] w-[50%] bg-primary bottom-0 left-[50%] translate-x-[-50%] transition-all duration-300 ease-out ${
              location.pathname.endsWith(tab) ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>
      ))}
    </div>
  );
}

export function MonthFilter() {
  const submit = useSubmit();
  const [searchParams] = useSearchParams();
  const { month, year } = getParamsMonth(searchParams);
  const value = `${year}-${month + 1}`;
  return (
    <Form method="get" onChange={(e) => submit(e.currentTarget)}>
      <Label htmlFor="month" className="sr-only">
        Month
      </Label>
      <Input id="month" name="month" type="month" value={value} />
    </Form>
  );
}

interface OverviewType {
  income: string;
  expense: string;
  balance: string;
}

export function Overview({ income, expense, balance }: OverviewType) {
  return (
    <div className="w-full basis-auto border-2 border-gray-100 rounded-lg p-4 flex justify-between items-center">
      <div className="text-center">
        <p className="text-xs font-semibold text-gray-400">income</p>
        <p className="text-2xl font-bold">{income}</p>
      </div>
      <div className="text-center">
        <p className="text-xs font-semibold text-gray-400">expense</p>
        <p className="text-2xl font-bold">{expense}</p>
      </div>
      <div className="text-center">
        <p className="text-xs font-semibold text-gray-400">balance</p>
        <p className="text-2xl font-bold">{balance}</p>
      </div>
    </div>
  );
}
