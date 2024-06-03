"use client";

import { useState } from "react";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface Props {
  items: {
    value: string;
    label: string;
  }[];
  selectedItem: string;
  setSelectedItem: React.Dispatch<React.SetStateAction<string>>;
  selectText?: string;
  searchText?: string;
  emptyText?: string;
  className?: string;
}

const Combobox: React.FC<Props> = ({
  items,
  selectedItem,
  setSelectedItem,
  selectText,
  searchText,
  emptyText,
  className,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          {selectedItem
            ? items.find((item) => item.value === selectedItem)?.label
            : selectText}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <CommandInput placeholder={searchText ?? "Search"} />
          <CommandEmpty>{emptyText ?? "No items found."}</CommandEmpty>
          <CommandGroup>
            <CommandList>
              {items.map((item) => (
                <CommandItem
                  key={item.value}
                  // We set the value to label, so the search works
                  value={item.label}
                  onSelect={() => {
                    setSelectedItem(item.value);
                    setOpen(false);
                  }}
                >
                  <CheckIcon
                    className={`mr-2 h-4 w-4 ${selectedItem === item.value ? "opacity-100" : "opacity-0"}`}
                  />
                  {item.label}
                </CommandItem>
              ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default Combobox;
