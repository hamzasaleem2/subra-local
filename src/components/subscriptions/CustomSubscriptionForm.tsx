import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ColorPicker } from "@/components/ui/color-picker";
import { IconPicker } from "@/components/ui/icon-picker";
import { CategoryInput } from "./CategoryInput";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { SubscriptionMoreOptions } from "./SubscriptionMoreOptions";
import { usePreferences, useCurrencies } from "@/lib/hooks";
import type { Currency } from "@/lib/db/types";

interface MoreOptions {
  firstBillDate: Date | null;
  cycle: string;
  duration: number | null;
}

interface CustomSubscriptionFormProps {
  onSubmit: (formData: SubscriptionFormData) => Promise<void>;
  isSubmitting: boolean;
  defaultValues?: {
    name: string;
    description: string;
    amount: string;
    currency: string;
    color?: string;
    icon?: string;
    categories: string[];
  };
  showMoreOptions?: boolean;
  hideMoreOptionsToggle?: boolean;
  moreOptions?: MoreOptions;
  onMoreOptionsChange?: (options: MoreOptions) => void;
}

export interface SubscriptionFormData {
  name: string;
  amount: string;
  description?: string;
  category?: string;
  url?: string;
}

export function CustomSubscriptionForm({
  onSubmit,
  isSubmitting,
  defaultValues,
  showMoreOptions = true,
  hideMoreOptionsToggle,
  moreOptions,
  onMoreOptionsChange,
}: CustomSubscriptionFormProps) {
  const { preferences } = usePreferences();
  const { currencies } = useCurrencies();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    amount: "",
    currency: preferences.defaultCurrency,
    color: "#000000",
    icon: undefined,
    categories: [] as string[],
    ...defaultValues,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.amount.trim()) {
      toast.error("Name and amount are required");
      return;
    }
    await onSubmit(formData);
  };

  const SUGGESTED_CATEGORIES = [
    "Personal",
    "Work",
    "Family",
    "Business",
    "Entertainment",
    "Education"
  ];

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="relative">
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: formData.color || 'transparent' }}
            >
              <IconPicker
                icon={formData.icon}
                onChange={(icon) => setFormData(prev => ({ ...prev, icon }))}
                triggerClassName="w-12 h-12 p-0 hover:bg-transparent"
              />
            </div>
            <ColorPicker
              color={formData.color}
              onChange={(color) => setFormData(prev => ({ ...prev, color }))}
              triggerClassName="absolute -bottom-2 -right-2 w-6 h-6 rounded-full border-2 border-background"
            />
          </div>

          <div className="flex-1 flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                disabled={isSubmitting}
                className="w-full"
              />
            </div>
            <div className="flex flex-row gap-2 w-full sm:w-auto">
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, amount: e.target.value }))
                }
                className="flex-1 sm:w-32"
                required
              />
              <Select 
                value={formData.currency} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}
              >
                <SelectTrigger className="w-28 sm:w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency: Currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      {currency.code} ({currency.symbol})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
          />
        </div>

        <div className="space-y-2">
          <Label>Categories</Label>
          <CategoryInput
            categories={formData.categories}
            onChange={(categories) =>
              setFormData((prev) => ({ ...prev, categories }))
            }
            suggestions={SUGGESTED_CATEGORIES}
            placeholder="Add categories..."
          />
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save"}
        </Button>
      </form>

      {showMoreOptions && moreOptions && onMoreOptionsChange && (
        <SubscriptionMoreOptions
          firstBillDate={moreOptions.firstBillDate}
          onFirstBillDateChange={(date) =>
            onMoreOptionsChange({ ...moreOptions, firstBillDate: date })
          }
          cycle={moreOptions.cycle}
          onCycleChange={(cycle) =>
            onMoreOptionsChange({ ...moreOptions, cycle })
          }
          duration={moreOptions.duration}
          onDurationChange={(duration) =>
            onMoreOptionsChange({ ...moreOptions, duration })
          }
          hideToggle={hideMoreOptionsToggle}
        />
      )}
    </div>
  );
} 