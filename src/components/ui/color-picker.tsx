import { cn } from "@/lib/utils";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

const COLORS = [
  "#EF4444", // red
  "#F97316", // orange
  "#F59E0B", // amber
  "#10B981", // emerald
  "#06B6D4", // cyan
  "#3B82F6", // blue
  "#6366F1", // indigo
  "#8B5CF6", // violet
  "#EC4899", // pink
  "#000000", // black
];

export function ColorPicker({ 
  color, 
  onChange,
  triggerClassName 
}: { 
  color?: string; 
  onChange: (color: string) => void;
  triggerClassName?: string;
}) {
  const defaultColor = color || COLORS[Math.floor(Math.random() * COLORS.length)];
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className={cn("w-8 h-8 rounded-full hover:bg-transparent", triggerClassName)}
          style={{ backgroundColor: defaultColor }}
        >
          <span className="sr-only">Pick a color</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-2">
        <div className="grid grid-cols-5 gap-1">
          {COLORS.map((c) => (
            <Button
              key={c}
              variant="outline"
              size="icon"
              className="w-8 h-8 rounded-full"
              style={{ backgroundColor: c }}
              onClick={() => onChange(c)}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
} 