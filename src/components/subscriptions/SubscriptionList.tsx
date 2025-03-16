import { useState, useMemo } from "react";
import { SubscriptionCard } from "./SubscriptionCard";
import { CategoryFilters } from "./CategoryFilters";
import { normalizeCategory } from "@/lib/utils";
import { AddSubscriptionDialog } from "./AddSubscriptionDialog";
import { Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useSubscriptions, usePreferences } from "@/lib/hooks";

export function SubscriptionList() {
  const { subscriptions, isLoading } = useSubscriptions();
  const { preferences } = usePreferences();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const uniqueCategories = useMemo(() => {
    if (!subscriptions) return [];
    
    const categorySet = new Set<string>();
    
    subscriptions.forEach((subscription) => {
      subscription.categories.forEach((category) => {
        categorySet.add(normalizeCategory(category));
      });
    });
    
    return Array.from(categorySet).sort();
  }, [subscriptions]);

  const filteredSubscriptions = useMemo(() => {
    if (!subscriptions) return null;
    
    const filtered = selectedCategories.length === 0 
      ? subscriptions 
      : subscriptions.filter((subscription) => {
          const normalizedSubscriptionCategories = subscription.categories.map(normalizeCategory);
          return selectedCategories.some(category => 
            normalizedSubscriptionCategories.includes(category)
          );
        });

    return filtered.sort((a, b) => {
      switch (preferences.sortSubscriptionsBy) {
        case "amount":
          return b.amount - a.amount;
        case "dueDate":
        case "nextPayment":
          return a.nextPayment.dueDate - b.nextPayment.dueDate;
        case "name":
        default:
          return a.name.localeCompare(b.name);
      }
    });
  }, [subscriptions, selectedCategories, preferences.sortSubscriptionsBy]);

  const handleCategorySelect = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const NewSubscriptionCard = () => (
    <AddSubscriptionDialog>
      <Card 
        className="flex items-center justify-center p-3 border border-dashed 
          hover:bg-accent/50 transition-colors cursor-pointer group h-[44px]"
      >
        <div className="flex items-center gap-2 text-muted-foreground group-hover:text-foreground">
          <Plus className="h-4 w-4" />
          <span className="text-sm font-medium">Add Subscription</span>
        </div>
      </Card>
    </AddSubscriptionDialog>
  );

  if (isLoading || !subscriptions) {
    return (
      null
    );
  }

  if (subscriptions.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8 text-muted-foreground">
          No subscriptions yet
        </div>
        <NewSubscriptionCard />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {uniqueCategories.length > 0 && (
        <CategoryFilters
          categories={uniqueCategories}
          selectedCategories={selectedCategories}
          onCategorySelect={handleCategorySelect}
        />
      )}
      
      <div className="space-y-4">
        {filteredSubscriptions?.map((subscription) => (
          <SubscriptionCard 
            key={subscription._id} 
            subscription={subscription} 
          />
        ))}
        <NewSubscriptionCard />
      </div>
    </div>
  );
} 