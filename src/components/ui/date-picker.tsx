import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SelectSingleEventHandler } from "react-day-picker";

interface DatePickerProps {
  date: Date | null;
  onChange: (date: Date | null) => void;
}

export function DatePicker({ date, onChange }: DatePickerProps) {
  const handleSelect: SelectSingleEventHandler = (day) => {
    onChange(day ?? null);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : "Pick a date"}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-auto p-0" 
        align="start"
        style={{ zIndex: 9999 }}
      >
        <Calendar
          mode="single"
          selected={date ?? undefined}
          onSelect={handleSelect}
        />
      </PopoverContent>
    </Popover>
  );
} 