import { formatCurrency } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSubscriptions, usePreferences } from "@/lib/hooks";
import { calculateMonthlyTotal, calculateWeeklyTotal, calculateYearlyTotal, convertToUSD } from "@/lib/db/functions/calculators";
import { useEffect, useState } from "react";

export function ExpenseSummary() {
  const { subscriptions } = useSubscriptions();
  const { preferences } = usePreferences();
  const [viewPeriod, setViewPeriod] = useState<"monthly" | "weekly" | "yearly">("monthly");
  const [total, setTotal] = useState(0);
  const [currencyBreakdown, setCurrencyBreakdown] = useState<Map<string, { total: number; count: number; totalInUSD: number }>>(new Map());

  const handleCyclePeriod = () => {
    const periods = ["monthly", "weekly", "yearly"] as const;
    const currentIndex = periods.indexOf(viewPeriod);
    setViewPeriod(periods[(currentIndex + 1) % periods.length]);
  };

  const getLabel = () => {
    switch (preferences.totalViewType) {
      case "average":
        switch (viewPeriod) {
          case "yearly": return "Average per year";
          case "weekly": return "Average per week";
          default: return "Average per month";
        }
      case "remaining":
        switch (viewPeriod) {
          case "yearly": return "Remaining this year";
          case "weekly": return "Due this week";
          default: return "Due this month";
        }
      case "total":
      default:
        switch (viewPeriod) {
          case "yearly": return "Total per year";
          case "weekly": return "Total per week";
          default: return "Total per month";
        }
    }
  };

  useEffect(() => {
    const updateTotals = async () => {
      if (!subscriptions || subscriptions.length === 0) {
        setTotal(0);
        setCurrencyBreakdown(new Map());
        return;
      }

      const defaultCurrency = preferences.defaultCurrency;
      let calculatedTotal = 0;

      switch (viewPeriod) {
        case "yearly":
          calculatedTotal = await calculateYearlyTotal(subscriptions, defaultCurrency);
          break;
        case "monthly":
          calculatedTotal = await calculateMonthlyTotal(subscriptions, defaultCurrency);
          break;
        case "weekly":
          calculatedTotal = await calculateWeeklyTotal(subscriptions, defaultCurrency);
          break;
      }

      setTotal(calculatedTotal);

      const breakdown = new Map<string, { total: number; count: number; totalInUSD: number }>();
      
      for (const sub of subscriptions) {
        const existing = breakdown.get(sub.currency) || { total: 0, count: 0, totalInUSD: 0 };
        let amount = sub.amount;

        switch (viewPeriod) {
          case "yearly":
            switch (sub.billingCycle.frequency) {
              case "weekly": amount *= 52; break;
              case "monthly": amount *= 12; break;
              case "quarterly": amount *= 4; break;
            }
            break;
          case "monthly":
            switch (sub.billingCycle.frequency) {
              case "weekly": amount *= 52/12; break;
              case "quarterly": amount /= 3; break;
              case "yearly": amount /= 12; break;
            }
            break;
          case "weekly":
            switch (sub.billingCycle.frequency) {
              case "monthly": amount *= 12/52; break;
              case "quarterly": amount *= 4/52; break;
              case "yearly": amount /= 52; break;
            }
            break;
        }

        const amountInUSD = convertToUSD(amount, sub.currency);
        
        breakdown.set(sub.currency, {
          total: existing.total + amount,
          count: existing.count + 1,
          totalInUSD: existing.totalInUSD + amountInUSD
        });
      }

      setCurrencyBreakdown(breakdown);
    };

    updateTotals();
  }, [subscriptions, viewPeriod, preferences.totalViewType, preferences.defaultCurrency]);

  if (!subscriptions) {
    return (
      <div id="expense-summary" className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t z-40">
        <div className="container max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div id="expense-summary" className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t z-40">
      <div className="container max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  onClick={handleCyclePeriod}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {getLabel()}
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Click to change period</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {preferences.totalViewType === "average" 
                    ? "Shows the average cost across all subscriptions"
                    : preferences.totalViewType === "remaining"
                    ? "Shows upcoming payments in the selected period"
                    : "Shows the total cost for all subscriptions"}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div>
          <Popover>
            <PopoverTrigger asChild>
              <button className="font-medium hover:opacity-80 transition-opacity">
                {formatCurrency(total, preferences.defaultCurrency)}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <ScrollArea className="h-80">
                <div className="space-y-4">
                  <h4 className="font-medium leading-none">Currency Breakdown</h4>
                  <div className="space-y-2">
                    {Array.from(currencyBreakdown.entries())
                      .sort((a, b) => b[1].totalInUSD - a[1].totalInUSD) // Sort by USD value
                      .map(([currency, { total, count, totalInUSD }]) => (
                      <div key={currency} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{currency}</span>
                          <span className="text-xs text-muted-foreground">
                            ({count} {count === 1 ? 'subscription' : 'subscriptions'})
                          </span>
                        </div>
                        <div className="flex flex-col items-end">
                          <span>{formatCurrency(total, currency)}</span>
                          <span className="text-xs text-muted-foreground">
                            ≈ {formatCurrency(totalInUSD, 'USD')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollArea>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}