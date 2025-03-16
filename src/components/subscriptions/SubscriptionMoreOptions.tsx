import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";

interface SubscriptionMoreOptionsProps {
  firstBillDate: Date | null;
  onFirstBillDateChange: (date: Date | null) => void;
  cycle: string;
  onCycleChange: (cycle: string) => void;
  duration: number | null;
  onDurationChange: (duration: number | null) => void;
  hideToggle?: boolean;
}

export function SubscriptionMoreOptions({
  firstBillDate,
  onFirstBillDateChange,
  cycle,
  onCycleChange,
  duration,
  onDurationChange,
  hideToggle = false,
}: SubscriptionMoreOptionsProps) {
  const [isExpanded, setIsExpanded] = useState(hideToggle);

  return (
    <div className="space-y-4">
      {!hideToggle && (
        <Button
          type="button"
          variant="ghost"
          className="w-full justify-between"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          More Options
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      )}

      {(isExpanded || hideToggle) && (
        <div className="space-y-4">
          <div>
            <Label>First Bill Date</Label>
            <DatePicker
              date={firstBillDate}
              onChange={onFirstBillDateChange}
            />
          </div>

          <div>
            <Label>Billing Cycle</Label>
            <Select value={cycle} onValueChange={onCycleChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select billing cycle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Duration (months)</Label>
            <Select 
              value={duration?.toString() || "ongoing"} 
              onValueChange={(val) => onDurationChange(val === "ongoing" ? null : Number(val))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ongoing">Ongoing</SelectItem>
                <SelectItem value="1">1 month</SelectItem>
                <SelectItem value="3">3 months</SelectItem>
                <SelectItem value="6">6 months</SelectItem>
                <SelectItem value="12">12 months</SelectItem>
                <SelectItem value="24">24 months</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
} 