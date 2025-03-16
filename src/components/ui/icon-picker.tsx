import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import * as Icons from "lucide-react";
import React from "react";

const ICONS = [
  "Smartphone", "Laptop", "Tv", "Gamepad", "Headphones", 
  "Music", "Video", "Film", "Book", "Newspaper",
  "Code", "Terminal", "Cloud", "Database", "Server",
  "Car", "Plane", "Train", "Home", "Building",
  "ShoppingBag", "CreditCard", "Wallet", "DollarSign", "PiggyBank"
] as const;

type IconName = typeof ICONS[number];

interface IconPickerProps {
  icon?: string;
  onChange: (icon: string | undefined) => void;
  triggerClassName?: string;
}

export function IconPicker({ icon, onChange, triggerClassName }: IconPickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className={cn(
            "w-full h-full p-0 border-dashed",
            !icon && "text-muted-foreground",
            triggerClassName
          )}
        >
          {icon && Icons[icon as IconName] ? (
            React.createElement(Icons[icon as IconName], { className: "h-4 w-4" })
          ) : (
            <Icons.Plus className="h-4 w-4" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid grid-cols-5 gap-2">
          {ICONS.map((iconName) => {
            const IconComponent = Icons[iconName as keyof typeof Icons] as React.ComponentType<{ className?: string }>;
            return (
              <Button
                key={iconName}
                variant="outline"
                className={cn(
                  "h-10 w-10 p-0",
                  icon === iconName && "bg-accent text-accent-foreground border-accent"
                )}
                onClick={() => onChange(iconName)}
              >
                <IconComponent className="h-4 w-4" />
              </Button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
} 