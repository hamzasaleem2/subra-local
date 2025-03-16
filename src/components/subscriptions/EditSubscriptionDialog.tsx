import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { CustomSubscriptionForm, type SubscriptionFormData } from "./CustomSubscriptionForm";
import { toast } from "sonner";
import { useState } from "react";
import { useSubscriptions } from "@/lib/hooks";
import type { SubscriptionWithId } from "@/lib/hooks/useSubscriptions";

interface EditSubscriptionDialogProps {
  subscription: SubscriptionWithId;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditSubscriptionDialog({
  subscription,
  open,
  onOpenChange,
}: EditSubscriptionDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { updateSubscription } = useSubscriptions();

  const [moreOptions, setMoreOptions] = useState({
    firstBillDate: subscription.billingCycle.startDate
      ? new Date(subscription.billingCycle.startDate)
      : null,
    cycle: subscription.billingCycle.frequency,
    duration: subscription.billingCycle.duration ?? null,
  });

  const handleSubmit = async (formData: SubscriptionFormData) => {
    setIsSubmitting(true);
    try {
      await updateSubscription(subscription._id, {
        ...formData,
        amount: parseFloat(formData.amount),
        billingCycle: {
          frequency: moreOptions.cycle,
          startDate: moreOptions.firstBillDate?.getTime() ?? Date.now(),
          ...(moreOptions.duration ? { duration: moreOptions.duration } : {}),
        },
      });

      toast.success("Subscription updated successfully");
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating subscription:", error);
      toast.error("Failed to update subscription");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto px-4 sm:px-6">
        <DialogTitle></DialogTitle>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Edit Subscription</h2>
          </div>

          <CustomSubscriptionForm
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            defaultValues={{
              name: subscription.name,
              description: subscription.description ?? "",
              amount: subscription.amount.toString(),
              currency: subscription.currency,
              color: subscription.color,
              icon: subscription.icon,
              categories: subscription.categories,
            }}
            moreOptions={moreOptions}
            onMoreOptionsChange={setMoreOptions}
            showMoreOptions={true}
            hideMoreOptionsToggle={true}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
} 