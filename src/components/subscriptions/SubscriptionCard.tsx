import { formatTimeUntil } from "@/lib/db/functions/calculators"
import { formatCurrency } from "@/lib/utils"
import { useState } from "react"
import { EditSubscriptionDialog } from "./EditSubscriptionDialog"
import { SubscriptionActions } from "./SubscriptionActions"
import React from "react"
import * as Icons from "lucide-react"
import type { SubscriptionWithId } from "@/lib/hooks/useSubscriptions"
import type { LucideIcon } from 'lucide-react'

interface Props {
  subscription: SubscriptionWithId
}

function formatFrequency(frequency: string): string {
  switch (frequency) {
    case 'weekly':
      return 'week'
    case 'monthly':
      return 'month'
    case 'quarterly':
      return 'quarter'
    case 'yearly':
      return 'year'
    default:
      return frequency
  }
}

function getNextPaymentClass(daysUntil: number): string {
  if (daysUntil < 0) return 'text-destructive'
  if (daysUntil <= 7) return 'text-warning'
  return 'text-muted-foreground'
}

export function SubscriptionCard({ subscription }: Props) {
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const nextPayment = subscription.nextPayment
  const timeUntil = formatTimeUntil(nextPayment.dueDate)
  const timeClass = getNextPaymentClass(
    Math.floor((nextPayment.dueDate - Date.now()) / (1000 * 60 * 60 * 24))
  )

  const handleEditDialogChange = (open: boolean) => {
    setEditDialogOpen(open)
  }

  return (
    <>
      <div 
        className="flex items-center justify-between p-3 sm:p-3 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer group relative"
        onClick={() => setEditDialogOpen(true)}
      >
        <div className="flex items-center gap-2 sm:gap-2 flex-1 min-w-0">
          <div 
            className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg flex-shrink-0"
            style={{
              backgroundColor: subscription.color || 'transparent',
              color: subscription.color ? '#fff' : 'currentColor'
            } as React.CSSProperties}
          >
            {subscription.icon ? (
              <span className="text-base sm:text-lg">
                {React.createElement(
                  Icons[subscription.icon as keyof typeof Icons] as LucideIcon, 
                  { className: "h-4 w-4" }
                )}
              </span>
            ) : (
              <span className="text-base sm:text-lg font-medium">
                {subscription.name[0]}
              </span>
            )}
          </div>
          
          <div className="space-y-0.5 min-w-0">
            <h3 className="font-medium text-sm truncate">{subscription.name}</h3>
            <p className={`text-[10px] sm:text-xs ${timeClass}`}>
              {timeUntil}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <div className="text-right">
            <p className="font-medium text-xs sm:text-sm">
              {formatCurrency(subscription.amount, subscription.currency)}
            </p>
            <p className="text-[9px] sm:text-[10px] text-muted-foreground">
              per {formatFrequency(subscription.billingCycle.frequency)}
            </p>
          </div>

          <div 
            className="text-muted-foreground opacity-100 sm:opacity-40 sm:group-hover:opacity-100 transition-opacity p-0.5 sm:p-0" 
            onClick={e => e.stopPropagation()}
          >
            <SubscriptionActions 
              subscription={subscription} 
              onEdit={() => setEditDialogOpen(true)}
            />
          </div>
        </div>
      </div>

      <EditSubscriptionDialog
        subscription={subscription}
        open={editDialogOpen}
        onOpenChange={handleEditDialogChange}
      />
    </>
  )
} 