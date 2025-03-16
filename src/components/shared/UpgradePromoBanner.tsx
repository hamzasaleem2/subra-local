import { Button } from "@/components/ui/button"
import { ExternalLink, X } from "lucide-react"
import { useState } from "react"

export function UpgradePromoBanner() {
  const [isHidden, setIsHidden] = useState(() => {
    const hidden = localStorage.getItem("hideUpgradePromoBanner")
    return hidden === "true"
  })

  if (isHidden) return null

  const handleDismiss = () => {
    localStorage.setItem("hideUpgradePromoBanner", "true")
    setIsHidden(true)
  }

  return (
    <div className="relative bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b">
      <div className="container max-w-7xl py-3 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-x-2 sm:gap-x-6">
          <div className="flex items-center gap-x-2 sm:gap-x-4 min-w-0">
            <p className="text-xs sm:text-sm leading-6 truncate">
              <strong className="font-semibold whitespace-nowrap">Subra Cloud </strong>
              <span className="hidden sm:inline">
                Get email reminders, multi-device sync, and more features on{" "}
                <span className="font-medium text-primary">subra.app</span>
              </span>
              <span className="sm:hidden">
                Get email reminders & more
              </span>
            </p>
          </div>
          <div className="flex flex-none items-center gap-x-2 sm:gap-x-4">
            <a
              href="https://subra.app"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="default" size="sm" className="h-7 sm:h-8 px-2 sm:px-3">
                <span className="text-xs sm:text-sm">Upgrade</span>
                <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 ml-1.5" />
              </Button>
            </a>
            <Button
              variant="ghost"
              size="sm"
              className="p-0 h-7 w-7 sm:h-8 sm:w-8"
              onClick={handleDismiss}
            >
              <span className="sr-only">Dismiss</span>
              <X className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 