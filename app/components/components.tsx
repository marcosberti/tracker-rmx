import { Link, useLocation } from "@remix-run/react";
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
  }

  return (
    <>
      <input name={name} value={icon} type="hidden" />
      <Popover open={open} onOpenChange={setOpen}>
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
            <CommandInput placeholder="Search an icon..." />
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
          {location.pathname.endsWith(tab) ? (
            <div className="absolute h-[2px] w-[50%] bg-primary bottom-0 left-[50%] translate-x-[-50%]" />
          ) : null}
        </div>
      ))}
    </div>
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
