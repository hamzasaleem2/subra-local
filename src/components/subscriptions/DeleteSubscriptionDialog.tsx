import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useSubscriptions } from "@/lib/hooks"
import { toast } from "sonner"
import type { SubscriptionWithId } from "@/lib/hooks/useSubscriptions"

interface DeleteSubscriptionDialogProps {
  subscription: SubscriptionWithId
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteSubscriptionDialog({
  subscription,
  open,
  onOpenChange,
}: DeleteSubscriptionDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const { deleteSubscription } = useSubscriptions()

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteSubscription(subscription._id)
      toast.success("Subscription deleted successfully")
      onOpenChange(false)
    } catch (error) {
      console.error("Error deleting subscription:", error)
      toast.error("Failed to delete subscription")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Subscription</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete {subscription.name}? This action cannot
            be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 