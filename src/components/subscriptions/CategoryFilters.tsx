import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface CategoryFiltersProps {
  categories: string[];
  selectedCategories: string[];
  onCategorySelect: (category: string) => void;
}

export function CategoryFilters({
  categories,
  selectedCategories,
  onCategorySelect,
}: CategoryFiltersProps) {
  return (
    <ScrollArea className="w-full">
      <div className="flex flex-wrap gap-1.5 sm:gap-2 pb-4 px-1 max-h-[120px] overflow-y-auto">
        {categories.map((category) => (
          <Button
            key={category}
            variant="outline"
            size="sm"
            className={cn(
              "whitespace-nowrap py-1.5 px-3 h-auto min-h-[32px] touch-manipulation shrink-0",
              selectedCategories.includes(category) && "bg-primary text-primary-foreground"
            )}
            onClick={() => onCategorySelect(category)}
          >
            {category}
          </Button>
        ))}
      </div>
    </ScrollArea>
  );
} 