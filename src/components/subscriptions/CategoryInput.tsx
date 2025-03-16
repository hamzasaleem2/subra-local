import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";

interface CategoryInputProps {
  categories: string[];
  onChange: (categories: string[]) => void;
  suggestions?: string[];
  placeholder?: string;
}

export function CategoryInput({ 
  categories, 
  onChange, 
  placeholder 
}: CategoryInputProps) {
  const [newCategory, setNewCategory] = useState("");

  const handleAddCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      onChange([...categories, newCategory]);
      setNewCategory("");
    }
  };

  const handleRemoveCategory = (category: string) => {
    onChange(categories.filter((c) => c !== category));
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder={placeholder || "Add a category..."}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddCategory();
            }
          }}
        />
        <Button type="button" onClick={handleAddCategory} variant="outline">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Badge key={category} variant="secondary">
            {category}
            <button
              onClick={() => handleRemoveCategory(category)}
              className="ml-2 hover:text-destructive"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
} 