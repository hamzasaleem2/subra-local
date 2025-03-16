import { ExpenseSummary } from "./ExpenseSummary";
import { SubscriptionList } from "./SubscriptionList";

export function SubscriptionDashboard() {
  return (
    <div className="space-y-6 pb-24 sm:pb-16 px-4">
      <div id="subscription-list">
        <SubscriptionList />
      </div>
      <ExpenseSummary />
    </div>
  );
}