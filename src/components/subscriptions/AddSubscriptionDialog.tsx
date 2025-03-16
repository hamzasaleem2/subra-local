import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useState } from "react"
import { CustomSubscriptionForm, type SubscriptionFormData } from "./CustomSubscriptionForm"
import { toast } from "sonner"
import { useSubscriptions } from "@/lib/hooks"

export function AddSubscriptionDialog({ children }: { children?: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { addSubscription } = useSubscriptions()

  const [moreOptions, setMoreOptions] = useState({
    firstBillDate: null as Date | null,
    cycle: "monthly",
    duration: null as number | null,
  })

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      setMoreOptions({
        firstBillDate: null,
        cycle: "monthly",
        duration: null,
      });
    }
  };

  const handleSubmit = async (data: SubscriptionFormData) => {
    setIsSubmitting(true);
    try {
      await addSubscription({
        ...data,
        amount: parseFloat(data.amount),
        billingCycle: {
          frequency: moreOptions.cycle,
          startDate: moreOptions.firstBillDate?.getTime() ?? Date.now(),
          ...(moreOptions.duration ? { duration: moreOptions.duration } : {}),
        },
      });
      toast.success("Subscription added successfully");
      setOpen(false);
    } catch (error: unknown) {
      console.error("Error adding subscription:", error);
      toast.error("Failed to add subscription");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children ?? (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Subscription
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto overscroll-contain -webkit-overflow-scrolling-touch">
        <DialogTitle></DialogTitle>
        <div className="space-y-6">
          <h2 className="text-lg font-semibold">Add Subscription</h2>

          <CustomSubscriptionForm
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            showMoreOptions={true}
            moreOptions={moreOptions}
            onMoreOptionsChange={setMoreOptions}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
} 